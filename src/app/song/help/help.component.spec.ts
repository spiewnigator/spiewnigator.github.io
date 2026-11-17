import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppUpdateService } from 'src/app/service/app-update.service';

import { HelpComponent } from './help.component';

describe('HelpComponent', () => {
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
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ timestamp: '2026-01-02T03:04:05.000Z' })))
    );
  };

  it('should create', () => {
    mockBuildInfo();
    const fixture: ComponentFixture<HelpComponent> = TestBed.createComponent(HelpComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the build timestamp after the async fetch resolves under OnPush', fakeAsync(() => {
    mockBuildInfo();
    const fixture = TestBed.createComponent(HelpComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Build:');

    tick();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Build:');
    expect(fixture.nativeElement.textContent).toContain('Test update message');
  }));
});
