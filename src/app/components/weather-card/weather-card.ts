import { Component, inject, input, effect } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-card',
  imports: [],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.css',
})
export class WeatherCard {
  /** Ville à afficher (transmise par la page /weather/:city). */
  city = input<string>('');

  private weatherService = inject(WeatherService);

  readonly weather = this.weatherService.weather;
  readonly isLoading = this.weatherService.isLoading;
  readonly errorMessage = this.weatherService.errorMessage;

  constructor() {
    // Dès que `city` change (nouvelle URL ou premier chargement), on relance l'appel.
    effect(() => {
      const currentCity = this.city();
      if (currentCity) {
        this.weatherService.loadCurrentWeather(currentCity);
      }
    });
  }
}