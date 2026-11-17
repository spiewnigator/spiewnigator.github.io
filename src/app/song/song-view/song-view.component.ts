import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SongProviderService } from 'src/app/service/song-provider.service';
import { map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SettingsService } from 'src/app/service/settings.service';
import { AsyncPipe, Location } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-song-view',
    templateUrl: './song-view.component.html',
    styleUrls: ['./song-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatToolbar, MatIconButton, MatIcon, ReactiveFormsModule, FormsModule, MatCard, MatCardHeader, MatCardSubtitle, MatCardContent, RouterLink, AsyncPipe]
})
export class SongViewComponent {
  private readonly songProvider = inject(SongProviderService);
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly settings$ = inject(SettingsService).settings$;
  readonly location = inject(Location);

  public readonly song$ = this.activatedRoute.paramMap.pipe(
    map(p => p.get('id')),
    switchMap(id => id != null ? this.songProvider.getOne(+id) : throwError(() => new Error('id path param is null')))
  );
}
