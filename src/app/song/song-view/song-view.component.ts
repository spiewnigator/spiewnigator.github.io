import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';
import { map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-song-view',
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.scss']
})
export class SongViewComponent implements OnInit {

  public song: Song | undefined = undefined;

  constructor(private readonly songProvider: SongProviderService,
    private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      map(p => p.get('id')),
      switchMap(id => id ? this.songProvider.getOne(+id) : throwError('id path param is null'))
    ).subscribe(
      data => this.song = data
    )
  }

}
