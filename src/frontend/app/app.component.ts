import { Component, inject, signal } from '@angular/core';
import { UrlShortenerService } from './url-shortener.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <div class="app">
      <h1>URL Shortener</h1>

      <div class="input-area">
        <mat-form-field appearance="outline">
          <!-- TODO: text ist zu blass -->
          <input matInput input [(ngModel)]="url" placeholder="Enter URL" />
          <mat-label>URL</mat-label>
        </mat-form-field>
        <button mat-raised-button (click)="shorten()" color="primary">Shorten!</button>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected readonly url = signal<string | undefined>(undefined);
  protected readonly shortCode = signal<string | undefined>(undefined);
  protected readonly errorMessage = signal<string | undefined>(undefined);

  private readonly logger = inject(NGXLogger);
  private readonly urlShortenerService = inject(UrlShortenerService);

  protected async shorten() {
    const url = this.url();
    if (!url) {
      this.logger.warn('URL is empty');
      // TODO: display error
      return
    }
    try {
      await this.urlShortenerService.shortenUrl(url)
    } catch (error) {
      this.logger.error('Failed to shorten URL', error);
      // TODO: display error
    }
  }
}
