import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongRoutingModule } from './song-routing.module';
import { SongListComponent } from './song-list/song-list.component';
import { SongViewComponent } from './song-view/song-view.component';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SongListComponent,
    SongViewComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    SongRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
  ]
})
export class SongModule { }
