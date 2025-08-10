import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CotizadorService } from '../../services/cotizador.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-elegir-plan',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './elegir-plan.component.html',
  styleUrls: ['./elegir-plan.component.scss'],
})
export class ElegirPlanComponent implements OnInit {
  public car: any = null;
  public person: any = null;

  // Calcula el precio dinámico del plan según datos del auto y la localidad
  calculateDynamicPrice(plan: any, car: any, person: any): number {
    let basePrices: Record<string, number> = {
      'Básico': 26000,
      'Intermedio': 37000,
      'Premium': 52000
    };
    let price = basePrices[plan?.planType] || plan?.basePrice || plan?.price || 26000;

    if (car?.usage === 'comercial') {
      price += Math.round(price * 0.18) + 6000;
      if (car?.year) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - car.year;
        if (age <= 5) price += 3500;
        else if (age <= 10) price += 2000;
        else if (age <= 20) price += 1000;
      }
    } else {
      if (car?.year) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - car.year;
        if (age <= 5) price += 2500;
        else if (age <= 10) price += 1500;
        else if (age <= 20) price += 800;
      }
    }
    const premiumBrands = ['toyota', 'bmw', 'mercedes', 'audi', 'honda', 'volkswagen', 'volvo', 'ford', 'jeep', 'ram', 'chevrolet', 'peugeot', 'renault', 'citroen'];
    if (car?.brand && typeof car.brand === 'string' && premiumBrands.some(b => car.brand.toLowerCase().includes(b))) {
      price += 5000;
    }
    if (car?.version && typeof car.version === 'string' && car.version.toLowerCase().includes('full')) price += 3000;
    if (person?.locality && typeof person.locality === 'string') {
      const loc = person.locality.toLowerCase();
      if (/funes/.test(loc)) price += 2500;
      if (/rosario/.test(loc)) price += 4000;
      if (/buenos aires|caba|capital|amba/.test(loc)) price += 6000;
      if (/la plata/.test(loc)) price += 3500;
    }
    if (car?.gnc) price += 2000;
    return price;
  }

  getDynamicPlanPrice(plan: any): number {
    return this.calculateDynamicPrice(plan, this.car, this.person);
  }
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cotizadorService = inject(CotizadorService);

  planForm!: FormGroup;
  plans = signal([
    { 
      id: 'plan1', 
      name: 'Plan Básico', 
      description: 'Cobertura contra terceros completos + Cristales', 
      price: 35000, 
      planType: 'Básico',
      features: ['Responsabilidad Civil', 'Cristales', 'Servicio de Grúa'],
      recommended: false
    },
    { 
      id: 'plan2', 
      name: 'Plan Intermedio', 
      description: 'Cobertura completa con franquicia reducida', 
      price: 52000, 
      planType: 'Intermedio',
      features: ['Todo Riesgo con Franquicia', 'Robo Total', 'Incendio Total', 'Granizo', 'Asistencia 24hs'],
      recommended: true
    },
    { 
      id: 'plan3', 
      name: 'Plan Premium', 
      description: 'Cobertura total sin franquicia + beneficios exclusivos', 
      price: 78000, 
      planType: 'Premium',
      features: ['Todo Riesgo sin Franquicia', 'Auto Sustituto', 'Gastos Médicos', 'Robo Parcial', 'Protección Legal'],
      recommended: false
    },
  ]);

  selectedPlanId = signal<string | null>(null);

  ngOnInit(): void {
    this.planForm = this.fb.group({
      plan: ['', Validators.required],
    });

    const savedPlanData = this.cotizadorService.planData();
    if (savedPlanData?.id) {
      this.planForm.get('plan')?.setValue(savedPlanData.id);
      this.selectedPlanId.set(savedPlanData.id);
    }

    this.planForm.get('plan')?.valueChanges.subscribe(value => {
      this.selectedPlanId.set(value);
    });

    // Inicializar car y person desde el store
    this.car = this.cotizadorService.carData();
    this.person = this.cotizadorService.personalData();
  }

  formatPrice(price: number | undefined): string {
    return price?.toLocaleString('es-AR') ?? '0';
  }

  selectPlan(planId: string): void {
    this.planForm.get('plan')?.setValue(planId);
  }

  onSubmit() {
    if (this.planForm.valid) {
      const selectedPlan = this.plans().find(p => p.id === this.selectedPlanId());
      if (selectedPlan) {
        this.cotizadorService.setPlanData(selectedPlan);
        this.router.navigate(['cotizador/confirmacion']);
      }
    }
  }

  goBack() {
    this.router.navigate(['cotizador/datos-personales']);
  }
}