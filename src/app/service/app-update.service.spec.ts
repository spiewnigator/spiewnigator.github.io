import { TestBed } from '@angular/core/testing';

import { AppUpdateService } from './app-update.service';
import { SwUpdate } from '@angular/service-worker';
import { Subject } from 'rxjs';

describe('AppUpdateService', () => {
  let service: AppUpdateService;
  let versionUpdates: Subject<{ type: string }>;
  let checkForUpdate: ReturnType<typeof vi.fn>;
  let activateUpdate: ReturnType<typeof vi.fn>;

  const configure = (enabled: boolean, hasUpdate = false): void => {
    versionUpdates = new Subject<{ type: string }>();
    checkForUpdate = vi.fn().mockResolvedValue(hasUpdate);
    activateUpdate = vi.fn().mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SwUpdate,
          useValue: {
            isEnabled: enabled,
            versionUpdates,
            checkForUpdate,
            activateUpdate
          }
        }
      ]
    });
    service = TestBed.inject(AppUpdateService);
  };

  it('should be created', () => {
    configure(false);
    expect(service).toBeTruthy();
  });

  it('reports that checking is unavailable when the SW is disabled', async () => {
    configure(false);
    const message = await new Promise<string>(resolve =>
      service.isUpdateAvailable$().subscribe(resolve)
    );
    expect(message).toContain('not available');
    expect(checkForUpdate).not.toHaveBeenCalled();
  });

  it('checks for updates on startup and exposes the result', async () => {
    configure(true, true);
    expect(checkForUpdate).toHaveBeenCalledTimes(1);

    const available = await new Promise<boolean | null>(resolve =>
      service.updateAvailable$.subscribe(value => {
        if (value !== null) resolve(value);
      })
    );
    expect(available).toBe(true);
  });

  it('reacts to a VERSION_READY event from the service worker', async () => {
    configure(true);
    const availablePromise = new Promise<boolean | null>(resolve =>
      service.updateAvailable$.subscribe(value => {
        if (value) resolve(value);
      })
    );

    versionUpdates.next({ type: 'VERSION_READY' });

    await expect(availablePromise).resolves.toBe(true);
  });

  it('activates the update and reloads the page', async () => {
    configure(true);
    const reload = vi.spyOn(service as unknown as { reload: () => void }, 'reload')
      .mockImplementation(() => undefined);

    await service.applyUpdate();

    expect(activateUpdate).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(1);
    reload.mockRestore();
  });
});
