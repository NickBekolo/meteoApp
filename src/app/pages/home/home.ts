import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Search } from '../../components/search/search';
import { FavoritesService } from '../../services/favorites.service';

/**
 * Page d'accueil : présente l'application, héberge le formulaire de recherche
 * et affiche les villes favorites (persistées dans le localStorage).
 * À la validation d'une ville, on NAVIGUE vers /weather/:city.
 */
@Component({
  selector: 'app-home',
  imports: [Search],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  /** Villes favorites (réactif). */
  readonly favorites = this.favoritesService.favorites;

  /** Reçoit la ville émise par le composant de recherche (@Output). */
  onSearch(city: string): void {
    this.openCity(city);
  }

  openCity(city: string): void {
    const trimmed = city.trim();
    if (trimmed) {
      this.router.navigate(['/weather', trimmed]);
    }
  }

  removeFavorite(city: string, event: Event): void {
    event.stopPropagation();
    this.favoritesService.remove(city);
  }
}
