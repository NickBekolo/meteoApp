import { Component, output } from '@angular/core';

/**
 * STUB — Composant de recherche.
 *
 * ⚠️ À REMPLACER par le membre en charge du formulaire :
 *   - Reactive Forms (FormControl / FormGroup)
 *   - champ ville OBLIGATOIRE (Validators.required)
 *   - message d'erreur "Veuillez saisir une ville." si vide
 *
 * Le contrat avec la page reste le même : ce composant ÉMET la ville saisie
 * via l'@Output `searchCity`. La navigation est gérée par la page /home.
 */
@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  /** Émet la ville validée par l'utilisateur. */
  searchCity = output<string>();

  submit(value: string): void {
    this.searchCity.emit(value);
  }
}
