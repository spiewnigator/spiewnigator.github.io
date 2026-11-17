import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { Observable, from } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AppUpdateService } from 'src/app/service/app-update.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatToolbar, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, DatePipe, AsyncPipe]
})
export class HelpComponent {
    private readonly appUpdateService = inject(AppUpdateService);

    public readonly isUpdateAvailableMessage$ = this.appUpdateService.isUpdateAvailable$();

    public readonly buildTimestamp$ = this.getBuildTimestamp();

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
