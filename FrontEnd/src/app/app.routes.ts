import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'candidate-profile',
        pathMatch: 'full',
      },
      {
        path: 'candidate-profile',
        loadComponent: () =>
          import('./components/candidate-profile/candidate-profile-page.component')
            .then((m) => m.CandidateProfilePageComponent),
      },
      {
        path: 'recruitment-batch',
        loadComponent: () =>
          import('./components/recruitment-batch/recruitment-batch-page.component')
            .then((m) => m.RecruitmentBatchPageComponent),
      },
    ],
  },
];
