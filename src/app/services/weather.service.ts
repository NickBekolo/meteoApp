import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Weather,
  OpenWeatherResponse,
  DailyForecast,
  OpenWeatherForecastResponse,
} from '../models/weather.model';

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

  // --- Prévisions 5 jours (fonctionnalité libre, 2e endpoint /forecast) ---
  private forecastData = signal<DailyForecast[] | null>(null);
  private forecastLoadingS = signal<boolean>(false);
  private forecastErrorS = signal<string | null>(null);

  readonly forecast = this.forecastData.asReadonly();
  readonly forecastLoading = this.forecastLoadingS.asReadonly();
  readonly forecastError = this.forecastErrorS.asReadonly();

  private forecastCache = new Map<string, DailyForecast[]>();

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

  /**
   * Charge les prévisions 5 jours d'une ville et met à jour l'état
   * (forecast, forecastLoading, forecastError). Utilise un cache dédié.
   */
  loadForecast(city: string): void {
    const key = city.trim().toLowerCase();
    if (!key) {
      return;
    }

    if (this.forecastCache.has(key)) {
      this.forecastData.set(this.forecastCache.get(key)!);
      this.forecastErrorS.set(null);
      return;
    }

    this.forecastLoadingS.set(true);
    this.forecastErrorS.set(null);

    this.getForecast(key).subscribe({
      next: (days) => {
        this.forecastCache.set(key, days);
        this.forecastData.set(days);
        this.forecastLoadingS.set(false);
      },
      error: (err: Error) => {
        this.forecastErrorS.set(err.message);
        this.forecastData.set(null);
        this.forecastLoadingS.set(false);
      },
    });
  }

  /**
   * Appel brut à l'endpoint /forecast (relevés toutes les 3h) puis agrégation
   * en une prévision par jour (min/max + icône représentative de midi).
   */
  getForecast(city: string): Observable<DailyForecast[]> {
    const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&units=metric&APPID=${this.apiKey}`;

    return this.http.get<OpenWeatherForecastResponse>(url).pipe(
      map((res) => this.mapToDailyForecast(res)),
      catchError((err: HttpErrorResponse) => this.handleError(err)),
    );
  }

  /** Regroupe les relevés 3h par jour et calcule min/max + icône de midi. */
  private mapToDailyForecast(res: OpenWeatherForecastResponse): DailyForecast[] {
    const byDate = new Map<string, OpenWeatherForecastResponse['list']>();

    for (const item of res.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!byDate.has(date)) {
        byDate.set(date, []);
      }
      byDate.get(date)!.push(item);
    }

    const days: DailyForecast[] = [];
    for (const [date, items] of byDate) {
      let tempMin = Infinity;
      let tempMax = -Infinity;
      for (const it of items) {
        tempMin = Math.min(tempMin, it.main.temp_min);
        tempMax = Math.max(tempMax, it.main.temp_max);
      }

      // Relevé représentatif : celui le plus proche de midi.
      const midday = items.reduce((best, it) => {
        const h = new Date(it.dt * 1000).getHours();
        const bh = new Date(best.dt * 1000).getHours();
        return Math.abs(h - 12) < Math.abs(bh - 12) ? it : best;
      }, items[0]);

      days.push({
        date,
        label: this.formatDayLabel(date),
        tempMin: Math.round(tempMin),
        tempMax: Math.round(tempMax),
        icon: midday.weather[0].icon,
        description: midday.weather[0].description,
      });
    }

    return days.slice(0, 5);
  }

  /** "2026-08-28" -> "Jeu 28". */
  private formatDayLabel(date: string): string {
    const d = new Date(date + 'T12:00:00');
    const label = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
    }).format(d);
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}