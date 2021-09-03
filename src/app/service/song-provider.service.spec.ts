import { TestBed } from '@angular/core/testing';

import { SongProviderService } from './song-provider.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('SongProviderService', () => {
  let service: SongProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SongProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
