import { TestBed } from '@angular/core/testing';

import { SongProviderService } from './song-provider.service';

describe('SongProviderService', () => {
  let service: SongProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
