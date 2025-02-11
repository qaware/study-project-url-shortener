import { Component, effect, inject, input, signal } from '@angular/core';
import { UrlShortenerService } from '../../url-shortener.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  template: `
    @if(qrCodeBase64()) {
        <img [src]="qrCodeBase64()" alt="QR Code" />
    }
  `,
  styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent {
  private readonly urlShortenerService = inject(UrlShortenerService);
  private readonly logger = inject(NGXLogger);

  protected readonly qrCodeBase64 = signal<string | undefined>(undefined);

  readonly url = input<string | undefined>(undefined);

  private readonly updateQrCode = effect(() => {
    const url = this.url();
    if (url) {
        this.fetchQrCodeBase64(url);
    }
  })

  private async fetchQrCodeBase64(url: string) {
    try {
      const qrCodeBase64 = await this.urlShortenerService.getQrCode(url);
      if (qrCodeBase64 && 'image_base64' in qrCodeBase64) {
        this.qrCodeBase64.set(qrCodeBase64.image_base64);
      } else {
        throw {
          error: {
            detail: 'The returned QR code is empty',
          },
        };
      }
    } catch (error) {
      this.logger.warn('Failed to fetch QR Code', error);
      // No errors are displayed as the application should work without dispalyed errors if the QR endpoint is not implemented
    }
  }
}
