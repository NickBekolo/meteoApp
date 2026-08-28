import { Component, inject, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

/**
 * Valide que le champ contient au moins un caractère non-blanc (un champ
 * rempli uniquement d'espaces doit être traité comme vide).
 */
function requiredTrimmed(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '').toString().trim();
  return value.length > 0 ? null : { required: true };
}

/**
 * Composant de recherche — formulaire Angular en Reactive Forms.
 *
 * Le champ ville est obligatoire (y compris s'il ne contient que des
 * espaces) : tant qu'il est invalide et que l'utilisateur y a touché (ou a
 * tenté de soumettre), le message "Veuillez saisir une ville." est affiché.
 *
 * Contrat avec la page hôte : ce composant n'effectue AUCUNE navigation
 * lui-même — il se contente d'ÉMETTRE la ville validée via l'@Output
 * `searchCity`. C'est la page /home qui décide de naviguer vers
 * /weather/:city (séparation recherche / routing).
 */
@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private fb = inject(FormBuilder);

  /** Émet la ville validée par l'utilisateur (espaces superflus retirés). */
  searchCity = output<string>();

  readonly form = this.fb.nonNullable.group({
    city: ['', [Validators.required, requiredTrimmed]],
  });

  get cityControl() {
    return this.form.controls.city;
  }

  /** Vrai si le message d'erreur doit être affiché dans le template. */
  get showError(): boolean {
    return this.cityControl.invalid && (this.cityControl.touched || this.cityControl.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      // Permet d'afficher l'erreur même si l'utilisateur soumet directement
      // (ex. touche Entrée) sans avoir "touché" le champ au préalable.
      this.form.markAllAsTouched();
      return;
    }

    const city = this.form.getRawValue().city.trim();
    this.searchCity.emit(city);
    this.form.reset();
  }
}
