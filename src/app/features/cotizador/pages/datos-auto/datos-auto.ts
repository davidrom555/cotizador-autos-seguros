import { Component, OnInit, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { MatFormFieldModule }      from '@angular/material/form-field';
import { MatInputModule }          from '@angular/material/input';
import { MatAutocompleteModule }   from '@angular/material/autocomplete';
import { MatOptionModule }         from '@angular/material/core';
import { MatButtonModule }         from '@angular/material/button';
import { MatSelectModule }         from '@angular/material/select';
import { MatCheckboxModule }       from '@angular/material/checkbox';
import { MatProgressSpinnerModule }from '@angular/material/progress-spinner';

import { CotizadorService } from '../../services/cotizador.service';
import { Marca, Modelo, Version } from '../../models/cotizador.models';
import { NetworkErrorModalComponent } from '../../../../shared/components/network-error-modal/network-error-modal.component';

const isObjectValidator = (control: AbstractControl): ValidationErrors | null => {
  if (control.value && typeof control.value === 'string' && control.value.trim() !== '') {
    return { 'invalidSelection': true };
  }
  return null;
};

@Component({
  selector: 'app-datos-auto',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    NetworkErrorModalComponent
  ],
  templateUrl: './datos-auto.html',
  styleUrls: ['./datos-auto.scss']
})
export class DatosAutoComponent implements OnInit {
  networkErrorModal = signal(false);
  networkErrorMessage = signal('');

  private isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
  private destroy$ = new Subject<void>();
  private fb               = inject(FormBuilder);
  private cotizadorService = inject(CotizadorService);
  private router           = inject(Router);

  // 1) Form creado **antes** de toSignal
  carForm: FormGroup = this.fb.group({
    brand:   [null,    [Validators.required, isObjectValidator]],
    model:   [null,    [Validators.required, isObjectValidator]],
    version: [null, Validators.required],
    year:    ['',      Validators.required],
    gnc:     [false],
    usage:   ['',      Validators.required],
  });

  // 2) Señales
  allMarcas    = signal<Marca[]>([]);
  allModelos   = signal<Modelo[]>([]);
  allVersiones = signal<Version[]>([]);
  allAnios     = signal<number[]>([]);

  loadingMarcas    = signal(false);
  loadingModelos   = signal(false);
  loadingVersiones = signal(false);

  // 3) valueChanges → señales
  brandValue = toSignal(this.carForm.get('brand')!.valueChanges);
  modelValue = toSignal(this.carForm.get('model')!.valueChanges);
  yearValue  = toSignal(this.carForm.get('year')!.valueChanges);

  // 4) Computed
  filteredMarcas    = computed(() => this._filterMarcas(this.brandValue()));
  filteredModelos   = computed(() => this._filterModelos(this.modelValue(), this.allModelos()));
  filteredVersiones = computed(() =>
    this._filterVersiones(
      this.carForm.get('version')!.value,
      this.allVersiones()
    )
  );

  years: number[] = [];

  constructor() {
    // Cuando cambia marca
    effect(() => {
      const brand = this.brandValue();
      if (brand && typeof brand === 'object' && brand.id) {
        this.loadModelos(brand.id, brand.nombre);
        // Solo resetea el modelo si la marca fue cambiada por el usuario (dirty)
        if (this.carForm.get('brand')?.dirty) {
          this.carForm.patchValue({ model: null, version: null });
        }
      } else {
        this.allModelos.set([]);
        this.allVersiones.set([]);
      }
    });

    // Cuando cambia modelo o año
    effect(() => {
      const model = this.modelValue();
      const year = this.yearValue();
      if (model && typeof model === 'object' && model.id) {
        this.loadVersiones(model.id, year ? parseInt(year, 10) : undefined);
        // Solo resetea la versión si el modelo fue cambiado por el usuario (dirty)
        if (this.carForm.get('model')?.dirty) {
          this.carForm.get('version')!.setValue(null);
        }
      } else {
        this.allVersiones.set([]);
      }
    });
  }

  ngOnInit() {
    // Generar lista de años
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 25 }, (_, i) => currentYear - i);

    this.loadMarcas();
    this.loadAnios();
  }

  // New effect to load saved data once marcas are available
  private loadSavedDataEffect = effect(() => {
    if (this.allMarcas().length > 0) {
      this.loadSavedCarData();
    }
  });


  private loadMarcas() {
    if (!this.isOnline()) {
      // Intentar cargar del cache/store si existe
      const cachedMarcas = this.cotizadorService.marcas() || [];
      if (cachedMarcas.length > 0) {
        this.allMarcas.set(cachedMarcas);
        this.loadingMarcas.set(false);
        this.networkErrorMessage.set('No hay conexión a internet. Mostrando marcas guardadas.');
        this.networkErrorModal.set(true);
        return;
      } else {
        this.networkErrorMessage.set('No hay conexión a internet. No se pueden cargar las marcas.');
        this.networkErrorModal.set(true);
        this.loadingMarcas.set(false);
        return;
      }
    }
    this.loadingMarcas.set(true);
    this.cotizadorService.getMarcas().pipe(takeUntil(this.destroy$)).subscribe({
      next: (marcas: Marca[]) => {
        this.allMarcas.set(marcas);
        this.loadingMarcas.set(false);
        // Guardar marcas en cache
        if (this.isOnline() && marcas.length > 0) {
          try {
            sessionStorage.setItem('marcas', JSON.stringify(marcas));
          } catch (e) {
            console.error('Error guardando marcas en cache', e);
          }
        }
      },
      error: err => {
        console.error('Error loading marcas:', err);
        this.loadingMarcas.set(false);
      }
    });
  }

  private loadAnios() {
    if (!this.isOnline()) {
      if (this.allAnios().length > 0) {
        return;
      } else {
        this.networkErrorMessage.set('No hay conexión a internet. No se pueden cargar los años.');
        this.networkErrorModal.set(true);
        return;
      }
    }
    this.cotizadorService.getAnios().pipe(takeUntil(this.destroy$)).subscribe((anios: number[]) => {
      this.allAnios.set(anios);
    });
  }

  private loadModelos(marcaId: number, marcaNombre: string) {
    if (!this.isOnline()) {
      // Intentar cargar del cache/store si existe
      let cachedModelos = this.cotizadorService.modelos() || [];
      if (cachedModelos.length === 0) {
        // Si no hay cache, usar fallback y guardar en sessionStorage
        cachedModelos = this.cotizadorService['fallbackModelos'].filter(m => m.marcaId === marcaId);
        try {
          sessionStorage.setItem('modelos', JSON.stringify(cachedModelos));
        } catch (e) {
          console.error('Error guardando modelos fallback en cache', e);
        }
      }
      if (cachedModelos.length > 0) {
        this.allModelos.set(cachedModelos.filter(m => m.marcaId === marcaId));
        this.loadingModelos.set(false);
        this.networkErrorMessage.set('No hay conexión a internet. Mostrando modelos guardados.');
        this.networkErrorModal.set(true);
        return;
      } else {
        this.networkErrorMessage.set('No hay conexión a internet. No se pueden cargar los modelos.');
        this.networkErrorModal.set(true);
        this.loadingModelos.set(false);
        return;
      }
    }
    if (this.cotizadorService.modelos() && this.cotizadorService.modelos()!.every(m => m.marcaId === marcaId)) {
      this.allModelos.set(this.cotizadorService.modelos()!);
      // If the brand is pristine (not touched by the user), try to restore the saved model
      if (this.carForm.get('brand')?.pristine) {
        const saved = this.cotizadorService.carData();
        if (saved?.modelId && this.cotizadorService.modelos()!.length > 0) {
          const modelToSet = this.cotizadorService.modelos()!.find(m => m.id === saved.modelId);
          if (modelToSet) {
            this.carForm.patchValue({ model: modelToSet });
          }
        }
      }
      return;
    }

    this.loadingModelos.set(true);
    this.cotizadorService.getModelos(marcaId, marcaNombre).pipe(takeUntil(this.destroy$)).subscribe({
      next: (modelos: Modelo[]) => {
        this.allModelos.set(modelos);
        this.loadingModelos.set(false);
        // Guardar modelos en cache
        if (this.isOnline() && modelos.length > 0) {
          try {
            sessionStorage.setItem('modelos', JSON.stringify(modelos));
          } catch (e) {
            console.error('Error guardando modelos en cache', e);
          }
        }
        // Si la marca está pristina (no la tocó el usuario), intentamos restaurar el modelo guardado
        if (this.carForm.get('brand')?.pristine) {
          const saved = this.cotizadorService.carData();
          if (saved?.modelId && modelos.length > 0) {
            const modelToSet = modelos.find(m => m.id === saved.modelId);
            if (modelToSet) {
              this.carForm.patchValue({ model: modelToSet });
            }
          }
        }
      },
      error: err => {
        console.error('Error loading modelos:', err);
        this.allModelos.set([]);
        this.loadingModelos.set(false);
      }
    });
  }

  private loadVersiones(modeloId: number, year?: number) {
    if (!this.isOnline()) {
      // Intentar cargar del cache/store si existe
      let cachedVersiones = this.cotizadorService.getVersionesCache?.() || [];
      if (cachedVersiones.length === 0) {
        // Si no hay cache, usar fallback y guardar en sessionStorage
        cachedVersiones = this.cotizadorService['fallbackVersiones'].filter((v: any) => v.modeloId === modeloId);
        try {
          sessionStorage.setItem('versiones', JSON.stringify(cachedVersiones));
        } catch (e) {
          console.error('Error guardando versiones fallback en cache', e);
        }
      }
      if (cachedVersiones.length > 0) {
        this.allVersiones.set(cachedVersiones.filter((v: any) => v.modeloId === modeloId));
        this.loadingVersiones.set(false);
        this.networkErrorMessage.set('No hay conexión a internet. Mostrando versiones guardadas.');
        this.networkErrorModal.set(true);
        return;
      } else {
        this.networkErrorMessage.set('No hay conexión a internet. No se pueden cargar las versiones.');
        this.networkErrorModal.set(true);
        this.loadingVersiones.set(false);
        return;
      }
    }
    this.loadingVersiones.set(true);
    const sel = this.carForm.get('model')!.value as Modelo;
    const nombre = sel?.nombre;
    const obs = year
      ? this.cotizadorService.getVersionesByYearAndModel(modeloId, year, nombre)
      : this.cotizadorService.getVersiones(modeloId, nombre);

    obs.pipe(takeUntil(this.destroy$)).subscribe({
      next: (vers: Version[]) => {
        this.allVersiones.set(vers);
        this.loadingVersiones.set(false);
        // Guardar versiones en cache
        if (this.isOnline() && vers.length > 0) {
          try {
            sessionStorage.setItem('versiones', JSON.stringify(vers));
          } catch (e) {
            console.error('Error guardando versiones en cache', e);
          }
        }
        // Si el modelo está pristino (no lo tocó el usuario), intentamos restaurar la versión guardada
        if (this.carForm.get('model')?.pristine) {
          const saved = this.cotizadorService.carData();
          if (saved?.versionId && vers.length > 0) {
            const versionToSet = vers.find(v => v.id === saved.versionId);
            if (versionToSet) {
              this.carForm.patchValue({ version: versionToSet });
            }
          } else if (saved?.version) {
            this.carForm.patchValue({ version: saved.version });
          }
        }
      },
      error: err => {
        console.error('Error loading versiones:', err);
        this.allVersiones.set([]);
        this.loadingVersiones.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSavedCarData() {
    const saved = this.cotizadorService.carData();
    if (!saved || this.allMarcas().length === 0) return;

    // 5) .find tipado
    const marca = this.allMarcas().find((m: Marca) => m.id === saved.brandId) || null;
    this.carForm.patchValue({
      brand: marca,
      year:  saved.year?.toString() ?? '',
      gnc:   saved.gnc ?? false,
      usage: saved.usage ?? ''
    });
    // modelos y versiones se cargan por los effects
  }

  displayBrandFn   = (m: Marca  | null) => m?.nombre ?? '';
  displayModelFn   = (m: Modelo | null) => m?.nombre ?? '';
  displayVersionFn = (v: Version | string | null) => typeof v === 'string' ? v : v?.nombre ?? '';

  // 6) .filter tipado
  private _filterMarcas(value: any): Marca[] {
    if (!value || typeof value !== 'string') {
      return this.allMarcas().slice(0, 10);
    }
    const q = value.toLowerCase();
    return this.allMarcas()
      .filter((m: Marca) => m.nombre.toLowerCase().includes(q))
      .slice(0, 10);
  }

  private _filterModelos(value: any, models: Modelo[]): Modelo[] {
    if (!value) {
      return models.slice(0, 15);
    }
    if (typeof value === 'object') {
      // Si ya hay un modelo seleccionado, mostrar todos los modelos disponibles
      return models;
    }
    const q = value.toLowerCase();
    return models
      .filter((m: Modelo) => m.nombre.toLowerCase().includes(q))
      .slice(0, 15);
  }

  private _filterVersiones(value: any, vers: Version[]): Version[] {
    if (!value) {
      return vers.slice(0, 20);
    }
    if (typeof value === 'object') {
      // Si ya hay una versión seleccionada, mostrar todas las versiones disponibles
      return vers;
    }
    const q = value.toLowerCase();
    return vers
      .filter((v: Version) => v.nombre.toLowerCase().includes(q))
      .slice(0, 20);
  }

  onSubmit() {
    if (this.carForm.valid) {
      const f = this.carForm.value;
      const versionValue = f.version;
      let versionId: number | undefined;
      let versionNombre: string | undefined;

      if (typeof versionValue === 'string') {
        versionNombre = versionValue;
      } else if (versionValue && typeof versionValue === 'object') {
        versionNombre = versionValue.nombre;
        versionId = versionValue.id;
      }

      this.cotizadorService.setCarData({
        brandId:   f.brand!.id,
        brand:     f.brand!.nombre,
        modelId:   f.model!.id,
        model:     f.model!.nombre,
        versionId: versionId,
        version:   versionNombre,
        year:      parseInt(f.year, 10),
        gnc:       f.gnc,
        usage:     f.usage
      });
      this.router.navigate(['/cotizador/datos-personales']);
    } else {
      Object.values(this.carForm.controls).forEach(c => c.markAsTouched());
    }
  }

  goBack() {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.networkErrorMessage.set('No hay conexión a internet. Los datos se mantienen cargados.');
      this.networkErrorModal.set(true);
      // No navega, solo muestra el modal y mantiene los datos
      return;
    }
    this.router.navigate(['/']);
  }
}
