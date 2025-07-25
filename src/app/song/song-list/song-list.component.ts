import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Song, songMatches, songSort } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatPrefix, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatNavList, MatListItem } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-song-list',
    templateUrl: './song-list.component.html',
    styleUrls: ['./song-list.component.scss'],
    imports: [MatToolbar, MatIconButton, RouterLink, MatIcon, MatCard, MatFormField, MatPrefix, MatLabel, MatInput, ReactiveFormsModule, MatSuffix, MatNavList, MatListItem, AsyncPipe]
})
export class SongListComponent implements OnInit {
  private readonly songProvider = inject(SongProviderService);
  private readonly activatedRoute = inject(ActivatedRoute);


  public readonly searchControl = new UntypedFormControl('');

  private readonly _searchSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private readonly _songs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  public readonly songs$: Observable<Song[]> = combineLatest(
    [this._songs$.asObservable(), this._searchSubject$.asObservable()]
  ).pipe(
    map(([songs, searchTerm]) => songs.filter(s => songMatches(s, searchTerm))),
    map(songs => songs.sort(songSort)),
  );

  constructor() { }

  ngOnInit(): void {
    this.songProvider.getAll().subscribe(
      data => this._songs$.next(data),
      error => this._songs$.error(error)
    );

    this.searchControl.valueChanges.pipe(
      debounceTime(200)
    ).subscribe(
      value => this._searchSubject$.next(value),
      error => this._searchSubject$.error(error)
    )
  }
}
