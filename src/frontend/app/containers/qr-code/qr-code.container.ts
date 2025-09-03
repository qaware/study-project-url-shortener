import { Component, effect, inject, input, signal } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { QrCodeComponent } from '../../components/qr-code/qr-code.component';
import { UrlShortenerService } from '../../url-shortener.service';

@Component({
  selector: 'app-qr-code-container',
  standalone: true,
  imports: [QrCodeComponent],
  template: `
    <app-qr-code [qrCodeBase64]="qrCodeBase64()" />
  `
})
export class QrCodeContainer {
  private readonly urlShortenerService = inject(UrlShortenerService);
  private readonly logger = inject(NGXLogger);

  protected readonly qrCodeBase64 = signal<string | undefined>(undefined);

  readonly url = input<string | undefined>(undefined);

  private readonly updateQrCode = effect(() => {
    const url = this.url();
    if (url) {
        this.fetchQrCodeBase64(url);
    } else {
        this.qrCodeBase64.set(undefined);
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
      // No errors are displayed as the application should work without displayed errors if the QR endpoint is not implemented
      this.qrCodeBase64.set(undefined);
    }
  }
}
