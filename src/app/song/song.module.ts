import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SongRoutingModule } from './song-routing.module';
import { SongListComponent } from './song-list/song-list.component';
import { SongViewComponent } from './song-view/song-view.component';
import { HelpComponent } from './help/help.component'; 
import { SettingsComponent } from './settings/settings.component';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion'; 


@NgModule({
    imports: [
        ReactiveFormsModule,
        RouterModule,
        CommonModule,
        FormsModule,
        SongRoutingModule,
        MatCardModule,
        MatToolbarModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatExpansionModule,
        SongListComponent,
        SongViewComponent,
        HelpComponent,
        SettingsComponent,
    ]
})
export class SongModule { }
