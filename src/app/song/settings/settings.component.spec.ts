import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { SettingsService } from 'src/app/service/settings.service';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settings: SettingsService;

  // aria-label is an Angular input on MatSlideToggle, not a DOM attribute, so query by directive.
  const toggle = (index: number): MatSlideToggle =>
    fixture.debugElement.queryAll(By.directive(MatSlideToggle))[index].componentInstance as MatSlideToggle;

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
    expect(toggle(0).checked).toBeFalse();
    expect(toggle(1).checked).toBeFalse();

    settings.hideChords = true;
    settings.enableFuzzySearch = true;
    fixture.detectChanges();

    expect(toggle(0).checked).toBeTrue();
    expect(toggle(1).checked).toBeTrue();
  });

  it('should write toggle changes through the settings service', () => {
    // toggle() does not emit the `change` output; a real click does.
    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('mat-slide-toggle button.mdc-switch');
    buttons[0].click();
    fixture.detectChanges();
    expect(settings.hideChords).toBeTrue();
  });
});
