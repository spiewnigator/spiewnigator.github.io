import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';
import { map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SettingsService } from 'src/app/service/settings.service';
import { Location } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-song-view',
    templateUrl: './song-view.component.html',
    styleUrls: ['./song-view.component.scss'],
    imports: [MatToolbar, MatIconButton, MatIcon, MatMenuTrigger, MatMenu, MatMenuItem, MatSlideToggle, ReactiveFormsModule, FormsModule, MatSlider, MatSliderThumb, MatCard, MatCardHeader, MatCardSubtitle, MatCardContent]
})
export class SongViewComponent implements OnInit {
  private readonly songProvider = inject(SongProviderService);
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly settings = inject(SettingsService);
  readonly location = inject(Location);


  public song: Song | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      map(p => p.get('id')),
      switchMap(id => id != null ? this.songProvider.getOne(+id) : throwError('id path param is null'))
    ).subscribe(
      data => this.song = data
    )
  }

}
