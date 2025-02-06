import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { UrlShortenerService } from '../../url-shortener.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatButtonModule],
  template: `
    @if(errorMessage()) {
      <p class="error">{{ errorMessage() }}</p>
      <button mat-raised-button (click)="goHome()" color="primary">
        Go Home
      </button>
    } @else {
      <h3>
        Redirecting... <mat-progress-spinner mode="indeterminate" diameter="20" />
      </h3>
    }
  `,
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent implements OnInit {
  protected readonly errorMessage = signal<string | undefined>(undefined);
  private readonly route = inject(ActivatedRoute);
  private readonly urlShortenerService = inject(UrlShortenerService);
  private readonly logger = inject(NGXLogger);

  async ngOnInit(): Promise<void> {
    // Get short path from URL
    const shortCode = this.route.snapshot.url[0].path;
    this.logger.debug('Route shortCode:', shortCode);
    this.handleShortCode(shortCode);
  }

  protected goHome() {
    window.location.href = '/';
  }

  private async handleShortCode(shortCode: string): Promise<void> {
    let longUrl = ""
    try {
      longUrl = await this.urlShortenerService.getLongUrl(shortCode);

      if (!longUrl) {
        throw new Error("No long URL for short code found");
      }

      this.logger.info('Long URL retrieved:', longUrl);

      longUrl = this.addHttps(longUrl);
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      // Perform the final redirect
      window.location.href = longUrl;

    } catch (error) {
      this.logger.error('Failed to fetch long URL:', error);
      this.errorMessage.set(`Short URL not found or invalid long URL: ${longUrl}`);
    }
  }

  private addHttps(url: string): string {
    return /^https?:\/\//.test(url) ? url : `https://${url}`;
  }

}
