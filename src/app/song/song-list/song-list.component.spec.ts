import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongProviderService } from 'src/app/service/song-provider.service';

import { SongListComponent } from './song-list.component';

import { of } from 'rxjs';

describe('SongListComponent', () => {
  let component: SongListComponent;
  let fixture: ComponentFixture<SongListComponent>;

  const songProviderSpy = jasmine.createSpyObj<SongProviderService>('songProviderSpy', ['getAll']);
  songProviderSpy.getAll.and.returnValue(of([]))

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SongListComponent],
      providers: [
        {provide: SongProviderService, useValue: songProviderSpy}
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
