import { TestBed } from '@angular/core/testing';

import { AppUpdateService } from './app-update.service';
import { SwUpdate } from '@angular/service-worker';

describe('AppUpdateService', () => {
  let service: AppUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SwUpdate, useValue: {isEnabled: false} }
      ]
    });
    service = TestBed.inject(AppUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
