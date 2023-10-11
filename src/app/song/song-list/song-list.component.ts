import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Song, songMatches, songSort } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

  public readonly searchControl = new UntypedFormControl('');

  private readonly _searchSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private readonly _songs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  public readonly songs$: Observable<Song[]> = combineLatest(
    [this._songs$.asObservable(), this._searchSubject$.asObservable()]
  ).pipe(
    map(([songs, searchTerm]) => songs.filter(s => songMatches(s, searchTerm))),
    map(songs => songs.sort(songSort)),
  );

  constructor(private readonly songProvider: SongProviderService, 
              private readonly activatedRoute: ActivatedRoute
    ) { }

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
