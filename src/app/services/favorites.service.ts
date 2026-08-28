import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'meteo.favorites';

/**
 * Gestion des villes favorites, persistées dans le localStorage du navigateur.
 *
 * L'état est exposé en signal (`favorites`) pour que les composants se mettent
 * à jour automatiquement. Tous les accès au localStorage sont protégés par
 * try/catch (mode privé, quota, etc.).
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favoritesS = signal<string[]>(this.load());

  /** Liste réactive des villes favorites. */
  readonly favorites = this.favoritesS.asReadonly();

  isFavorite(city: string): boolean {
    const name = city.trim().toLowerCase();
    return this.favoritesS().some((c) => c.toLowerCase() === name);
  }

  /** Ajoute la ville si absente, la retire si déjà présente. */
  toggle(city: string): void {
    const name = city.trim();
    if (!name) {
      return;
    }
    const next = this.isFavorite(name)
      ? this.favoritesS().filter((c) => c.toLowerCase() !== name.toLowerCase())
      : [...this.favoritesS(), name];
    this.favoritesS.set(next);
    this.save(next);
  }

  remove(city: string): void {
    const name = city.trim().toLowerCase();
    const next = this.favoritesS().filter((c) => c.toLowerCase() !== name);
    this.favoritesS.set(next);
    this.save(next);
  }

  private load(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.filter((x): x is string => typeof x === 'string')
        : [];
    } catch {
      return [];
    }
  }

  private save(list: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* localStorage indisponible : on ignore silencieusement. */
    }
  }
}
