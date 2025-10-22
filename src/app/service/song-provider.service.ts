import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseSongRaw, Song, SongRaw, songMatches, songSort, lyricsToString } from '../model/song';
import Fuse, { IFuseOptions } from 'fuse.js';

@Injectable({
  providedIn: 'root'
})
export class SongProviderService implements OnDestroy {
  private readonly http = inject(HttpClient);

  public readonly filepath = 'assets/songs_structured.json';

  private readonly _songCache: Subject<Song[]> = new BehaviorSubject<Song[]>([])

  private fuse: Fuse<Song>;
  private readonly fuseOptions: IFuseOptions<Song>;

  constructor() { 
    this.http.get<SongRaw[]>(this.filepath).pipe(
      map(raw => raw.map((r, i) => parseSongRaw(r, i)))
    ).subscribe(
      n => {
        this._songCache.next(n);
        this.initializeSearch(n);
      },
      e => this._songCache.error(e)
    )

    // init fuse
    this.fuseOptions = {
      keys: ['title', 'author', {name: 'lyrics', getFn: lyricsToString}],
      threshold: 0.4,
      distance: 100,
      includeMatches: true,
      minMatchCharLength: 2
    };
    // Initialize with empty array, will be set later
    this.fuse = new Fuse([], this.fuseOptions);
  }

  initializeSearch(songs: Song[]): void {
    this.fuse = new Fuse(songs, this.fuseOptions);
  }

  /**
   * Cleanup
   */
  ngOnDestroy(): void {
    this._songCache.complete();
  }

  public getAll(): Observable<Song[]> {
    return this._songCache.asObservable();
  }

  public getOne(index: number): Observable<Song> {
    return this._songCache.pipe(
      map(songs => songs[index])
    )
  }

  public search(query: string): Observable<Song[]> {
    if (!query || query.trim().length === 0) {
      return this.getAll();
    }

    const results = this.fuse.search(query);

    if (results.length === 0) {
      // fallback to old 
      console.log('Fallback search for query:', query);
      return this.getAll().pipe(
          map(songs => songs.filter(s => songMatches(s, query))),
          map(songs => songs.sort(songSort)),
        );
    }

    return of(results.map(r => r.item));
  }
}
