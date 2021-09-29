import { Injectable } from '@angular/core';

/**
 * very much dumb container for basic settings
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public hideChords = false;

  public fontSize = 14;
}
