import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { SettingsService } from './settings.service';
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
  private readonly settings = inject(SettingsService);

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
      keys: [
        {name: 'title', weight: 5}, 
        {name: 'author', weight: 1}, 
        {name: 'lyrics', getFn: lyricsToString, weight: 3}
      ],
      threshold: 0.2,
      includeMatches: true,
      minMatchCharLength: 3,
      ignoreDiacritics: true,
      ignoreLocation: true
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

  private searchStandard(query: string): Observable<Song[]> {
    return this.getAll().pipe(
      map(songs => songs.filter(s => songMatches(s, query))),
      map(songs => songs.sort(songSort)),
    );
  }

  private fuzzySearch(query: string): Song[] {
    return this.fuse.search(query).map(r => r.item);
  }

  public search(query: string): Observable<Song[]> {
    if (!query || query.trim().length === 0) {
      return this.getAll().pipe(
        map(songs => songs.sort(songSort))
      );
    }

    // If fuzzy search is disabled, use the standard search implementation
    if (!this.settings.enableFuzzySearch) {
      return this.searchStandard(query).pipe(
        map(songs => {
          if (songs.length === 0) {
            console.log('No standard results for query (fuzzy search secondary):', query);
            return this.fuzzySearch(query);
          }
          return songs;
        })
      );
    }

    // Fuzzy search enabled: use Fuse.js first, fall back to standard search when no results
    const results = this.fuse.search(query).map(r => r.item);
    if (results.length === 0) {
      // fallback to old
      console.log('Fallback search for query (fuzzy produced no results):', query);
      return this.searchStandard(query);
    }

    return of(results);
  }
}
