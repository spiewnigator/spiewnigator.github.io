import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { Song } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';

import { SongViewComponent } from './song-view.component';

describe('SongViewComponent', () => {
  let component: SongViewComponent;
  let fixture: ComponentFixture<SongViewComponent>;

  const song: Song = { id: 1, title: 'Title', content: [] };
  const songProviderSpy = jasmine.createSpyObj<SongProviderService>('songProviderSpy', ['getOne']);
  const paramMap$ = new BehaviorSubject(convertToParamMap({ id: 0 }));

  beforeEach(async () => {
    songProviderSpy.getOne.calls.reset();
    songProviderSpy.getOne.and.returnValue(of(song));
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

  it('should create', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should render the song via async pipe under OnPush', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Title');
  }));

  it('should re-render when the route param changes', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Title');

    songProviderSpy.getOne.and.returnValue(of({ ...song, title: 'Other title' }));
    paramMap$.next(convertToParamMap({ id: 2 }));
    tick();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Other title');
    expect(fixture.nativeElement.textContent).not.toContain('Title');
  }));
});
