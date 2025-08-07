import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CotizadorService } from '../../services/cotizador.service';
import { CarData, PlanData, PersonalData } from '../../models/cotizador.models';
import jsPDF from 'jspdf';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirmacion.html',
  styleUrls: ['./confirmacion.scss'],
})
export class ConfirmacionComponent implements OnInit {
  public car: CarData | null = null;
  public plan: PlanData | null = null;
  public person: PersonalData | null = null;

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

  // Devuelve el precio dinámico para mostrar en el template
  getDynamicPlanPrice(): number {
    return this.calculateDynamicPrice(this.plan, this.car, this.person);
  }
  private cotizadorService = inject(CotizadorService);
  private router = inject(Router);

  carData = signal<CarData | null>(null);
  planData = signal<PlanData | null>(null);
  personalData = signal<PersonalData | null>(null);
  showConfirmationModal = signal(false);
  isSubmitting = signal(false);
  networkErrorModal = signal(false);
  networkErrorMessage = signal('');

  // Ahora tipamos el computed como string[]
  planFeatures = computed<string[]>(() => {
    const plan = this.planData();
    if (!plan) return [];
    if ((plan as any).features) {
      return (plan as any).features;
    }
    switch (plan.planType) {
      case 'Básico':
        return ['Responsabilidad Civil', 'Cristales', 'Servicio de Grúa'];
      case 'Intermedio':
        return [
          'Todo Riesgo con Franquicia',
          'Robo Total',
          'Incendio Total',
          'Granizo',
          'Asistencia 24hs'
        ];
      case 'Premium':
        return [
          'Todo Riesgo sin Franquicia',
          'Auto Sustituto',
          'Gastos Médicos',
          'Robo Parcial',
          'Protección Legal'
        ];
      default:
        return ['Cobertura básica incluida'];
    }
  });

  constructor() {
    emailjs.init('BAccsEXwD3PwquwVP');
  }

  ngOnInit(): void {
    const car = this.cotizadorService.carData();
    const plan = this.cotizadorService.planData();
    const person = this.cotizadorService.personalData();
    this.carData.set(car);
    this.planData.set(plan);
    this.personalData.set(person);
    this.car = car;
    this.plan = plan;
    this.person = person;
    if (!car || !plan || !person) {
      this.router.navigate(['cotizador/datos-auto']);
    }
  }


  formatPrice(price: number | undefined): string {
    if (!price) return '0';
    return price.toLocaleString('es-AR');
  }

  getDisplayValue(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value.nombre) return value.nombre;
    return String(value);
  }

  async contractInsurance() {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);

    try {
      await this.sendConfirmationEmail();
      this.showConfirmationModal.set(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.networkErrorMessage.set('Error de red: No se pudo procesar la solicitud. Por favor, verifica tu conexión e inténtalo de nuevo.');
      this.networkErrorModal.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  closeModal() {
    this.showConfirmationModal.set(false);
  }

  closeNetworkErrorModal() {
    this.networkErrorModal.set(false);
  }

  private async sendConfirmationEmail() {
    const templateParams = {
      email: this.person?.email || '',
      customer_name: `${this.person?.firstName || ''} ${this.person?.lastName || ''}`,
      plan_name: this.plan?.name || '',
      plan_price: `$${this.formatPrice(this.getDynamicPlanPrice())}/mes`,
      car_brand: this.getDisplayValue(this.car?.brand),
      car_model: this.getDisplayValue(this.car?.model),
      car_version: this.getDisplayValue(this.car?.version),
      car_year: this.car?.year || '',
      car_usage: this.car?.usage === 'particular' ? 'Particular' : 'Comercial',
      customer_phone: this.person?.phone || '',
      customer_location: `${this.person?.locality || ''} (${this.person?.postalCode || ''})`,
      request_date: new Date().toLocaleDateString('es-AR'),
      features_list: this.planFeatures().join(', '),
      subject: '✅ Cotización Aprobada - Tu Seguro de Auto'
    };

    try {
      return await emailjs.send(
        'service_v7j4gct',
        'template_61ovt5f',
        templateParams
      );
    } catch (error: any) {
      throw new Error(`Error al enviar email: ${error.text || error.message || 'Error desconocido'}`);
    }
  }

  downloadPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const darkGray: [number, number, number] = [60, 60, 60];
    const mediumGray: [number, number, number] = [100, 100, 100];
    const lightGray: [number, number, number] = [150, 150, 150];
    const blueColor: [number, number, number] = [0, 123, 255];

    pdf.setTextColor(...darkGray);
    pdf.setFontSize(24);
    pdf.text('Cotización de Seguro de Auto', 105, 25, { align: 'center' });

    pdf.setTextColor(...mediumGray);
    pdf.setFontSize(10);
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 20, 35);

    pdf.setDrawColor(...lightGray);
    pdf.line(20, 40, 190, 40);

    let yPosition = 55;

    // Plan
    pdf.setFillColor(248, 249, 250);
    pdf.rect(20, yPosition - 5, 170, 25, 'F');
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(16);
    pdf.text(`Plan: ${this.plan?.name || 'N/A'}`, 25, yPosition + 5);
    pdf.setTextColor(...mediumGray);
    pdf.setFontSize(12);
    pdf.text(`${this.plan?.description || ''}`, 25, yPosition + 10);
    pdf.setTextColor(...blueColor);
    pdf.setFontSize(20);
    pdf.text(`$${this.formatPrice(this.getDynamicPlanPrice())}/mes`, 165, yPosition + 10, { align: 'right' });

    // Vehículo
    yPosition += 35;
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(14);
    pdf.text('Tu Vehículo', 20, yPosition);
    yPosition += 10;
    const carInfo: [string, string][] = [
      ['Marca:', this.getDisplayValue(this.car?.brand)],
      ['Modelo:', this.getDisplayValue(this.car?.model)],
      ['Versión:', this.getDisplayValue(this.car?.version)],
      ['Año:', this.car?.year?.toString() || 'N/A'],
      ['Uso:', this.car?.usage === 'particular' ? 'Particular' : 'Comercial']
    ];
    if (this.car?.gnc) {
      carInfo.push(['GNC:', 'Sí']);
    }
    pdf.setTextColor(...mediumGray);
    pdf.setFontSize(10);
    carInfo.forEach(([label, value]) => {
      pdf.text(label, 25, yPosition);
      pdf.setTextColor(...darkGray);
      pdf.text(value, 70, yPosition);
      pdf.setTextColor(...mediumGray);
      yPosition += 6;
    });

    // Tus Datos
    yPosition += 10;
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(14);
    pdf.text('Tus Datos', 20, yPosition);
    yPosition += 10;
    const personalInfo: [string, string][] = [
      ['Nombre:', `${this.person?.firstName || ''} ${this.person?.lastName || ''}`],
      ['Email:', this.person?.email || 'N/A'],
      ['Teléfono:', this.person?.phone || 'N/A'],
      ['Localidad:', `${this.person?.locality || ''} (${this.person?.postalCode || ''})`]
    ];
    pdf.setTextColor(...mediumGray);
    pdf.setFontSize(10);
    personalInfo.forEach(([label, value]) => {
      pdf.text(label, 25, yPosition);
      pdf.setTextColor(...darkGray);
      pdf.text(value, 70, yPosition);
      pdf.setTextColor(...mediumGray);
      yPosition += 6;
    });

    // Cobertura
    yPosition += 15;
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(14);
    pdf.text('Tu Cobertura Incluye', 20, yPosition);
    yPosition += 8;
    pdf.setTextColor(...mediumGray);
    pdf.setFontSize(10);
    this.planFeatures().forEach(feature => {
      pdf.text('✓', 25, yPosition);
      pdf.text(feature, 32, yPosition);
      yPosition += 6;
    });

    // Footer
    pdf.setTextColor(...lightGray);
    pdf.setFontSize(8);
    pdf.text('Esta cotización es válida por 30 días.', 105, 280, { align: 'center' });
    pdf.text('Generado automáticamente por el sistema de cotizaciones.', 105, 285, { align: 'center' });

    pdf.save('cotización-auto.pdf');
  }

  newQuotation() {
    this.cotizadorService.resetCotizador();
    this.router.navigate(['cotizador/datos-auto']);
  }

  goBack() {
    this.router.navigate(['cotizador/elegir-plan']);
  }
}
