import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SongProviderService } from 'src/app/service/song-provider.service';

import { SongViewComponent } from './song-view.component';

describe('SongViewComponent', () => {
  let component: SongViewComponent;
  let fixture: ComponentFixture<SongViewComponent>;

  const songProviderSpy = jasmine.createSpyObj<SongProviderService>('songProviderSpy', ['getOne']);
  songProviderSpy.getOne.and.returnValue(of({title: 'Title', content: []}))

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongViewComponent ],
      providers: [
        {provide: SongProviderService, useValue: songProviderSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', 0]])),
          },
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
