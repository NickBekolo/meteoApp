import { Component } from '@angular/core';

interface Member {
  name: string;
  role: string;
}

interface Tech {
  name: string;
  usage: string;
}

/**
 * Page statique /about : présentation de l'application, membres du groupe
 * et technologies utilisées.
 */
@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  // TODO (équipe) : compléter les noms + rôles des 3 autres membres.
  members: Member[] = [
    { name: 'Nikola MILOSAVLJEVIC', role: 'Setup, routing & architecture' },
    { name: 'Membre 2', role: 'Formulaire de recherche' },
    { name: 'Membre 3', role: 'Service météo & API OpenWeather' },
    { name: 'Membre 4', role: 'Affichage météo & fonctionnalité libre' },
  ];

  technologies: Tech[] = [
    { name: 'Angular 20', usage: 'Framework front (composants standalone, signals, routing)' },
    { name: 'TypeScript', usage: 'Langage typé de l\'application' },
    { name: 'HTML / CSS', usage: 'Structure et style des interfaces' },
    { name: 'OpenWeather API', usage: 'Source des données météo (REST / JSON)' },
    { name: 'Postman', usage: 'Test et documentation des requêtes API' },
  ];
}
