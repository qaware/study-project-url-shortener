import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NGXLogger } from 'ngx-logger';
import { ShortenStatus } from './model/request-status.model';
import { UrlShortenerService } from './url-shortener.service';
import { StatusComponent } from './components/request-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatProgressSpinnerModule,
    StatusComponent,
  ],
  template: `
    <h1>URL Shortener</h1>

    <mat-form-field appearance="outline">
      <input matInput input [(ngModel)]="url" placeholder="Enter URL" />
      <mat-label>URL</mat-label>
    </mat-form-field>
    <button mat-raised-button (click)="shorten()" color="primary">
      @if(shorteningUrlInProgress()) {
      <mat-progress-spinner mode="indeterminate" diameter="20" />
      } @else { Shorten! }
    </button>

    <app-status [status]="status()" />
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected readonly url = signal<string | undefined>(undefined);
  protected readonly shortCode = signal<string | undefined>(undefined);
  protected readonly errorMessage = signal<string | undefined>(undefined);
  protected readonly shorteningUrlInProgress = signal(false);
  protected readonly status = signal<ShortenStatus | undefined>(undefined);

  private readonly resetstatus = effect(() => {
    if (this.status()) {
      setTimeout(() => {
        this.status.set(undefined);
      }, 3000);
    }
  });

  private readonly logger = inject(NGXLogger);
  private readonly urlShortenerService = inject(UrlShortenerService);

  protected async shorten() {
    if (this.shorteningUrlInProgress()) {
      this.logger.info(
        'Shortening URL is already in progress. Not starting another request.'
      );
      return;
    }

    const url = this.url();
    if (!url) {
      this.logger.warn('URL is empty');
      this.status.set(ShortenStatus.MISSING_URL);
      return;
    }

    this.shorteningUrlInProgress.set(true);
    try {
      await this.urlShortenerService.shortenUrl(url);
      setTimeout(() => {
        this.shortCode.set('Shortened URL code');
      }, 1000);
      this.url.set(undefined);
      this.status.set(ShortenStatus.REQUEST_SUCCESS);
    } catch (error) {
      this.logger.error('Failed to shorten URL', error);
      this.status.set(ShortenStatus.REQUST_FAILURE);
    } finally {
      this.shorteningUrlInProgress.set(false);
    }
  }
}
