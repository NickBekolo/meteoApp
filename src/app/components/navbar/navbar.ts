import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Barre de navigation présente sur toutes les pages.
 * Responsabilité : NAVIGATION uniquement (routing).
 */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
