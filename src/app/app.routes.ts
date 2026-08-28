import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { WeatherPage } from './pages/weather/weather-page';
import { About } from './pages/about/about';

/**
 * Table de routage de l'application.
 *
 * - /home            : page d'accueil + formulaire de recherche
 * - /weather/:city   : météo d'une ville, la ville transite par l'URL
 *                      (paramètre de route lu via ActivatedRoute)
 * - /about           : page statique d'information
 */
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, title: 'Accueil — météo' },
  { path: 'weather/:city', component: WeatherPage, title: 'météo' },
  { path: 'about', component: About, title: 'À propos — météo' },
  // Toute route inconnue renvoie vers l'accueil.
  { path: '**', redirectTo: 'home' },
];
