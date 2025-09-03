import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { firstValueFrom } from 'rxjs';

export interface ClickStats {
  short_code: string;
  original_url: string;
  click_count: number;
  created_at: string;
}

export interface DetailedStats {
  short_code: string;
  original_url: string;
  click_count: number;
  recent_clicks: string[];
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(NGXLogger);
  private readonly backendBasePath = '/api';

  /**
   * Checks if the statistics feature is available by testing the stats endpoint.
   */
  public async isStatsFeatureAvailable(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.get(`${this.backendBasePath}/stats`)
      );
      return true;
    } catch (error: unknown) {
      this.logger.info('Statistics feature not available or not implemented');
      return false;
    }
  }

  /**
   * Gets statistics for all shortened URLs.
   */
  public async getAllStats(): Promise<ClickStats[]> {
    const apiUrl = `${this.backendBasePath}/stats`;
    
    try {
      const response = await firstValueFrom(
        this.http.get<ClickStats[]>(apiUrl)
      );
      
      this.logger.info('Retrieved statistics for all URLs');
      return response;
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        this.logger.error('Failed to fetch statistics', error);
      }
      throw error;
    }
  }

  /** 
   * Gets detailed statistics for a specific short URL.
   */
  public async getStatsForUrl(shortCode: string): Promise<DetailedStats> {
    const apiUrl = `${this.backendBasePath}/stats/${shortCode}`;
    
    try {
      const response = await firstValueFrom(
        this.http.get<DetailedStats>(apiUrl)
      );
      
      this.logger.info(`Retrieved statistics for ${shortCode}`);
      return response;
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        this.logger.error(`Failed to fetch statistics for ${shortCode}`, error);
      }
      throw error;
    }
  }
}
