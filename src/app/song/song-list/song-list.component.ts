import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Song } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';

function songMatches(song: Song, term: string): boolean {
  const t = term.toLocaleLowerCase();

  return t === '' ||
    song.title.toLocaleLowerCase().includes(t) ||
    !!song.author?.toLocaleLowerCase().includes(t);
}

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

  public readonly searchControl = new FormControl('');

  private readonly _searchSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private readonly _songs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  public readonly songs$: Observable<Song[]> = combineLatest(
    [this._songs$.asObservable(), this._searchSubject$.asObservable()]
  ).pipe(
    map(([songs, searchTerm]) => songs.filter(s => songMatches(s, searchTerm)))
  );

  constructor(private readonly songProvider: SongProviderService) { }

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
