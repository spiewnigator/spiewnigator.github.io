import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { SettingsService } from 'src/app/service/settings.service';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settings: SettingsService;

  const toggle = (label: string): MatSlideToggle =>
    fixture.debugElement.query(By.css(`mat-slide-toggle[aria-label="${label}"]`)).componentInstance as MatSlideToggle;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SettingsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    settings = TestBed.inject(SettingsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect external settings changes via async pipe under OnPush', () => {
    expect(toggle('Ukryj akordy').checked).toBeFalse();
    expect(toggle('Wyszukiwanie przybliżone').checked).toBeFalse();

    settings.hideChords = true;
    settings.enableFuzzySearch = true;
    fixture.detectChanges();

    expect(toggle('Ukryj akordy').checked).toBeTrue();
    expect(toggle('Wyszukiwanie przybliżone').checked).toBeTrue();
  });

  it('should write toggle changes through the settings service', () => {
    toggle('Ukryj akordy').toggle();
    fixture.detectChanges();
    expect(settings.hideChords).toBeTrue();
  });
});
