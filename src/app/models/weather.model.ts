/**
 * Contrat de données partagé de l'application (couche "architecture").
 *
 * - `Weather` est le modèle DOMAINE utilisé par les composants d'affichage :
 *   déjà nettoyé, en °C, prêt à afficher.
 * - `OpenWeatherResponse` décrit (partiellement) la réponse BRUTE de l'API.
 *
 * Le WeatherService (implémenté par le membre en charge de l'API) est
 * responsable de transformer `OpenWeatherResponse` -> `Weather`.
 * Les composants ne manipulent QUE le modèle `Weather`.
 */

/** Modèle domaine consommé par les composants d'affichage. */
export interface Weather {
  city: string;
  country: string;
  /** Température actuelle, en °C. */
  temp: number;
  /** Température ressentie, en °C. */
  feelsLike: number;
  /** Description météo (ex. "ciel dégagé"). */
  description: string;
  /** Humidité, en %. */
  humidity: number;
  /** Vitesse du vent, en km/h. */
  windSpeed: number;
  /** Code d'icône OpenWeather (ex. "04d"). */
  icon: string;
}

/** Réponse brute (partielle) de l'endpoint /weather d'OpenWeather. */
export interface OpenWeatherResponse {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}
