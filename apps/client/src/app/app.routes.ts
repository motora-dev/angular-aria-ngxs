import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home').then((m) => m.HomeComponent),
    data: { revalidate: 60 }, // ISR: キャッシュを60秒ごとに再検証
  },
];
