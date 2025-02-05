import { Routes } from '@angular/router';
import { RedirectComponent } from './components/redirect/redirect.component';
import { UrlShortenerComponent } from './components/url-shortener/url-shortener.component';

export const routes: Routes = [
    { path: '', component: UrlShortenerComponent },
    { path: '**', component: RedirectComponent },
];