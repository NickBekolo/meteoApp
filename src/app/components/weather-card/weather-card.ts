import { Component, computed, inject, input, effect } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

/** Catégorie d'erreur, utilisée uniquement pour un style visuel différencié. */
type ErrorKind = 'not-found' | 'rate-limit' | 'generic';

/**
 * Affichage de la météo d'une ville.
 *
 * Contrat d'entrée (fixé côté routing) : la ville arrive via l'@Input `city`
 * (signal `input()`), elle-même issue du paramètre de route de la page
 * /weather/:city — voir WeatherPage.
 *
 * Le composant ne fait AUCUN appel HTTP lui-même : il délègue entièrement au
 * WeatherService (state géré par signals : `weather`, `isLoading`,
 * `errorMessage`) et se contente d'afficher l'état courant. Un `effect()`
 * relance le chargement à chaque changement de `city()`, y compris quand on
 * navigue de /weather/Paris vers /weather/Lille sans quitter la page.
 */
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

  /**
   * Catégorie de l'erreur courante, dérivée du message renvoyé par le
   * service. Permet d'appliquer une classe CSS différente selon le cas
   * (ville introuvable / trop de requêtes / erreur générique) sans dupliquer
   * de logique métier dans le composant : le WeatherService reste la seule
   * source de vérité sur le contenu des messages.
   */
  readonly errorKind = computed<ErrorKind | null>(() => {
    const message = this.errorMessage();
    if (!message) {
      return null;
    }
    if (message === 'Ville introuvable.') {
      return 'not-found';
    }
    if (message.startsWith('Trop de requêtes')) {
      return 'rate-limit';
    }
    return 'generic';
  });

  constructor() {
    // Dès que `city` change (nouvelle URL ou premier chargement), on relance
    // l'appel. Le service gère lui-même le cache et l'anti-doublon.
    effect(() => {
      const currentCity = this.city();
      if (currentCity) {
        this.weatherService.loadCurrentWeather(currentCity);
      }
    });
  }
}
