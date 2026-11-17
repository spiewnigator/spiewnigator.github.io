import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, catchError, from, interval, map, Observable, of, startWith, switchMap } from 'rxjs';

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

type UpdateCheckState = 'checking' | 'available' | 'up-to-date' | 'failed';

@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {

  private readonly updates = inject(SwUpdate);
  private readonly state = new BehaviorSubject<UpdateCheckState>('checking');

  public readonly updateAvailable$ = this.state.pipe(
    // Keep failures and the initial check indistinguishable from "no result"
    // so the update banner is only shown when an update is actually known.
    map(state => (state === 'checking' || state === 'failed') ? null : state === 'available')
  );

  constructor() {
    if (!this.updates.isEnabled) {
      return;
    }

    // The SW can announce a new version on its own (e.g. after a navigation
    // triggers a check), independently of our periodic polling.
    this.updates.versionUpdates.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event.type === 'VERSION_READY') {
        this.state.next('available');
      }
    });

    interval(CHECK_INTERVAL_MS).pipe(
      startWith(0),
      switchMap(() => from(this.updates.checkForUpdate()).pipe(
        map(hasUpdate => ({ hasUpdate, failed: false })),
        catchError(error => {
          console.error('Error while checking for updates:', error);
          return of({ hasUpdate: false, failed: true });
        })
      )),
      takeUntilDestroyed()
    ).subscribe(({ hasUpdate, failed }) => {
      if (failed) {
        this.state.next('failed');
      } else if (hasUpdate) {
        this.state.next('available');
      } else if (this.state.value === 'checking' || this.state.value === 'failed') {
        this.state.next('up-to-date');
      }
    });
  }

  public isUpdateAvailable$(): Observable<string> {
    if (!this.updates.isEnabled) {
      return of('Check for update is not available in this browser.');
    }

    return this.state.pipe(
      map(state => {
        if (state === 'failed') {
          return 'An error occurred while checking for updates. Try again later.';
        }
        if (state === 'checking') {
          return 'Checking for updates…';
        }
        if (state === 'available') {
          return 'A new version of the application is available. Use the update button at the top of the page.';
        }
        return 'You are using the latest version of the application.';
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
