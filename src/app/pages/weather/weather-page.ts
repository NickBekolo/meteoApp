import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WeatherCard } from '../../components/weather-card/weather-card';

/**
 * Page /weather/:city.
 *
 * Responsabilité (périmètre routing/architecture) : récupérer la ville depuis
 * le PARAMÈTRE DE ROUTE via ActivatedRoute, puis la transmettre au composant
 * d'affichage (@Input `city`).
 *
 * On lit `paramMap` en tant qu'observable pour rester réactif : si l'URL passe
 * de /weather/Paris à /weather/Lille sans quitter la page, la valeur se met à
 * jour toute seule. On l'expose en signal (toSignal) pour un template simple.
 */
@Component({
  selector: 'app-weather-page',
  imports: [WeatherCard, RouterLink],
  templateUrl: './weather-page.html',
  styleUrl: './weather-page.css',
})
export class WeatherPage {
  private route = inject(ActivatedRoute);

  /** Ville extraite du paramètre de route `:city`. */
  readonly city = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('city') ?? '')),
    { initialValue: '' },
  );
}
