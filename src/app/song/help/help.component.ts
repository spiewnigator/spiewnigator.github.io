import { Component, inject, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { Observable, from } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AppUpdateService } from 'src/app/service/app-update.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    imports: [MatToolbar, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, DatePipe, AsyncPipe]
})
export class HelpComponent implements OnInit {

    private readonly appUpdateService = inject(AppUpdateService);

    public buildTimestamp?: Date;

    public isUpdateAvailableMessage$ = this.appUpdateService.isUpdateAvailable$();

    ngOnInit(): void {
        this.getBuildTimestamp().subscribe(ts => {
            this.buildTimestamp = ts;
        });
    }

    private getBuildTimestamp(): Observable<Date | undefined> {
        const promise = fetch('/assets/build-info.json')
            .then(res => res.json())
            .then(data => new Date(data.timestamp))
            .catch((e) => {
                console.warn('Could not load build info', e);
                return undefined;
            });
        return from(promise);
    }
}
