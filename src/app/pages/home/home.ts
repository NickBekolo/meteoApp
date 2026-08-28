import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Search } from '../../components/search/search';

/**
 * Page d'accueil : présente l'application et héberge le formulaire de
 * recherche. À la validation d'une ville, on NAVIGUE vers /weather/:city
 * (la ville transite donc par l'URL).
 */
@Component({
  selector: 'app-home',
  imports: [Search],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);

  /** Reçoit la ville émise par le composant de recherche (@Output). */
  onSearch(city: string): void {
    const trimmed = city.trim();
    if (!trimmed) {
      return;
    }
    this.router.navigate(['/weather', trimmed]);
  }
}
