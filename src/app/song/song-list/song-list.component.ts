import { Component, DestroyRef, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Song } from 'src/app/model/song';
import { SongProviderService } from 'src/app/service/song-provider.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatPrefix, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatNavList, MatListItem } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-song-list',
    templateUrl: './song-list.component.html',
    styleUrls: ['./song-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatToolbar, MatIconButton, RouterLink, MatIcon, MatCard, MatFormField, MatPrefix, MatLabel, MatInput, ReactiveFormsModule, MatSuffix, MatNavList, MatListItem, AsyncPipe]
})
export class SongListComponent implements OnInit {
  private readonly songProvider = inject(SongProviderService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public readonly searchControl = new UntypedFormControl('');

  private readonly _searchSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private readonly _songs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  public readonly songs$: Observable<Song[]> = this._searchSubject$.asObservable().pipe(
    switchMap(query => this.songProvider.search(query))
  );

  constructor() { }

  ngOnInit(): void {
    const query = this.activatedRoute.snapshot.queryParamMap.get('q') ?? '';
    if (query) {
      this.searchControl.setValue(query, { emitEvent: false });
    }
    this._searchSubject$.next(query);

    this.songProvider.getAll().subscribe(
      data => this._songs$.next(data),
      error => this._songs$.error(error)
    );

    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      value => {
        const searchQuery = value ?? '';
        this._searchSubject$.next(searchQuery);
        void this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { q: searchQuery || null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
          scroll: 'manual'
        });
      },
      error => this._searchSubject$.error(error)
    )
  }
}
