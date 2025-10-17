import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'orders',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/components/order-list/order-list.component').then(
            m => m.OrderListComponent
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/components/order-form/order-form.component').then(
            m => m.OrderFormComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['operator', 'admin'] }
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./features/components/order-form/order-form.component').then(
            m => m.OrderFormComponent
          ),
        canActivate: [roleGuard],
        data: { roles: ['operator', 'admin'] }
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/components/order-detail/order-detail.component').then(
            m => m.OrderDetailComponent
          )
      }
    ]
  },
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: '**', redirectTo: '/orders' }
];
