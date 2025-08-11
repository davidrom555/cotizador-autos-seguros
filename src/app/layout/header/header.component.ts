import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CotizadorService } from '../../features/cotizador/services/cotizador.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  isMobileMenuOpen = signal(false);

  isCarDataComplete = computed(() => {
    const data = this.cotizadorService.carData();
    console.log('Car data computed:', data);
    return !!(
      data?.brandId &&
      data?.brand?.trim() &&
      data?.modelId &&
      data?.model?.trim() &&
      data?.year &&
      data?.usage?.trim()
    );
  });

  isPersonalDataComplete = computed(() => {
    const data = this.cotizadorService.personalData();
    console.log('Personal data computed:', data);
    return !!(
      data?.firstName?.trim() &&
      data?.lastName?.trim() &&
      data?.email?.trim() &&
      data?.phone?.trim() &&
      data?.postalCode?.trim() &&
      data?.locality?.trim()
    );
  });

  isPlanDataComplete = computed(() => {
    const data = this.cotizadorService.planData();
    console.log('Plan data computed:', data);
    return !!(
      data?.id?.trim() &&
      data?.name?.trim() &&
      data?.price &&
      data?.price > 0
    );
  });

  isPersonalDataAvailable = computed(() => {
    return this.isCarDataComplete();
  });

  isPlanSelectionAvailable = computed(() => {
    return this.isCarDataComplete() && this.isPersonalDataComplete();
  });

  isConfirmationAvailable = computed(() => {
    return this.isCarDataComplete() && this.isPersonalDataComplete() && this.isPlanDataComplete();
  });

  constructor(
    private cotizadorService: CotizadorService,
    private router: Router
  ) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  navigateTo(route: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }

    switch (route) {
      case '/cotizador/datos-personales':
        if (this.isPersonalDataAvailable()) {
          this.router.navigate([route]);
          this.closeMobileMenu();
        }
        break;
      
      case '/cotizador/elegir-plan':
        if (this.isPlanSelectionAvailable()) {
          this.router.navigate([route]);
          this.closeMobileMenu();
        }
        break;
      
      case '/cotizador/confirmacion':
        if (this.isConfirmationAvailable()) {
          this.router.navigate([route]);
          this.closeMobileMenu();
        }
        break;
      
      default:
        this.router.navigate([route]);
        this.closeMobileMenu();
        break;
    }
  }
}
