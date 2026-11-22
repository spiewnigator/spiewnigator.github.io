import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Song } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';

import { SongListComponent } from './song-list.component';

describe('SongListComponent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    let component: SongListComponent;
    let fixture: ComponentFixture<SongListComponent>;

    const allSongs: Song[] = [
        { id: 0, title: 'Alpha', content: [] },
        { id: 1, title: 'Beta', content: [] },
    ];
    const songProviderSpy = {
        getAll: vi.fn().mockName("songProviderSpy.getAll"),
        search: vi.fn().mockName("songProviderSpy.search")
    };
    let routerSpy: { navigate: ReturnType<typeof vi.fn> };
    let activatedRouteStub: {
        fragment: Observable<string>;
        snapshot: { queryParamMap: ParamMap };
    };
    let initialQuery: string;

    beforeEach(async () => {
        vi.clearAllMocks();
        songProviderSpy.getAll.mockReturnValue(of(allSongs));
        songProviderSpy.search.mockImplementation((query: string) => of(allSongs.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))));
        routerSpy = { navigate: vi.fn().mockResolvedValue(true) };
        initialQuery = '';
        activatedRouteStub = {
            fragment: of('test'),
            get snapshot() {
                return { queryParamMap: convertToParamMap(initialQuery ? { q: initialQuery } : {}) };
            }
        };

        await TestBed.configureTestingModule({
            imports: [SongListComponent],
            providers: [
                { provide: SongProviderService, useValue: songProviderSpy },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Router, useValue: routerSpy }
            ]
        })
            .compileComponents();
    });

    function createComponent(): void {
        fixture = TestBed.createComponent(SongListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should create', () => {
        createComponent();
        expect(component).toBeTruthy();
    });

    it('renders the catalog when the query is empty', async () => {
        createComponent();
        await vi.advanceTimersByTimeAsync(200);
        fixture.detectChanges();
        expect(songProviderSpy.search).toHaveBeenCalledWith('');
        expect(fixture.nativeElement.textContent).toContain('Alpha');
        expect(fixture.nativeElement.textContent).toContain('Beta');
    });

    it('initialises the search control and the list from ?q=', () => {
        initialQuery = 'beta';
        createComponent();

        expect(component.searchControl.value).toBe('beta');
        expect(songProviderSpy.search).toHaveBeenCalledWith('beta');
        expect(fixture.nativeElement.textContent).toContain('Beta');
        expect(fixture.nativeElement.textContent).not.toContain('Alpha');
        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('starts with an empty search box when ?q= is absent', () => {
        createComponent();
        expect(component.searchControl.value).toBe('');
    });

    it('updates the rendered list after a debounced search under OnPush', async () => {
        createComponent();
        await vi.advanceTimersByTimeAsync(200);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Alpha');
        expect(fixture.nativeElement.textContent).toContain('Beta');

        component.searchControl.setValue('beta');
        await vi.advanceTimersByTimeAsync(199);
        fixture.detectChanges();
        expect(songProviderSpy.search).not.toHaveBeenCalledWith('beta');

        await vi.advanceTimersByTimeAsync(1);
        fixture.detectChanges();
        expect(songProviderSpy.search).toHaveBeenCalledWith('beta');
        expect(fixture.nativeElement.textContent).toContain('Beta');
        expect(fixture.nativeElement.textContent).not.toContain('Alpha');
    });

    it('pushes the debounced query into the URL without adding history entries', async () => {
        createComponent();
        await vi.advanceTimersByTimeAsync(200);

        component.searchControl.setValue('beta');
        await vi.advanceTimersByTimeAsync(199);
        expect(routerSpy.navigate).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1);
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledWith([], {
            relativeTo: activatedRouteStub,
            queryParams: { q: 'beta' },
            queryParamsHandling: 'merge',
            replaceUrl: true,
            scroll: 'manual'
        });
    });

    it('removes the query parameter when the search is cleared', async () => {
        initialQuery = 'beta';
        createComponent();
        await vi.advanceTimersByTimeAsync(200);

        component.searchControl.setValue('');
        await vi.advanceTimersByTimeAsync(200);

        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledWith([], {
            relativeTo: activatedRouteStub,
            queryParams: { q: null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
            scroll: 'manual'
        });
    });

    it('cancels the pending debounce when the component is destroyed', async () => {
        createComponent();

        component.searchControl.setValue('beta');
        fixture.destroy();
        await vi.advanceTimersByTimeAsync(300);

        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
});
