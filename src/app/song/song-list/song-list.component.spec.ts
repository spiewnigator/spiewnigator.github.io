import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Song } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';

import { SongListComponent } from './song-list.component';

describe('SongListComponent', () => {
  let component: SongListComponent;
  let fixture: ComponentFixture<SongListComponent>;

  const allSongs: Song[] = [
    { id: 0, title: 'Alpha', content: [] },
    { id: 1, title: 'Beta', content: [] },
  ];
  const songProviderSpy = jasmine.createSpyObj<SongProviderService>('songProviderSpy', ['getAll', 'search']);

  beforeEach(async () => {
    songProviderSpy.getAll.calls.reset();
    songProviderSpy.search.calls.reset();
    songProviderSpy.getAll.and.returnValue(of(allSongs));
    songProviderSpy.search.and.callFake((query: string) =>
      of(allSongs.filter(s => s.title.toLowerCase().includes(query.toLowerCase())))
    );

    await TestBed.configureTestingModule({
      imports: [SongListComponent],
      providers: [
        { provide: SongProviderService, useValue: songProviderSpy },
        { provide: ActivatedRoute, useValue: { fragment: of('test') } }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the rendered list after a debounced search under OnPush', fakeAsync(() => {
    tick(200);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Alpha');
    expect(fixture.nativeElement.textContent).toContain('Beta');

    component.searchControl.setValue('beta');
    tick(199);
    fixture.detectChanges();
    expect(songProviderSpy.search).not.toHaveBeenCalledWith('beta');

    tick(1);
    fixture.detectChanges();
    expect(songProviderSpy.search).toHaveBeenCalledWith('beta');
    expect(fixture.nativeElement.textContent).toContain('Beta');
    expect(fixture.nativeElement.textContent).not.toContain('Alpha');
  }));
});
