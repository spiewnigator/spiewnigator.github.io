import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { Song } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';

import { SongViewComponent } from './song-view.component';

describe('SongViewComponent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    let component: SongViewComponent;
    let fixture: ComponentFixture<SongViewComponent>;

    const song: Song = { id: 1, title: 'Title', content: [] };
    const songProviderSpy = {
        getOne: vi.fn().mockName("songProviderSpy.getOne")
    };
    const paramMap$ = new BehaviorSubject(convertToParamMap({ id: 0 }));

    beforeEach(async () => {
        songProviderSpy.getOne.mockClear();
        songProviderSpy.getOne.mockReturnValue(of(song));
        paramMap$.next(convertToParamMap({ id: 0 }));

        await TestBed.configureTestingModule({
            imports: [
                MatMenuModule,
                SongViewComponent
            ],
            providers: [
                { provide: SongProviderService, useValue: songProviderSpy },
                { provide: ActivatedRoute, useValue: { paramMap: paramMap$ } },
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SongViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', async () => {
        await vi.advanceTimersByTimeAsync(0);
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render the song via async pipe under OnPush', async () => {
        await vi.advanceTimersByTimeAsync(0);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Title');
    });

    it('should re-render when the route param changes', async () => {
        await vi.advanceTimersByTimeAsync(0);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Title');

        songProviderSpy.getOne.mockReturnValue(of({ ...song, title: 'Other title' }));
        paramMap$.next(convertToParamMap({ id: 2 }));
        await vi.advanceTimersByTimeAsync(0);
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Other title');
        expect(fixture.nativeElement.textContent).not.toContain('Title');
    });
});
