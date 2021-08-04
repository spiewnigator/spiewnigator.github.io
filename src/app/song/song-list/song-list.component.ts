import { Component, OnInit } from '@angular/core';
import { Song } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

  public songs: Song[] = [];

  constructor(private readonly songProvider: SongProviderService) { }

  ngOnInit(): void {
    this.songProvider.getAll().subscribe(data => this.songs = data)
  }

}
