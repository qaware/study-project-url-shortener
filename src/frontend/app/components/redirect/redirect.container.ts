import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { UrlShortenerService } from '../../url-shortener.service';
import { RedirectComponent } from './redirect.component';

@Component({
  selector: 'app-redirect-container',
  standalone: true,
  imports: [RedirectComponent],
  template: `
    <app-redirect
      [errorMessage]="errorMessage()"
      [isRedirecting]="isRedirecting()"
      (goHomeRequested)="onGoHomeRequested()"
    />
  `
})
export class RedirectContainer implements OnInit {
  protected readonly errorMessage = signal<string | undefined>(undefined);
  protected readonly isRedirecting = signal(true);
  
  private readonly route = inject(ActivatedRoute);
  private readonly urlShortenerService = inject(UrlShortenerService);
  private readonly logger = inject(NGXLogger);

  async ngOnInit(): Promise<void> {
    // Get short path from URL
    const shortCode = this.route.snapshot.url[0].path;
    this.logger.debug('Route shortCode:', shortCode);
    await this.handleShortCode(shortCode);
  }

  protected onGoHomeRequested() {
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
      this.extractAndSetErrorMessage(error);
      this.isRedirecting.set(false);
    }
  }

  private addHttps(url: string): string {
    return /^https?:\/\//.test(url) ? url : `https://${url}`;
  }

    private extractAndSetErrorMessage(error: unknown) {
    if (error && typeof error === 'object' && 'error' in error) {
      const httpError = error as { error?: { detail?: string } };
      const detail = httpError.error?.detail || 'An unexpected error occurred';
      this.errorMessage.set(detail);
    } else {
      this.errorMessage.set('An unexpected error occurred');
    }
  }
}
