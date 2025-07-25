import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    imports: [MatToolbar, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle]
})
export class HelpComponent {}
