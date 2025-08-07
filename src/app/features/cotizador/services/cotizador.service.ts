import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarData, PersonalData, PlanData, PaymentData, Marca, Modelo, Version } from '../models/cotizador.models';
import { Observable, of, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CotizadorService {
  // Devuelve las versiones guardadas en sessionStorage (cache)
  public getVersionesCache(): any[] {
    const stored = sessionStorage.getItem('versiones');
    return stored ? JSON.parse(stored) : [];
  }
  // Devuelve las localidades guardadas en sessionStorage (cache)
  public getLocalitiesCache(): any[] {
    const stored = sessionStorage.getItem('localities');
    return stored ? JSON.parse(stored) : [];
  }
  private http = inject(HttpClient);

  carData = signal<CarData | null>(this.loadFromSessionStorage('carData'));
  planData = signal<PlanData | null>(this.loadFromSessionStorage('planData'));
  personalData = signal<PersonalData | null>(this.loadFromSessionStorage('personalData'));
  paymentData = signal<PaymentData | null>(this.loadFromSessionStorage('paymentData'));

  marcas = signal<Marca[] | null>(this.loadFromSessionStorage('marcas'));
  modelos = signal<Modelo[] | null>(this.loadFromSessionStorage('modelos'));

  

  private fallbackMarcas: Marca[] = [
    { id: 1, nombre: 'Toyota' },
    { id: 2, nombre: 'Ford' },
    { id: 3, nombre: 'Chevrolet' },
    { id: 4, nombre: 'Volkswagen' },
    { id: 5, nombre: 'Honda' },
    { id: 6, nombre: 'Nissan' },
    { id: 7, nombre: 'Hyundai' },
    { id: 8, nombre: 'Kia' },
    { id: 9, nombre: 'Mercedes-Benz' },
    { id: 10, nombre: 'BMW' },
    { id: 11, nombre: 'Audi' },
    { id: 12, nombre: 'Fiat' },
    { id: 13, nombre: 'Renault' },
    { id: 14, nombre: 'Peugeot' },
    { id: 15, nombre: 'Citroën' },
  ];

  private fallbackModelos: Modelo[] = [
    { id: 101, marcaId: 1, nombre: 'Corolla' },
    { id: 102, marcaId: 1, nombre: 'Hilux' },
    { id: 103, marcaId: 1, nombre: 'Yaris' },
    { id: 104, marcaId: 1, nombre: 'Camry' },
    { id: 105, marcaId: 1, nombre: 'RAV4' },
    
    
    { id: 201, marcaId: 2, nombre: 'F-150' },
    { id: 202, marcaId: 2, nombre: 'Focus' },
    { id: 203, marcaId: 2, nombre: 'Mustang' },
    { id: 204, marcaId: 2, nombre: 'Fiesta' },
    { id: 205, marcaId: 2, nombre: 'Explorer' },
    { id: 206, marcaId: 2, nombre: 'Escape' },
    
    
    { id: 301, marcaId: 3, nombre: 'Silverado' },
    { id: 302, marcaId: 3, nombre: 'Cruze' },
    { id: 303, marcaId: 3, nombre: 'Onix' },
    { id: 304, marcaId: 3, nombre: 'Malibu' },
    { id: 305, marcaId: 3, nombre: 'Equinox' },
    { id: 306, marcaId: 3, nombre: 'Camaro' },
    
    
    { id: 401, marcaId: 4, nombre: 'Golf' },
    { id: 402, marcaId: 4, nombre: 'Jetta' },
    { id: 403, marcaId: 4, nombre: 'Amarok' },
    { id: 404, marcaId: 4, nombre: 'Passat' },
    { id: 405, marcaId: 4, nombre: 'Tiguan' },
    
    
    { id: 501, marcaId: 5, nombre: 'Civic' },
    { id: 502, marcaId: 5, nombre: 'CR-V' },
    { id: 503, marcaId: 5, nombre: 'HR-V' },
    { id: 504, marcaId: 5, nombre: 'Accord' },
    { id: 505, marcaId: 5, nombre: 'Pilot' },
    
    
    { id: 601, marcaId: 6, nombre: 'Frontier' },
    { id: 602, marcaId: 6, nombre: 'Sentra' },
    { id: 603, marcaId: 6, nombre: 'Kicks' },
    { id: 701, marcaId: 7, nombre: 'Tucson' },
    { id: 702, marcaId: 7, nombre: 'Elantra' },
    { id: 703, marcaId: 7, nombre: 'Creta' },
    { id: 801, marcaId: 8, nombre: 'Sportage' },
    { id: 802, marcaId: 8, nombre: 'Cerato' },
    { id: 803, marcaId: 8, nombre: 'Seltos' },
    { id: 901, marcaId: 9, nombre: 'Clase C' },
    { id: 902, marcaId: 9, nombre: 'Clase E' },
    { id: 903, marcaId: 9, nombre: 'GLC' },
    { id: 1001, marcaId: 10, nombre: 'Serie 3' },
    { id: 1002, marcaId: 10, nombre: 'Serie 5' },
    { id: 1003, marcaId: 10, nombre: 'X5' },
    { id: 1101, marcaId: 11, nombre: 'A3' },
    { id: 1102, marcaId: 11, nombre: 'A4' },
    { id: 1103, marcaId: 11, nombre: 'Q5' },
    { id: 1201, marcaId: 12, nombre: 'Cronos' },
    { id: 1202, marcaId: 12, nombre: 'Argo' },
    { id: 1203, marcaId: 12, nombre: 'Toro' },
    { id: 1301, marcaId: 13, nombre: 'Sandero' },
    { id: 1302, marcaId: 13, nombre: 'Duster' },
    { id: 1303, marcaId: 13, nombre: 'Logan' },
    { id: 1401, marcaId: 14, nombre: '208' },
    { id: 1402, marcaId: 14, nombre: '3008' },
    { id: 1403, marcaId: 14, nombre: 'Partner' },
    { id: 1501, marcaId: 15, nombre: 'C3' },
    { id: 1502, marcaId: 15, nombre: 'C4 Cactus' },
    { id: 1503, marcaId: 15, nombre: 'Berlingo' },
  ];

  private fallbackVersiones: Version[] = [
    { id: 10101, modeloId: 101, nombre: 'XLI 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 10102, modeloId: 101, nombre: 'XEI 1.8', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 10103, modeloId: 101, nombre: 'XEI 1.8 CVT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 10104, modeloId: 101, nombre: 'SEG 1.8 CVT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 10105, modeloId: 101, nombre: 'XEI Pack', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'CVT' },
    
    
    { id: 10201, modeloId: 102, nombre: 'DX 2.4 TDI 4x2', cilindrada: '2.4L', combustible: 'Diesel', transmision: 'Manual' },
    { id: 10202, modeloId: 102, nombre: 'DX 2.4 TDI 4x4', cilindrada: '2.4L', combustible: 'Diesel', transmision: 'Manual' },
    { id: 10203, modeloId: 102, nombre: 'SR 2.8 TDI 4x2', cilindrada: '2.8L', combustible: 'Diesel', transmision: 'Manual' },
    { id: 10204, modeloId: 102, nombre: 'SR 2.8 TDI 4x4', cilindrada: '2.8L', combustible: 'Diesel', transmision: 'Manual' },
    { id: 10205, modeloId: 102, nombre: 'SRX 2.8 TDI 4x4 AT', cilindrada: '2.8L', combustible: 'Diesel', transmision: 'Automática' },
    { id: 10206, modeloId: 102, nombre: 'Limited 2.8 TDI 4x4 AT', cilindrada: '2.8L', combustible: 'Diesel', transmision: 'Automática' },
    
    
    { id: 10301, modeloId: 103, nombre: 'XLS 1.5', cilindrada: '1.5L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 10302, modeloId: 103, nombre: 'XLS 1.5 CVT', cilindrada: '1.5L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 10303, modeloId: 103, nombre: 'XS 1.5', cilindrada: '1.5L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 10304, modeloId: 103, nombre: 'XS 1.5 CVT', cilindrada: '1.5L', combustible: 'Nafta', transmision: 'CVT' },


    { id: 20101, modeloId: 201, nombre: 'XL 3.3 V6', cilindrada: '3.3L V6', combustible: 'Nafta', transmision: 'Automática' },
    { id: 20102, modeloId: 201, nombre: 'XLT 3.5 V6', cilindrada: '3.5L V6', combustible: 'Nafta', transmision: 'Automática' },
    { id: 20103, modeloId: 201, nombre: 'Lariat 3.5 V6', cilindrada: '3.5L V6', combustible: 'Nafta', transmision: 'Automática' },
    
    
    { id: 20201, modeloId: 202, nombre: 'S 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 20202, modeloId: 202, nombre: 'S 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 20203, modeloId: 202, nombre: 'SE 2.0', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 20204, modeloId: 202, nombre: 'SE 2.0 AT', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 20205, modeloId: 202, nombre: 'Titanium 2.0 AT', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 20301, modeloId: 203, nombre: 'EcoBoost 2.3', cilindrada: '2.3L Turbo', combustible: 'Nafta', transmision: 'Manual' },
    { id: 20302, modeloId: 203, nombre: 'EcoBoost 2.3 AT', cilindrada: '2.3L Turbo', combustible: 'Nafta', transmision: 'Automática' },
    { id: 20303, modeloId: 203, nombre: 'GT 5.0 V8', cilindrada: '5.0L V8', combustible: 'Nafta', transmision: 'Manual' },
    { id: 20304, modeloId: 203, nombre: 'GT 5.0 V8 AT', cilindrada: '5.0L V8', combustible: 'Nafta', transmision: 'Automática' },


    { id: 30101, modeloId: 301, nombre: 'LT 5.3 V8', cilindrada: '5.3L V8', combustible: 'Nafta', transmision: 'Automática' },
    { id: 30102, modeloId: 301, nombre: 'LTZ 5.3 V8', cilindrada: '5.3L V8', combustible: 'Nafta', transmision: 'Automática' },
    { id: 30103, modeloId: 301, nombre: 'High Country 6.2 V8', cilindrada: '6.2L V8', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 30201, modeloId: 302, nombre: 'LS 1.4', cilindrada: '1.4L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 30202, modeloId: 302, nombre: 'LT 1.4', cilindrada: '1.4L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 30203, modeloId: 302, nombre: 'LT 1.4 AT', cilindrada: '1.4L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 30204, modeloId: 302, nombre: 'LT 1.4 Turbo', cilindrada: '1.4L Turbo', combustible: 'Nafta', transmision: 'Manual' },
    { id: 30205, modeloId: 302, nombre: 'LT 1.4 Turbo AT', cilindrada: '1.4L Turbo', combustible: 'Nafta', transmision: 'Automática' },
    { id: 30206, modeloId: 302, nombre: 'LTZ 1.4 Turbo AT', cilindrada: '1.4L Turbo', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 30301, modeloId: 303, nombre: 'Joy 1.4', cilindrada: '1.4L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 30302, modeloId: 303, nombre: 'LT 1.4', cilindrada: '1.4L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 30303, modeloId: 303, nombre: 'LT 1.4 AT', cilindrada: '1.4L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 30304, modeloId: 303, nombre: 'LTZ 1.4', cilindrada: '1.4L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 30305, modeloId: 303, nombre: 'Premier 1.4 AT', cilindrada: '1.4L', combustible: 'Nafta', transmision: 'Automática' },


    { id: 40101, modeloId: 401, nombre: 'Trendline 1.4 TSI', cilindrada: '1.4L TSI', combustible: 'Nafta', transmision: 'Manual' },
    { id: 40102, modeloId: 401, nombre: 'Comfortline 1.4 TSI', cilindrada: '1.4L TSI', combustible: 'Nafta', transmision: 'Manual' },
    { id: 40103, modeloId: 401, nombre: 'Comfortline 1.4 TSI AT', cilindrada: '1.4L TSI', combustible: 'Nafta', transmision: 'Automática' },
    { id: 40104, modeloId: 401, nombre: 'Highline 1.4 TSI AT', cilindrada: '1.4L TSI', combustible: 'Nafta', transmision: 'Automática' },
    { id: 40105, modeloId: 401, nombre: 'GTI 2.0 TSI', cilindrada: '2.0L TSI', combustible: 'Nafta', transmision: 'Manual' },
  
  
    { id: 40201, modeloId: 402, nombre: 'Trendline 1.4 TSI', cilindrada: '1.4L TSI', combustible: 'Nafta', transmision: 'Manual' },
    { id: 40202, modeloId: 402, nombre: 'Comfortline 1.4 TSI', cilindrada: '1.4L TSI', combustible: 'Nafta', transmision: 'Manual' },
    { id: 40203, modeloId: 402, nombre: 'Comfortline 1.4 TSI AT', cilindrada: '1.4L TSI', combustible: 'Nafta', transmision: 'Automática' },
    { id: 40204, modeloId: 402, nombre: 'Highline 1.4 TSI AT', cilindrada: '1.4L TSI', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 40301, modeloId: 403, nombre: 'Startline 2.0 TDI', cilindrada: '2.0L TDI', combustible: 'Diesel', transmision: 'Manual' },
    { id: 40302, modeloId: 403, nombre: 'Comfortline 2.0 TDI', cilindrada: '2.0L TDI', combustible: 'Diesel', transmision: 'Manual' },
    { id: 40303, modeloId: 403, nombre: 'Comfortline 2.0 TDI AT', cilindrada: '2.0L TDI', combustible: 'Diesel', transmision: 'Automática' },
    { id: 40304, modeloId: 403, nombre: 'Highline 2.0 TDI AT', cilindrada: '2.0L TDI', combustible: 'Diesel', transmision: 'Automática' },
    { id: 40305, modeloId: 403, nombre: 'Extreme 3.0 V6 TDI', cilindrada: '3.0L V6 TDI', combustible: 'Diesel', transmision: 'Automática' },


    { id: 50101, modeloId: 501, nombre: 'LX 1.8', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 50102, modeloId: 501, nombre: 'LX 1.8 CVT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 50103, modeloId: 501, nombre: 'EX 1.8 CVT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 50104, modeloId: 501, nombre: 'EXL 1.8 CVT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 50105, modeloId: 501, nombre: 'Touring 1.5 Turbo CVT', cilindrada: '1.5L Turbo', combustible: 'Nafta', transmision: 'CVT' },
  
  
    { id: 50201, modeloId: 502, nombre: 'LX 2.4', cilindrada: '2.4L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 50202, modeloId: 502, nombre: 'EX 2.4', cilindrada: '2.4L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 50203, modeloId: 502, nombre: 'EXL 2.4', cilindrada: '2.4L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 50204, modeloId: 502, nombre: 'Touring 1.5 Turbo', cilindrada: '1.5L Turbo', combustible: 'Nafta', transmision: 'CVT' },
  
  
    { id: 50301, modeloId: 503, nombre: 'LX 1.8', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 50302, modeloId: 503, nombre: 'LX 1.8 CVT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 50303, modeloId: 503, nombre: 'EX 1.8 CVT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 50304, modeloId: 503, nombre: 'EXL 1.8 CVT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'CVT' },


    { id: 60101, modeloId: 601, nombre: 'S 2.5 TDI 4x2', cilindrada: '2.5L TDI', combustible: 'Diesel', transmision: 'Manual' },
    { id: 60102, modeloId: 601, nombre: 'S 2.5 TDI 4x4', cilindrada: '2.5L TDI', combustible: 'Diesel', transmision: 'Manual' },
    { id: 60103, modeloId: 601, nombre: 'SE 2.5 TDI 4x4', cilindrada: '2.5L TDI', combustible: 'Diesel', transmision: 'Manual' },
    { id: 60104, modeloId: 601, nombre: 'LE 2.5 TDI 4x4 AT', cilindrada: '2.5L TDI', combustible: 'Diesel', transmision: 'Automática' },
  
  
    { id: 60201, modeloId: 602, nombre: 'S 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 60202, modeloId: 602, nombre: 'S 1.6 CVT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 60203, modeloId: 602, nombre: 'SV 1.6 CVT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 60204, modeloId: 602, nombre: 'SR 1.6 CVT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'CVT' },
  
  
    { id: 60301, modeloId: 603, nombre: 'S 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 60302, modeloId: 603, nombre: 'S 1.6 CVT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 60303, modeloId: 603, nombre: 'SV 1.6 CVT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'CVT' },
    { id: 60304, modeloId: 603, nombre: 'SR 1.6 CVT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'CVT' },


    { id: 70101, modeloId: 701, nombre: 'GL 2.0', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 70102, modeloId: 701, nombre: 'GL 2.0 AT', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 70103, modeloId: 701, nombre: 'GLS 2.0 AT', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 70104, modeloId: 701, nombre: 'Limited 2.0 AT', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 70201, modeloId: 702, nombre: 'GL 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 70202, modeloId: 702, nombre: 'GL 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 70203, modeloId: 702, nombre: 'GLS 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 70204, modeloId: 702, nombre: 'Limited 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 70301, modeloId: 703, nombre: 'GL 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 70302, modeloId: 703, nombre: 'GL 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 70303, modeloId: 703, nombre: 'GLS 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 70304, modeloId: 703, nombre: 'Limited 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },


    { id: 80101, modeloId: 801, nombre: 'LX 2.0', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 80102, modeloId: 801, nombre: 'LX 2.0 AT', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 80103, modeloId: 801, nombre: 'EX 2.0 AT', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 80104, modeloId: 801, nombre: 'SX 2.0 AT', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 80201, modeloId: 802, nombre: 'LX 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 80202, modeloId: 802, nombre: 'LX 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 80203, modeloId: 802, nombre: 'EX 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 80204, modeloId: 802, nombre: 'SX 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 80301, modeloId: 803, nombre: 'LX 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 80302, modeloId: 803, nombre: 'LX 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 80303, modeloId: 803, nombre: 'EX 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 80304, modeloId: 803, nombre: 'SX Turbo 1.6 AT', cilindrada: '1.6L Turbo', combustible: 'Nafta', transmision: 'Automática' },


    { id: 120101, modeloId: 1201, nombre: 'Drive 1.3', cilindrada: '1.3L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 120102, modeloId: 1201, nombre: 'Drive 1.8', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 120103, modeloId: 1201, nombre: 'Drive 1.8 AT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 120104, modeloId: 1201, nombre: 'Precision 1.8 AT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 120201, modeloId: 1202, nombre: 'Drive 1.3', cilindrada: '1.3L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 120202, modeloId: 1202, nombre: 'Drive 1.8', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 120203, modeloId: 1202, nombre: 'Drive 1.8 AT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 120204, modeloId: 1202, nombre: 'Precision 1.8 AT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 120301, modeloId: 1203, nombre: 'Freedom 1.8', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 120302, modeloId: 1203, nombre: 'Freedom 1.8 AT', cilindrada: '1.8L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 120303, modeloId: 1203, nombre: 'Volcano 2.0 TDI AT', cilindrada: '2.0L TDI', combustible: 'Diesel', transmision: 'Automática' },
    { id: 120304, modeloId: 1203, nombre: 'Ranch 2.0 TDI AT', cilindrada: '2.0L TDI', combustible: 'Diesel', transmision: 'Automática' },


    { id: 130101, modeloId: 1301, nombre: 'Authentique 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130102, modeloId: 1301, nombre: 'Expression 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130103, modeloId: 1301, nombre: 'Privilege 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130104, modeloId: 1301, nombre: 'Stepway 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130105, modeloId: 1301, nombre: 'Stepway 1.6 CVT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'CVT' },
  
  
    { id: 130201, modeloId: 1302, nombre: 'Expression 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130202, modeloId: 1302, nombre: 'Expression 1.6 4x4', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130203, modeloId: 1302, nombre: 'Privilege 2.0', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130204, modeloId: 1302, nombre: 'Privilege 2.0 4x4', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130205, modeloId: 1302, nombre: 'Dynamique 2.0 CVT', cilindrada: '2.0L', combustible: 'Nafta', transmision: 'CVT' },
  
  
    { id: 130301, modeloId: 1303, nombre: 'Authentique 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130302, modeloId: 1303, nombre: 'Expression 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130303, modeloId: 1303, nombre: 'Privilege 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 130304, modeloId: 1303, nombre: 'Privilege 1.6 CVT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'CVT' },


    { id: 140101, modeloId: 1401, nombre: 'Active 1.5', cilindrada: '1.5L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 140102, modeloId: 1401, nombre: 'Active 1.5 AT', cilindrada: '1.5L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 140103, modeloId: 1401, nombre: 'Allure 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 140104, modeloId: 1401, nombre: 'Allure 1.6 AT', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Automática' },
    { id: 140105, modeloId: 1401, nombre: 'GT Line 1.6 THP', cilindrada: '1.6L THP', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 140201, modeloId: 1402, nombre: 'Active 1.6 THP', cilindrada: '1.6L THP', combustible: 'Nafta', transmision: 'Automática' },
    { id: 140202, modeloId: 1402, nombre: 'Allure 1.6 THP', cilindrada: '1.6L THP', combustible: 'Nafta', transmision: 'Automática' },
    { id: 140203, modeloId: 1402, nombre: 'GT Line 1.6 THP', cilindrada: '1.6L THP', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 140301, modeloId: 1403, nombre: 'Furgon 1.6 HDI', cilindrada: '1.6L HDI', combustible: 'Diesel', transmision: 'Manual' },
    { id: 140302, modeloId: 1403, nombre: 'Patagonica 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 140303, modeloId: 1403, nombre: 'Patagonica VTC 1.6', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },


    { id: 150101, modeloId: 1501, nombre: 'VTI 115 Feel', cilindrada: '1.2L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 150102, modeloId: 1501, nombre: 'VTI 115 Feel Pack', cilindrada: '1.2L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 150103, modeloId: 1501, nombre: 'VTI 115 Shine', cilindrada: '1.2L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 150104, modeloId: 1501, nombre: 'VTI 115 Shine AT', cilindrada: '1.2L', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 150201, modeloId: 1502, nombre: 'VTI 115 Feel', cilindrada: '1.2L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 150202, modeloId: 1502, nombre: 'VTI 115 Feel Pack', cilindrada: '1.2L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 150203, modeloId: 1502, nombre: 'VTI 115 Shine', cilindrada: '1.2L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 150204, modeloId: 1502, nombre: 'VTI 115 Shine AT', cilindrada: '1.2L', combustible: 'Nafta', transmision: 'Automática' },
  
  
    { id: 150301, modeloId: 1503, nombre: 'Furgon 1.6 HDI', cilindrada: '1.6L HDI', combustible: 'Diesel', transmision: 'Manual' },
    { id: 150302, modeloId: 1503, nombre: 'Multispace VTI', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
    { id: 150303, modeloId: 1503, nombre: 'Multispace Feel', cilindrada: '1.6L', combustible: 'Nafta', transmision: 'Manual' },
  ];

  private anios: number[] = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
    2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005,
  ];

  constructor() {
    this.carData.set(this.loadFromSessionStorage('carData'));
    this.planData.set(this.loadFromSessionStorage('planData'));
    this.personalData.set(this.loadFromSessionStorage('personalData'));
    this.paymentData.set(this.loadFromSessionStorage('paymentData'));
  }
  private readonly NHTSA_API_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  setCarData(data: CarData) {
    this.carData.set(data);
    this.saveToSessionStorage('carData', data);
  }

  setPlanData(data: PlanData) {
    this.planData.set(data);
    this.saveToSessionStorage('planData', data);
  }

  setPersonalData(data: PersonalData) {
    this.personalData.set(data);
    this.saveToSessionStorage('personalData', data);
  }

  setPaymentData(data: PaymentData) {
    this.paymentData.set(data);
    this.saveToSessionStorage('paymentData', data);
  }

  resetCotizador() {
    this.carData.set(null);
    this.planData.set(null);
    this.personalData.set(null);
    this.paymentData.set(null);
    sessionStorage.clear();
  }

  private saveToSessionStorage(key: string, data: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to session storage', e);
    }
  }

  private loadFromSessionStorage<T>(key: string): T | null {
    try {
      const stored = sessionStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error loading from session storage', e);
      return null;
    }
  }

  getMarcas(): Observable<Marca[]> {
    const url = `${this.NHTSA_API_BASE}/GetMakesForVehicleType/car?format=json`;
    
    return this.http.get<any>(url).pipe(
      map((response) => {
        if (response && response.Results) {
          return response.Results.map((make: any, index: number) => ({
            id: make.MakeId || index + 1,
            nombre: make.MakeName
          }));
        }
        return this.fallbackMarcas;
      }),
      catchError((error) => {
        console.warn('Error fetching makes from API, using fallback data:', error);
        return of(this.fallbackMarcas);
      })
    );
  }

  getModelos(marcaId: number, marcaNombre?: string): Observable<Modelo[]> {
    if (this.modelos() && this.modelos()!.every(m => m.marcaId === marcaId)) {
      return of(this.modelos()!);
    }

    if (!marcaNombre) {
      const filteredModelos = this.fallbackModelos.filter(modelo => modelo.marcaId === marcaId);
      this.modelos.set(filteredModelos);
      return of(filteredModelos);
    }

    const url = `${this.NHTSA_API_BASE}/GetModelsForMake/${encodeURIComponent(marcaNombre)}?format=json`;
    
    return this.http.get<any>(url).pipe(
      map((response) => {
        if (response && response.Results) {
          const fetchedModelos = response.Results.map((model: any, index: number) => ({
            id: model.Model_ID || (marcaId * 100 + index + 1),
            marcaId: marcaId,
            nombre: model.Model_Name
          }));
          this.modelos.set(fetchedModelos);
          this.saveToSessionStorage('modelos', fetchedModelos);
          return fetchedModelos;
        }
        const filteredModelos = this.fallbackModelos.filter(modelo => modelo.marcaId === marcaId);
        this.modelos.set(filteredModelos);
        this.saveToSessionStorage('modelos', filteredModelos);
        return filteredModelos;
      }),
      catchError((error) => {
        console.warn('Error fetching models from API, using fallback data:', error);
        const filteredModelos = this.fallbackModelos.filter(modelo => modelo.marcaId === marcaId);
        this.modelos.set(filteredModelos);
        this.saveToSessionStorage('modelos', filteredModelos);
        return of(filteredModelos);
      })
    );
  }

  getVersiones(modeloId: number, modeloNombre?: string): Observable<Version[]> {
    let versiones = this.fallbackVersiones.filter(version => version.modeloId === modeloId);
    
    if (versiones.length === 0 && modeloNombre) {
      const nombreNormalizado = this.normalizeString(modeloNombre);
      
      const modeloLocal = this.fallbackModelos.find(modelo => {
        const modeloNormalizado = this.normalizeString(modelo.nombre);
        return modeloNormalizado.includes(nombreNormalizado) || 
               nombreNormalizado.includes(modeloNormalizado);
      });
      
      if (modeloLocal) {
        versiones = this.fallbackVersiones.filter(version => version.modeloId === modeloLocal.id);
      }
    }
    
    return of(versiones);
  }

  getVersionesByYearAndModel(modeloId: number, year: number, modeloNombre?: string): Observable<Version[]> {
    
    return this.getVersiones(modeloId, modeloNombre);
  }

  getAnios(): Observable<number[]> {
    return of(this.anios);
  }

  private normalizeString(str: string): string {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }
}
