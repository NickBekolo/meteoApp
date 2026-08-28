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

/**
 * Prévision AGRÉGÉE pour une journée (fonctionnalité libre — prévisions 5 jours).
 * Construite à partir des relevés 3h de l'endpoint /forecast.
 */
export interface DailyForecast {
  /** Date ISO (ex. "2026-08-28"). */
  date: string;
  /** Libellé affiché (ex. "Jeu 28"). */
  label: string;
  /** Température minimale du jour, en °C. */
  tempMin: number;
  /** Température maximale du jour, en °C. */
  tempMax: number;
  /** Code d'icône représentatif du jour (relevé de midi). */
  icon: string;
  /** Description météo représentative du jour. */
  description: string;
}

/** Réponse brute (partielle) de l'endpoint /forecast (relevés 3h sur 5 jours). */
export interface OpenWeatherForecastResponse {
  city: { name: string; country: string };
  list: {
    dt: number;
    dt_txt: string;
    main: { temp: number; temp_min: number; temp_max: number };
    weather: { description: string; icon: string }[];
  }[];
}
