import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AppUpdateService } from './service/app-update.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, AsyncPipe]
})
export class AppComponent {
  public readonly title = 'Śpiewnigator';

  private readonly appUpdate = inject(AppUpdateService);
  public readonly updateAvailable$ = this.appUpdate.updateAvailable$;

  public applyUpdate(): void {
    void this.appUpdate.applyUpdate();
  }
}
