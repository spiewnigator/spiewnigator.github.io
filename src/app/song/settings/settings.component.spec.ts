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
    const toggle = (index: number): MatSlideToggle => fixture.debugElement.queryAll(By.directive(MatSlideToggle))[index].componentInstance as MatSlideToggle;

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
        expect(toggle(0).checked).toBe(false);
        expect(toggle(1).checked).toBe(false);
        expect(toggle(2).checked).toBe(false);

        settings.hideChords = true;
        settings.boldText = true;
        settings.enableFuzzySearch = true;
        fixture.detectChanges();

        expect(toggle(0).checked).toBe(true);
        expect(toggle(1).checked).toBe(true);
        expect(toggle(2).checked).toBe(true);
    });

    it('should write toggle changes through the settings service', () => {
        // toggle() does not emit the `change` output; a real click does.
        const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('mat-slide-toggle button.mdc-switch');
        buttons[0].click();
        buttons[1].click();
        fixture.detectChanges();
        expect(settings.hideChords).toBe(true);
        expect(settings.boldText).toBe(true);
    });
});
