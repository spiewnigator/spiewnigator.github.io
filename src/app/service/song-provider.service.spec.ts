import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SongProviderService } from './song-provider.service';
import { HttpClientTestingModule , HttpTestingController } from '@angular/common/http/testing'
import { SongRaw } from '../model/song';

describe('SongProviderService', () => {
  let service: SongProviderService;
  let httpMock: HttpTestingController;

  const rawData: SongRaw[] = [
    {title: 'Test1', content: [['a', 'b'], ['b\tC'], ['d']]},
    {title: 'Test2', content:[], author: 'author'}
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SongProviderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // songs are retrieved once on startup
    const req = httpMock.expectOne(service.filepath);
    expect(req.request.method).toBe("GET");
    req.flush(rawData);

    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all songs', fakeAsync(() => {
    const subs = service.getAll().subscribe(
      data => expect(data).toBeDefined()
    );

    tick();

    subs.unsubscribe()

  }))
});
