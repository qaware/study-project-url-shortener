import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ShortenResponse {
  short_code: string;
  long_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class UrlShortenerService {
  private backendUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  shortenUrl(url: string): Observable<ShortenResponse> {
    return this.http.post<ShortenResponse>(`${this.backendUrl}/shorten`, { url });
  }
}