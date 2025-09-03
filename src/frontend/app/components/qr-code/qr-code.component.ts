import { Component, input } from '@angular/core';

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
  readonly qrCodeBase64 = input<string | undefined>();
}
