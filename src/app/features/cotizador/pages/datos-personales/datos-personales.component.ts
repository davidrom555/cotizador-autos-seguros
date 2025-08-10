import { Component, OnInit, signal, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CotizadorService } from '../../services/cotizador.service';
import { LocationService, LocationData } from '../../../../core/services/location.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NetworkErrorModalComponent } from '../../../../shared/components/network-error-modal/network-error-modal.component';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NetworkErrorModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
})
export class DatosPersonalesComponent implements OnInit {
  networkErrorModal = signal(false);
  networkErrorMessage = signal('');

  private isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cotizadorService = inject(CotizadorService);
  private locationService = inject(LocationService);
  private destroy$ = new Subject<void>();

  personalForm!: FormGroup;

  isLoading = signal(false);
  showSuggestions = signal(false);
  suggestions = signal<LocationData[]>([]);
  userLocation: { lat: number; lon: number } | null = null;

  get codigoPostalEncontrado(): boolean {
    // Solo es true si hay sugerencias para el código postal ingresado
    const postalCode = this.personalForm?.get('postalCode')?.value;
    return !!postalCode && this.suggestions().length > 0;
  }

  get mostrarErrorCodigoPostal(): boolean {
    // Mostrar error solo si el campo tiene valor, no está cargando, no hay sugerencias y no se ha seleccionado localidad
    const postalCode = this.personalForm?.get('postalCode')?.value;
    const locality = this.personalForm?.get('locality')?.value;
    const localityDisabled = !!this.personalForm?.get('locality')?.disabled;
    // Solo mostrar el error si la localidad está vacía Y deshabilitada
    return !!postalCode && this.suggestions().length === 0 && !this.isLoading() && (!locality && localityDisabled === true);
  }

  constructor() {}

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      firstName:  ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      lastName:   ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email:      ['', [Validators.required, Validators.email]],
      phone:      ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      postalCode: ['', Validators.required],
      locality:   [{ value: '', disabled: true }, Validators.required],
      province:   [''],
    });

    const savedData = this.cotizadorService.personalData();
    if (savedData) {
      this.personalForm.patchValue(savedData);
    }

    // Guardar localidades en cache/store si existen
    const cachedLocalities = this.cotizadorService.getLocalitiesCache?.() || [];
    if (cachedLocalities.length > 0) {
      this.suggestions.set(cachedLocalities);
    }

  

    this.personalForm.get('postalCode')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.personalForm.get('locality')?.reset({ value: '', disabled: true });
        this.isLoading.set(true);
        this.showSuggestions.set(true);
        this.suggestions.set([]);
      }),
      switchMap(query => {
        if (!query || query.length < 2) {
          this.isLoading.set(false);
          return of([]);
        }
        if (!this.isOnline()) {
          // Filtrar el cache por coincidencia con el input
          const cachedLocalities = this.cotizadorService.getLocalitiesCache?.() || [];
          const filtered = cachedLocalities.filter((loc: any) => {
            const q = query.toLowerCase();
            return loc.postalCode?.toLowerCase().includes(q) || loc.locality?.toLowerCase().includes(q);
          });
          if (filtered.length > 0) {
            this.suggestions.set(filtered);
            this.isLoading.set(false);
            this.networkErrorMessage.set('No hay conexión a internet. Mostrando datos guardados.');
            this.networkErrorModal.set(true);
            return of(filtered);
          } else {
            this.networkErrorMessage.set('No hay conexión a internet. No se encontraron coincidencias en los datos guardados.');
            this.networkErrorModal.set(true);
            this.isLoading.set(false);
            return of([]);
          }
        }
        return this.locationService.search(query, this.userLocation?.lat, this.userLocation?.lon);
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.isLoading.set(false);
      this.suggestions.set(results);
      // Si hay conexión, guardar resultados en cache
      if (this.isOnline() && results.length > 0) {
        try {
          sessionStorage.setItem('localities', JSON.stringify(results));
        } catch (e) {
          console.error('Error guardando localidades en cache', e);
        }
      }
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectSuggestion(location: LocationData): void {
    this.personalForm.get('postalCode')?.setValue(location.postalCode, { emitEvent: false });
    this.personalForm.patchValue({ locality: location.locality, province: location.province }, { emitEvent: false });
    this.showSuggestions.set(false);
    this.suggestions.set([]);
  }

  
  onFocus(): void {
    if (this.suggestions().length > 0) this.showSuggestions.set(true);
  }

  onBlur(): void {
    setTimeout(() => this.showSuggestions.set(false), 200);
  }

  onSubmit(): void {
    if (this.personalForm.valid) {
      this.cotizadorService.setPersonalData(this.personalForm.getRawValue());
      this.router.navigate(['cotizador', 'elegir-plan']);
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  goBack(): void {
    if (!this.isOnline()) {
      this.networkErrorMessage.set('No hay conexión a internet. Los datos se mantienen cargados.');
      this.networkErrorModal.set(true);
      // No navega, solo muestra el modal y mantiene los datos
      return;
    }
    this.router.navigate(['cotizador', 'datos-auto']);
  }
}