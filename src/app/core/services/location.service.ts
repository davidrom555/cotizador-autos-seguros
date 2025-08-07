import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LocationData {
  postalCode: string;
  locality: string;
  province: string;
  latitude?: number;
  longitude?: number;
}

interface GeorefCpResponse {
  codigos_postales: { codigo_postal: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly GEOREF_API_URL = 'https://apis.datos.gob.ar/georef/api';
  private readonly ZIPPOPOTAM_API_URL = 'https://api.zippopotam.us/ar/';
  private readonly GEONAMES_API_URL = 'https://secure.geonames.org/findNearbyPostalCodesJSON';
  private readonly GEONAMES_USERNAME = environment.geonamesUsername;

  private fallbackData: LocationData[] = [
    { postalCode: 'B1636', locality: 'Olivos', province: 'Buenos Aires', latitude: -34.51, longitude: -58.50 },
    { postalCode: 'C1425', locality: 'Palermo', province: 'CABA', latitude: -34.58, longitude: -58.42 },
    { postalCode: 'X5000', locality: 'Córdoba', province: 'Córdoba', latitude: -31.42, longitude: -64.18 },
    { postalCode: 'S2000', locality: 'Rosario', province: 'Santa Fe', latitude: -32.95, longitude: -60.64 },
    { postalCode: 'M5500', locality: 'Mendoza', province: 'Mendoza', latitude: -32.89, longitude: -68.85 },
  ];

  constructor(private http: HttpClient) {}

  search(query: string, userLat?: number, userLon?: number): Observable<LocationData[]> {
    const obs = /^\d+$/.test(query)
      ? this.searchByPostalCode(query)
      : this.searchByLocality(query);

    return obs.pipe(
      map(locations => {
        if (userLat && userLon) {
          return this.sortLocationsByDistance(locations, userLat, userLon);
        }
        return locations;
      })
    );
  }

  searchByPostalCode(postalCode: string): Observable<LocationData[]> {
    if (!postalCode) return of([]);

    const storageKey = `location_postalCode_${postalCode}`;
    const storedData = this.loadFromSessionStorage<LocationData[]>(storageKey);
    if (storedData) {
      return of(storedData);
    }

    // Si no hay conexión, usar fallback y guardar en sessionStorage
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const fallback = this.getFallback(postalCode);
      this.saveToSessionStorage(storageKey, fallback);
      return of(fallback);
    }

    const url = `${this.ZIPPOPOTAM_API_URL}${postalCode}`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const data = res?.places ? res.places.map((p: any) => ({ postalCode: res['post code'], locality: p['place name'], province: p['state'], latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) })) : this.getFallback(postalCode);
        this.saveToSessionStorage(storageKey, data);
        return data;
      }),
      catchError(() => {
        const fallback = this.getFallback(postalCode);
        this.saveToSessionStorage(storageKey, fallback);
        return of(fallback);
      })
    );
  }

  searchByLocality(locality: string): Observable<LocationData[]> {
    if (!locality || locality.length < 3) return of([]);

    const storageKey = `location_locality_${locality}`;
    const storedData = this.loadFromSessionStorage<LocationData[]>(storageKey);
    if (storedData) {
      return of(storedData);
    }

    // Si no hay conexión, usar fallback y guardar en sessionStorage
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const fallback = this.getFallback(locality);
      this.saveToSessionStorage(storageKey, fallback);
      return of(fallback);
    }

    const url = `${this.GEOREF_API_URL}/localidades?nombre=${encodeURIComponent(locality)}&campos=id,nombre,provincia,centroide&max=15`;
    return this.http.get<any>(url).pipe(
      switchMap(res => {
        if (!res || !res.localidades || res.localidades.length === 0) {
          const fallback = this.getFallback(locality);
          this.saveToSessionStorage(storageKey, fallback);
          return of(fallback);
        }
        const reqs = res.localidades.map((loc: any) => 
          this.http.get<GeorefCpResponse>(`${this.GEOREF_API_URL}/codigos-postales?localidad_censal_id=${loc.id}`).pipe(catchError(() => of({ codigos_postales: [] })))
        );
        return forkJoin<GeorefCpResponse[]>(reqs).pipe(
          map((cpResponses) => {
            const data = res.localidades.map((loc: any, index: number): LocationData => {
              const cpRes = cpResponses[index];
              return {
                postalCode: cpRes.codigos_postales.length > 0 ? cpRes.codigos_postales[0].codigo_postal : '',
                locality: loc.nombre,
                province: loc.provincia.nombre,
                latitude: loc.centroide.lat,
                longitude: loc.centroide.lon
              };
            }).filter((l: LocationData) => l.postalCode);
            this.saveToSessionStorage(storageKey, data);
            return data;
          })
        );
      }),
      catchError(() => {
        const fallback = this.getFallback(locality);
        this.saveToSessionStorage(storageKey, fallback);
        return of(fallback);
      })
    );
  }

  searchByCoordinates(lat: number, lon: number): Observable<LocationData[]> {
    const storageKey = `location_coords_${lat}_${lon}`;
    const storedData = this.loadFromSessionStorage<LocationData[]>(storageKey);
    if (storedData) {
      return of(storedData);
    }

    const url = `${this.GEONAMES_API_URL}?lat=${lat}&lng=${lon}&username=${this.GEONAMES_USERNAME}&radius=10&maxRows=10`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const data = res?.postalCodes ? res.postalCodes.map((p: any) => ({ postalCode: p.postalCode, locality: p.placeName, province: p.adminName1, latitude: p.lat, longitude: p.lng })) : [];
        this.saveToSessionStorage(storageKey, data);
        return data;
      }),
      catchError(() => of([]))
    );
  }

  private getFallback(query: string): LocationData[] {
    const q = query.toLowerCase();
    return this.fallbackData.filter(loc => loc.postalCode.toLowerCase().includes(q) || loc.locality.toLowerCase().includes(q));
  }

  private sortLocationsByDistance(locations: LocationData[], lat: number, lon: number): LocationData[] {
    return locations.sort((a, b) => {
      const distA = this.calculateDistance(lat, lon, a.latitude, a.longitude);
      const distB = this.calculateDistance(lat, lon, b.latitude, b.longitude);
      return distA - distB;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2?: number, lon2?: number): number {
    if (lat2 === undefined || lon2 === undefined) return Infinity;
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
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
}
