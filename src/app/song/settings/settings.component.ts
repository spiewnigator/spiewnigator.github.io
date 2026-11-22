import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SettingsService } from '../../../app/service/settings.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatToolbar, MatSlideToggle, MatSlider, MatSliderThumb, FormsModule, AsyncPipe],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private readonly settingsService = inject(SettingsService);

  public readonly settings$ = this.settingsService.settings$;

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

  public setBoldText(v: boolean): void {
    this.settingsService.boldText = v;
  }
}
