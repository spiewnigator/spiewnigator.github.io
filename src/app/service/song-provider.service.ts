import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Song } from '../model/song';

@Injectable({
  providedIn: 'root'
})
export class SongProviderService {

  private readonly filepath = 'assets/songs_structured.json';

  constructor(private readonly http: HttpClient) { }

  public getAll(): Observable<Song[]> {
    return this.http.get<Song[]>(this.filepath);
  }

  public getOne(index: number): Observable<Song> {
    return this.getAll().pipe(
      map(songs => songs[index])
    )
  }
}
