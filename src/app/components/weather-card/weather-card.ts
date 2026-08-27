import { Component, input } from '@angular/core';

/**
 * STUB — Affichage de la météo d'une ville.
 *
 * ⚠️ À COMPLÉTER par les membres en charge du service et de l'affichage :
 *   - injecter WeatherService
 *   - déclencher l'appel API à partir de `city()`
 *   - gérer les états : chargement / erreur / succès
 *   - afficher : ville, pays, température (°C), ressenti, description,
 *     humidité, vitesse du vent, icône météo
 *
 * Contrat d'entrée figé (côté routing) : la ville arrive via l'@Input `city`,
 * elle-même issue du paramètre de route de la page /weather/:city.
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
}
