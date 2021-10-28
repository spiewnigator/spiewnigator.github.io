import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { SongViewComponent } from './song-view/song-view.component';

const options: ExtraOptions = {
  // anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
  // scrollOffset: [0, -128]
}

const routes: Routes = [
  {path: '', component: SongListComponent},
  {path: 'song/:id', component: SongViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongRoutingModule { }
