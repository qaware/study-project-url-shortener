import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NGXLogger } from 'ngx-logger';
import { ShortenStatus } from '../../model/status.model';
import { StatusComponent } from '../status/status.component';
import { UrlShortenerService } from '../../url-shortener.service';
import { QrCodeComponent } from '../qr-code/qr-code.component';

@Component({
  selector: 'app-url-shortener',
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
    QrCodeComponent
  ],
  template: `
    <mat-form-field appearance="outline">
      <input matInput input [(ngModel)]="url" placeholder="Enter URL" />
      <mat-label>URL</mat-label>
    </mat-form-field>

    <app-qr-code [url]="this.url()"/>

    <!-- Display shortend path -->
    @if (shortPath()) {
    <p class="short-path-result">
      Short Path:
      <a href="{{ getFullShortPath() }}">{{ getFullShortPath() }}</a>
    </p>
    } @else if (status()){
      <app-status [status]="status()" [errorMessage]="errorMessage()" />
    }

    <button mat-raised-button (click)="shorten()" color="primary">
      @if(shorteningUrlInProgress()) {
      <mat-progress-spinner mode="indeterminate" diameter="20" />
      } @else { Shorten! }
    </button>
  `,
  styleUrls: ['./url-shortener.component.scss'],
})
export class UrlShortenerComponent {
  protected readonly url = signal<string | undefined>(undefined);
  protected readonly shortPath = signal<string | undefined>(undefined);
  protected readonly errorMessage = signal<string | undefined>(undefined);
  protected readonly shorteningUrlInProgress = signal(false);
  protected readonly status = signal<ShortenStatus | undefined>(undefined);

  private readonly logger = inject(NGXLogger);
  private readonly urlShortenerService = inject(UrlShortenerService);

  protected async shorten() {
    this.shortPath.set(undefined);

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
    await this.shortenUrl(url);
  }

  protected getFullShortPath(): string | undefined {
    return window.location.href + this.shortPath();
  }

  private async shortenUrl(url: string) {
    this.shorteningUrlInProgress.set(true);
    try {
      const shortPath = await this.urlShortenerService.shortenUrl(url);

      // Make sure that the short path is not empty
      if (!shortPath) {
        throw {
          error: {
            detail: 'The returned short path is empty',
          },
        };
      }

      this.shortPath.set(shortPath);
      this.url.set(undefined);
      this.status.set(ShortenStatus.REQUEST_SUCCESS);

      return shortPath;
    } catch (error) {
      this.logger.error('Failed to shorten URL', error);
      this.status.set(ShortenStatus.REQUST_FAILURE);
      this.extractAndSetErrorMessage(error);
      return undefined;
    } finally {
      this.shorteningUrlInProgress.set(false);
    }

  }

  private extractAndSetErrorMessage(error: any) {
    const detail = error?.error?.detail || 'An unexpected error occurred';
    this.errorMessage.set(detail);
  }
}
