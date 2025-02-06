import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { firstValueFrom } from 'rxjs';


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
  public async shortenUrl(url: string): Promise<string> {
    const apiUrl = `${this.backendBasePath}/shorten`;

    // Log the outgoing request with payload details.
    this.logger.info(`Sending POST request to ${apiUrl} with payload:`, {
      url,
    });

    try {
      // Await the response from the HTTP POST request.
      const response = await firstValueFrom(
        this.http.post<string>(apiUrl, { url })
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

  public async getLongUrl(shortCode: string): Promise<{ long_url: string }> {
    const apiUrl = `${this.backendBasePath}/${shortCode}`;
    try {
      return await firstValueFrom(this.http.get<{ long_url: string }>(apiUrl));
    } catch (error: unknown) {
      this.logger.error('Error fetching long URL for short code:', error);
      throw error;
    }
  }
}
