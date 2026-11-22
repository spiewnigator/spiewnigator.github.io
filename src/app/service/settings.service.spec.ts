import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    localStorage.removeItem('spiewnigator.settings.v1');
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('defaults bold text to off and persists changes', () => {
    expect(service.boldText).toBe(false);

    service.boldText = true;

    expect(service.boldText).toBe(true);
    expect(JSON.parse(localStorage.getItem('spiewnigator.settings.v1') ?? '{}')).toMatchObject({
      boldText: true,
    });
  });
});
