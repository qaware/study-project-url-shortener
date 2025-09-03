import { Routes } from '@angular/router';
import { RedirectContainer } from './components/redirect/redirect.container';
import { StatisticsDashboardContainer } from './components/statistics-dashboard/statistics-dashboard.container';
import { UrlShortenerContainer } from './components/url-shortener/url-shortener.container';

export const routes: Routes = [
    { path: '', component: UrlShortenerContainer },
    { path: 'stats', component: StatisticsDashboardContainer },
    { path: '**', component: RedirectContainer },
];