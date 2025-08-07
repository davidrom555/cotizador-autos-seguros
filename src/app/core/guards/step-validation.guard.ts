import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { CotizadorService } from '../../features/cotizador/services/cotizador.service';
import { CarData, PersonalData, PlanData } from '../../features/cotizador/models/cotizador.models';

@Injectable({
  providedIn: 'root'
})
export class StepValidationGuard implements CanActivate {
  private cotizadorService = inject(CotizadorService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const currentStep = this.getCurrentStep(route.routeConfig?.path || '');
    
    switch (currentStep) {
      case 'datos-personales':
        return this.validateCarDataStep();
      
      case 'elegir-plan':
        return this.validatePersonalDataStep();
      
      case 'confirmacion':
        return this.validatePlanDataStep();
      
      default:
        return true; // Permitir acceso a datos-auto (primer paso)
    }
  }

  private getCurrentStep(path: string): string {
    return path.split('/').pop() || '';
  }

  private validateCarDataStep(): boolean | UrlTree {
    const carData = this.cotizadorService.carData();
    
    if (!carData || !this.isCarDataComplete(carData)) {
      return this.router.createUrlTree(['/cotizador/datos-auto']);
    }
    
    return true;
  }

  private validatePersonalDataStep(): boolean | UrlTree {
    const carData = this.cotizadorService.carData();
    const personalData = this.cotizadorService.personalData();
    
    if (!carData || !this.isCarDataComplete(carData)) {
      return this.router.createUrlTree(['/cotizador/datos-auto']);
    }
    
    if (!personalData || !this.isPersonalDataComplete(personalData)) {
      return this.router.createUrlTree(['/cotizador/datos-personales']);
    }
    
    return true;
  }

  private validatePlanDataStep(): boolean | UrlTree {
    const carData = this.cotizadorService.carData();
    const personalData = this.cotizadorService.personalData();
    const planData = this.cotizadorService.planData();
    
    if (!carData || !this.isCarDataComplete(carData)) {
      return this.router.createUrlTree(['/cotizador/datos-auto']);
    }
    
    if (!personalData || !this.isPersonalDataComplete(personalData)) {
      return this.router.createUrlTree(['/cotizador/datos-personales']);
    }
    
    if (!planData || !this.isPlanDataComplete(planData)) {
      return this.router.createUrlTree(['/cotizador/elegir-plan']);
    }
    
    return true;
  }


  private isCarDataComplete(data: CarData): boolean {
    return !!(
      data.brandId &&
      data.brand?.trim() &&
      data.modelId &&
      data.model?.trim() &&
      data.year &&
      data.usage?.trim()
    );
  }

  private isPersonalDataComplete(data: PersonalData): boolean {
    return !!(
      data.firstName?.trim() &&
      data.lastName?.trim() &&
      data.email?.trim() &&
      data.phone?.trim() &&
      data.postalCode?.trim() &&
      data.locality?.trim()
    );
  }

  private isPlanDataComplete(data: PlanData): boolean {
    return !!(
      data.name?.trim() &&
      data.planType?.trim() &&
      data.price
    );
  }
}