import { TestBed } from '@angular/core/testing';

import { SongProviderService } from './song-provider.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SongRaw } from '../model/song';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('SongProviderService', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    let service: SongProviderService;
    let httpMock: HttpTestingController;

    const rawData: SongRaw[] = [
        { title: 'Test1', content: [['a', 'b'], ['b\tC'], ['d']] },
        { title: 'Test2', content: [], author: 'author' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
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

    it('should retrieve all songs', async () => {
        const subs = service.getAll().subscribe(data => expect(data).toBeDefined());

        await vi.advanceTimersByTimeAsync(0);

        subs.unsubscribe();

    });
});
