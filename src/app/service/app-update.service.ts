import { inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable, of, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {

  private readonly updates = inject(SwUpdate);

  public isUpdateAvailable$(): Observable<string> {
    const isEnabled = this.updates.isEnabled;
    if (!isEnabled) {
      return of('Check for update is not available in this browser.');
    }

    const isUpdateAvailable = from(this.updates.checkForUpdate()).pipe(
      map((hasUpdate) => {
        if (hasUpdate) {
          return 'A new version of the application is available. Please refresh the page.';
        } else {
          return 'You are using the latest version of the application.';
        }
      }),
      catchError((error) => {
        console.error('Error while checking for updates:', error);
        return of('An error occurred while checking for updates. Try again later.');
      })
    );

    return isUpdateAvailable;
  }
  
}
