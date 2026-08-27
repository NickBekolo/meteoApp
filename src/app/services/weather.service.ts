import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Weather } from '../models/weather.model';

/**
 * STUB — Service d'accès à l'API OpenWeather.
 *
 * ⚠️ À IMPLÉMENTER par le membre en charge de l'API. Squelette fourni par le
 * périmètre architecture pour figer le contrat :
 *   - HttpClient est déjà injecté (provideHttpClient dans app.config.ts)
 *   - la clé et l'URL de base viennent de `environment` (jamais en dur)
 *   - `getCurrentWeather` doit renvoyer un Observable<Weather> (modèle domaine),
 *     donc convertir la réponse brute (Kelvin) en °C, ex. via `units=metric`
 *   - gérer les erreurs (404 ville introuvable, 429 trop de requêtes, ...)
 *
 * Les composants n'appellent JAMAIS l'API directement : ils passent par ce service.
 */
@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly apiKey = environment.apiKey;

  getCurrentWeather(city: string): Observable<Weather> {
    // TODO (membre API) : http.get<OpenWeatherResponse>(...) puis map -> Weather
    throw new Error(
      'WeatherService.getCurrentWeather() non implémenté (membre API).',
    );
  }
}
