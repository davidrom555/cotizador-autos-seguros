import { Routes } from '@angular/router';
import { StepValidationGuard } from './core/guards/step-validation.guard';

export const routes: Routes = [
  {
    path: 'contact',
  loadComponent: () => import('./shared/components/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'privacy-policy',
  loadComponent: () => import('./shared/components/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms-conditions',
  loadComponent: () => import('./shared/components/terms-conditions/terms-conditions.component').then(m => m.TermsConditionsComponent)
  },
  {
    path: 'privacy',
    redirectTo: 'privacy-policy',
    pathMatch: 'full'
  },
  {
    path: 'terms',
    redirectTo: 'terms-conditions',
    pathMatch: 'full'
  },
  {
    path: 'cotizador',
    children: [
      {
        path: 'datos-auto',
  loadComponent: () => import('./features/cotizador/pages/datos-auto/datos-auto.component').then(m => m.DatosAutoComponent)
      },
      {
        path: 'datos-personales',
  loadComponent: () => import('./features/cotizador/pages/datos-personales/datos-personales.component').then(m => m.DatosPersonalesComponent),
        canActivate: [StepValidationGuard]
      },
      {
        path: 'elegir-plan',
  loadComponent: () => import('./features/cotizador/pages/elegir-plan/elegir-plan.component').then(m => m.ElegirPlanComponent),
        canActivate: [StepValidationGuard]
      },
      {
        path: 'confirmacion',
  loadComponent: () => import('./features/cotizador/pages/confirmacion/confirmacion.component').then(m => m.ConfirmacionComponent),
        canActivate: [StepValidationGuard]
      },
      { path: '', redirectTo: 'datos-auto', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'cotizador', pathMatch: 'full' }
];
