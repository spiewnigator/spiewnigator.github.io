import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseSongRaw, Song, SongRaw } from '../model/song';

@Injectable({
  providedIn: 'root'
})
export class SongProviderService {

  private readonly filepath = 'assets/songs_structured.json';

  constructor(private readonly http: HttpClient) { }

  public getAll(): Observable<Song[]> {
    return this.http.get<SongRaw[]>(this.filepath).pipe(
      map(raw => raw.map((r, i) => parseSongRaw(r, i)))
    );
  }

  public getOne(index: number): Observable<Song> {
    return this.getAll().pipe(
      map(songs => songs[index])
    )
  }
}
