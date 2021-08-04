import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongRoutingModule } from './song-routing.module';
import { SongListComponent } from './song-list/song-list.component';
import { SongViewComponent } from './song-view/song-view.component';


@NgModule({
  declarations: [
    SongListComponent,
    SongViewComponent
  ],
  imports: [
    CommonModule,
    SongRoutingModule
  ]
})
export class SongModule { }
