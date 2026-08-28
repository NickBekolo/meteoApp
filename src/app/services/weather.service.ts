import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Weather, OpenWeatherResponse } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly apiKey = environment.apiKey;

  // --- État partagé (signals) ---
  private weatherData = signal<Weather | null>(null);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  readonly weather = this.weatherData.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  // --- Cache simple pour éviter les appels redondants sur une même ville ---
  private cache = new Map<string, Weather>();

  /**
   * Récupère la météo actuelle d'une ville et met à jour l'état interne
   * (weather, isLoading, errorMessage). À appeler depuis les composants.
   */
  loadCurrentWeather(city: string): void {
    const key = city.trim().toLowerCase();

    if (!key) {
      this.error.set('Veuillez saisir une ville.');
      return;
    }

    if (this.cache.has(key)) {
      this.weatherData.set(this.cache.get(key)!);
      this.error.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.getCurrentWeather(key).subscribe({
      next: (weather) => {
        this.cache.set(key, weather);
        this.weatherData.set(weather);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.weatherData.set(null);
        this.loading.set(false);
      }
    });
  }

  /**
   * Appel brut à l'API OpenWeather, retourne le modèle domaine Weather.
   * units=metric => température directement en °C, vent en m/s (converti en km/h ci-dessous).
   */
  getCurrentWeather(city: string): Observable<Weather> {
    const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&units=metric&APPID=${this.apiKey}`;

    return this.http.get<OpenWeatherResponse>(url).pipe(
      map((res) => this.mapToWeather(res)),
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  private mapToWeather(res: OpenWeatherResponse): Weather {
    return {
      city: res.name,
      country: res.sys.country,
      temp: Math.round(res.main.temp),
      feelsLike: Math.round(res.main.feels_like),
      description: res.weather[0].description,
      humidity: res.main.humidity,
      windSpeed: Math.round(res.wind.speed * 3.6), // m/s -> km/h
      icon: res.weather[0].icon
    };
  }

  private handleError(err: HttpErrorResponse) {
    let message = 'Impossible de récupérer les données météo.';
    if (err.status === 404) {
      message = 'Ville introuvable.';
    } else if (err.status === 429) {
      message = 'Trop de requêtes, veuillez réessayer dans quelques instants.';
    }
    return throwError(() => new Error(message));
  }
}