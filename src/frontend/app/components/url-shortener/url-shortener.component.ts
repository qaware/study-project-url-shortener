import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ShortenStatus } from '../../model/status.model';
import { QrCodeContainer } from '../qr-code/qr-code.container';
import { StatusComponent } from '../status/status.component';

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
    MatCardModule,
    RouterLink,
    StatusComponent,
    QrCodeContainer
  ],
  template: `
    <div class="url-shortener-container">
      <mat-card class="main-card">
        <mat-card-header>
          <mat-card-title>Shorten Your URL</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <mat-form-field appearance="outline" class="url-input">
            <input matInput 
                   [value]="url() || ''" 
                   (input)="onUrlInput($event)" 
                   (paste)="onUrlInput($event)"
                   (change)="onUrlInput($event)"
                   (keydown.enter)="onShortenRequested()" 
                   placeholder="Enter URL" />
            <mat-label>URL</mat-label>
          </mat-form-field>

          <app-qr-code-container [url]="url()"/>

          <!-- Display shortened path -->
          @if (shortPath()) {
            <div class="result-section">
              <p class="short-path-result">
                Short Path:
                <a [href]="getFullShortPath()" target="_blank" class="short-url-link">{{ getFullShortPath() }}</a>
              </p>
            </div>
          } @else if (status()){
            <app-status [status]="status()" [errorMessage]="errorMessage()" />
          }

          <button mat-raised-button (click)="onShortenRequested()" color="primary" class="shorten-btn">
            @if(shorteningUrlInProgress()) {
              <mat-progress-spinner mode="indeterminate" diameter="20" />
            } @else { 
              <ng-container>
                <mat-icon>link</mat-icon>
                Shorten!
              </ng-container>
            }
          </button>
        </mat-card-content>
      </mat-card>

      <!-- Stats preview - only shows if feature is available -->
      @if (isStatsAvailable() && totalUrls() > 0) {
        <mat-card class="stats-preview">
          <mat-card-header>
            <mat-card-title>Quick Stats</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-stats">
              <div class="stat">
                <strong>{{ totalUrls() }}</strong> URLs created
              </div>
              <div class="stat">
                <strong>{{ totalClicks() }}</strong> total clicks
              </div>
            </div>
            <a routerLink="/stats" mat-button color="primary">
              <mat-icon>bar_chart</mat-icon>
              View Full Statistics
            </a>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styleUrls: ['./url-shortener.component.scss'],
})
export class UrlShortenerComponent {
  readonly url = input<string | undefined>();
  readonly shortPath = input<string | undefined>();
  readonly errorMessage = input<string | undefined>();
  readonly shorteningUrlInProgress = input<boolean>(false);
  readonly status = input<ShortenStatus | undefined>();
  readonly isStatsAvailable = input<boolean>(false);
  readonly totalUrls = input<number>(0);
  readonly totalClicks = input<number>(0);

  readonly urlChanged = output<string | undefined>();
  readonly shortenRequested = output<void>();

  protected onUrlInput(event: Event) {
    const target = event.target as HTMLInputElement;
    
    // For paste events, we need to wait for the value to be updated
    if (event.type === 'paste') {
      setTimeout(() => {
        const value = target.value.trim() || undefined;
        this.urlChanged.emit(value);
      }, 0);
    } else {
      const value = target.value.trim() || undefined;
      this.urlChanged.emit(value);
    }
  }

  protected onShortenRequested() {
    this.shortenRequested.emit();
  }

  protected getFullShortPath(): string | undefined {
    if (!this.shortPath()) return undefined;
    return window.location.href + this.shortPath();
  }
}
