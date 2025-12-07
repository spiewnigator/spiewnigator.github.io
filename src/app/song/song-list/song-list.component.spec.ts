import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongProviderService } from 'src/app/service/song-provider.service';

import { SongListComponent } from './song-list.component';

import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('SongListComponent', () => {
  let component: SongListComponent;
  let fixture: ComponentFixture<SongListComponent>;

  const songProviderSpy = jasmine.createSpyObj<SongProviderService>('songProviderSpy', ['getAll', 'search']);
  songProviderSpy.getAll.and.returnValue(of([]))
  songProviderSpy.search.and.returnValue(of([]))

  beforeEach(async () => {
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
});
