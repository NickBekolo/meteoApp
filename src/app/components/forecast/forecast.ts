import { Component, effect, inject, input } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

/**
 * Fonctionnalité libre : prévisions sur 5 jours.
 *
 * Reçoit la ville via l'@Input `city` (même contrat que la weather-card) et
 * délègue l'appel au WeatherService (2e endpoint /forecast). L'affichage réagit
 * aux signals `forecast`, `forecastLoading`, `forecastError`.
 */
@Component({
  selector: 'app-forecast',
  imports: [],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast {
  /** Ville à prévoir (transmise par la page /weather/:city). */
  city = input<string>('');

  private weatherService = inject(WeatherService);

  readonly days = this.weatherService.forecast;
  readonly isLoading = this.weatherService.forecastLoading;
  readonly error = this.weatherService.forecastError;

  constructor() {
    effect(() => {
      const currentCity = this.city();
      if (currentCity) {
        this.weatherService.loadForecast(currentCity);
      }
    });
  }
}
