import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * very much dumb container for basic settings
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'spiewnigator.settings.v1';

  private defaults = {
    hideChords: false,
    fontSize: 14,
    enableFuzzySearch: false
  };

  private _settings = { ...this.defaults };

  /** Observable that emits current settings whenever they change */
  public settings$ = new BehaviorSubject(this._settings);

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        this._settings = { ...this.defaults };
        this.persist();
        this.settings$.next(this._settings);
        return;
      }
      const parsed = JSON.parse(raw);
      this._settings = { ...this.defaults, ...parsed };
    } catch (e) {
      console.warn('Failed to load settings, using defaults:', e);
      this._settings = { ...this.defaults };
    }
    this.settings$.next(this._settings);
  }

  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._settings));
    } catch (e) {
      // Log in production for monitoring quota/permission issues
      console.warn('Failed to persist settings:', e);
    }
  }

  public get hideChords(): boolean {
    return this._settings.hideChords;
  }
  public set hideChords(v: boolean) {
    if (this._settings.hideChords === v) return;
    this._settings.hideChords = v;
    this.persist();
    this.settings$.next(this._settings);
  }

  public get fontSize(): number {
    return this._settings.fontSize;
  }
  public set fontSize(v: number) {
    if (this._settings.fontSize === v) return;
    this._settings.fontSize = v;
    this.persist();
    this.settings$.next(this._settings);
  }

  public get enableFuzzySearch(): boolean {
    return this._settings.enableFuzzySearch;
  }
  public set enableFuzzySearch(v: boolean) {
    if (this._settings.enableFuzzySearch === v) return;
    this._settings.enableFuzzySearch = v;
    this.persist();
    this.settings$.next(this._settings);
  }
}
