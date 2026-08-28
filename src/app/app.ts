import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

/**
 * Composant racine : affiche la barre de navigation puis la page active
 * (rendue par <router-outlet> en fonction de la route courante).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'MétéoApp';
}
