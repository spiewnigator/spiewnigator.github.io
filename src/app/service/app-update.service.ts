import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, interval, map, Observable, of, startWith, switchMap } from 'rxjs';

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {

  private readonly updates = inject(SwUpdate);
  private readonly updateAvailable = new BehaviorSubject<boolean | null>(null);

  public readonly updateAvailable$ = this.updateAvailable.asObservable();

  constructor() {
    if (!this.updates.isEnabled) {
      return;
    }

    // The SW can announce a new version on its own (e.g. after a navigation
    // triggers a check), independently of our periodic polling.
    this.updates.versionUpdates.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event.type === 'VERSION_READY') {
        this.updateAvailable.next(true);
      }
    });

    interval(CHECK_INTERVAL_MS).pipe(
      startWith(0),
      switchMap(() => this.updates.checkForUpdate().catch(() => false)),
      takeUntilDestroyed()
    ).subscribe(hasUpdate => {
      if (hasUpdate) {
        this.updateAvailable.next(true);
      } else if (this.updateAvailable.value === null) {
        this.updateAvailable.next(false);
      }
    });
  }

  public isUpdateAvailable$(): Observable<string> {
    if (!this.updates.isEnabled) {
      return of('Check for update is not available in this browser.');
    }

    return this.updateAvailable$.pipe(
      map(available => {
        if (available === null) {
          return 'Checking for updates…';
        }
        return available
          ? 'A new version of the application is available. Use the update button at the top of the page.'
          : 'You are using the latest version of the application.';
      })
    );
  }

  public async applyUpdate(): Promise<void> {
    if (!this.updates.isEnabled) {
      return;
    }

    try {
      // Without this the new SW version stays in waiting state until all tabs
      // using the app are closed, so a plain page refresh may not apply it.
      await this.updates.activateUpdate();
      this.reload();
    } catch (error) {
      console.error('Error while applying update:', error);
    }
  }

  private reload(): void {
    document.location.reload();
  }
}
