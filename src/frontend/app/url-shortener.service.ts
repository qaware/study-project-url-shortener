import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { firstValueFrom } from 'rxjs';

interface ShortenResponse {
  short_code: string;
  long_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class UrlShortenerService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(NGXLogger);
  private readonly backendBasePath = '/api';

  /**
   * Sends a POST request to shorten the provided URL.
   *
   * @param url - The original long URL to shorten.
   * @returns A promise that resolves to the shortened URL response.
   */
  public async shortenUrl(url: string): Promise<ShortenResponse> {
    const apiUrl = `${this.backendBasePath}/shorten`;

    // Log the outgoing request with payload details.
    this.logger.info(`Sending POST request to ${apiUrl} with payload:`, { url });

    try {
      // Await the response from the HTTP POST request.
      const response = await firstValueFrom(
        this.http.post<ShortenResponse>(apiUrl, { url })
      );

      // Log successful request completion.
      this.logger.info('Request succeeded');
      return response;
    } catch (error: unknown) {
      // If the error is a known HTTP error, log it specifically.
      if (error instanceof HttpErrorResponse) {
        this.logger.error('Request failed with HTTP error', error);
      } else {
        // Log any unexpected errors.
        this.logger.error('An unexpected error occurred', error);
      }
      // Re-throw the error to let the caller handle it.
      throw error;
    }
  }
}