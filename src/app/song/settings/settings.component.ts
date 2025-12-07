import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../../app/service/settings.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatToolbar, MatSlideToggle, MatSlider, MatSliderThumb, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);
  private sub?: Subscription;

  public settings = {
    hideChords: false,
    fontSize: 14,
    enableFuzzySearch: false,
  };

  ngOnInit(): void {
    this.sub = this.settingsService.settings$.subscribe((s) => {
      this.settings = { ...s };
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public setHideChords(v: boolean): void {
    this.settingsService.hideChords = v;
  }

  public setFontSize(v: number | null | undefined): void {
    if (v == null) return;
    const size = Math.max(12, Math.min(20, Math.round(v)));
    this.settingsService.fontSize = size;
  }

  public setEnableFuzzySearch(v: boolean): void {
    this.settingsService.enableFuzzySearch = v;
  }
}
