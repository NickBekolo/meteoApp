import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WeatherCard } from '../../components/weather-card/weather-card';
import { Forecast } from '../../components/forecast/forecast';
import { FavoritesService } from '../../services/favorites.service';

/**
 * Page /weather/:city.
 *
 * Responsabilité (périmètre routing/architecture) : récupérer la ville depuis
 * le PARAMÈTRE DE ROUTE via ActivatedRoute, puis la transmettre aux composants
 * d'affichage (@Input `city`) : la météo actuelle et les prévisions 5 jours.
 * Gère aussi l'ajout/retrait de la ville aux favoris.
 */
@Component({
  selector: 'app-weather-page',
  imports: [WeatherCard, Forecast, RouterLink],
  templateUrl: './weather-page.html',
  styleUrl: './weather-page.css',
})
export class WeatherPage {
  private route = inject(ActivatedRoute);
  private favorites = inject(FavoritesService);

  /** Ville extraite du paramètre de route `:city`. */
  readonly city = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('city') ?? '')),
    { initialValue: '' },
  );

  /** Vrai si la ville courante est dans les favoris (réactif). */
  readonly isFavorite = computed(() => this.favorites.isFavorite(this.city()));

  toggleFavorite(): void {
    const currentCity = this.city();
    if (currentCity) {
      this.favorites.toggle(currentCity);
    }
  }
}
