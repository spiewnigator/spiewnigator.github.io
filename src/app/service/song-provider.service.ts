import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseSongRaw, Song, SongRaw } from '../model/song';

@Injectable({
  providedIn: 'root'
})
export class SongProviderService implements OnDestroy {
  private readonly http = inject(HttpClient);


  public readonly filepath = 'assets/songs_structured.json';

  private readonly _songCache: Subject<Song[]> = new BehaviorSubject<Song[]>([])

  constructor() { 
    this.http.get<SongRaw[]>(this.filepath).pipe(
      map(raw => raw.map((r, i) => parseSongRaw(r, i)))
    ).subscribe(
      n => this._songCache.next(n),
      e => this._songCache.error(e)
    )
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
}
