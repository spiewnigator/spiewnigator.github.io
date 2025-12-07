import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongViewComponent } from './song-view/song-view.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {path: '', component: SongListComponent},
  {path: 'song/:id', component: SongViewComponent},
  {path: 'help', component: HelpComponent},
  {path: 'settings', component: SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongRoutingModule { }
