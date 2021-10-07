import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SongProviderService } from 'src/app/service/song-provider.service';
import { convertToParamMap } from '@angular/router';

import { SongViewComponent } from './song-view.component';

describe('SongViewComponent', () => {
  let component: SongViewComponent;
  let fixture: ComponentFixture<SongViewComponent>;

  const songProviderSpy = jasmine.createSpyObj<SongProviderService>('songProviderSpy', ['getOne']);
  songProviderSpy.getOne.and.returnValue(of({id: 1, title: 'Title', content: []}))

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongViewComponent ],
      imports: [
        MatMenuModule
      ],
      providers: [
        {provide: SongProviderService, useValue: songProviderSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({id: 0})),
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

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
    tick();
    expect(component.song).toBeDefined();
  }));
});
