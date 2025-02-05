import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { UrlShortenerService } from '../../url-shortener.service';

@Component({
  selector: 'app-redirect',
  standalone: true,
  template: `
  <!-- TODO: make nice to watch -->
    @if(errorMessage()) {
    <p>{{ errorMessage() }}</p>
    <a routerLink="/">Go Home</a>
    } @else {
    <p>Redirecting...</p>
    }
  `,
})
export class RedirectComponent implements OnInit {
  protected readonly errorMessage = signal<string | undefined>(undefined);
  private readonly route = inject(ActivatedRoute);
  private readonly urlShortenerService = inject(UrlShortenerService);
  private readonly logger = inject(NGXLogger);

  // TODO: no re-routing is done here right now
  async ngOnInit(): Promise<void> {
    this.logger.info('Redirecting to long URL...');
    this.route.params.subscribe((params) => {
      this.logger.debug('Route params:', params);
      const shortCode = params['shortcode'];
      if (!shortCode) {
        this.errorMessage.set('Invalid short URL');
        return;
      }
      this.handleShortCode(shortCode);
    });
  }

  private async handleShortCode(shortCode: string): Promise<void> {
    try {
      const result = await this.urlShortenerService.getLongUrl(shortCode);
      this.logger.debug('Long URL retrieved:', result.long_url);
      window.location.href = result.long_url;
    } catch (error) {
      this.logger.error('Failed to fetch long URL:', error);
      this.errorMessage.set('Short URL not found.');
    }
  }
}
