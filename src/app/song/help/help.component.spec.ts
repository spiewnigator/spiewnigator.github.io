import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppUpdateService } from 'src/app/service/app-update.service';

import { HelpComponent } from './help.component';

describe('HelpComponent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HelpComponent],
            providers: [
                { provide: AppUpdateService, useValue: { isUpdateAvailable$: () => of('Test update message') } }
            ]
        })
            .compileComponents();
    });

    const mockBuildInfo = (): void => {
        // Stub fetch so the component's async build-info load resolves under fake timers.
        vi.spyOn(window, 'fetch').mockResolvedValue({
            json: () => Promise.resolve({ timestamp: '2026-01-02T03:04:05.000Z' }),
        } as Response);
    };

    it('should create', () => {
        mockBuildInfo();
        const fixture: ComponentFixture<HelpComponent> = TestBed.createComponent(HelpComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render the build timestamp after the async fetch resolves under OnPush', async () => {
        mockBuildInfo();
        const fixture = TestBed.createComponent(HelpComponent);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).not.toContain('Build:');

        await vi.advanceTimersByTimeAsync(0);
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Build:');
        expect(fixture.nativeElement.textContent).toContain('Test update message');
    });
});
