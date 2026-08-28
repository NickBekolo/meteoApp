# MétéoApp

Application web Angular permettant de rechercher la météo actuelle d'une ville
via l'API REST **OpenWeather**. Projet de groupe — module « Angular et
communication vers une API ».

---

## Présentation

MétéoApp permet à l'utilisateur de saisir le nom d'une ville et d'afficher sa
météo en temps réel (température, ressenti, humidité, vent, description, icône).
L'application met en pratique : composants Angular, formulaires, routing,
services, communication entre composants, appels HTTP vers une API REST et
gestion des erreurs / du chargement.

## Membres du groupe

| Membre | Périmètre |
| --- | --- |
| **Nikola MILOSAVLJEVIC** | Setup, routing & architecture |
| **Leroy MONTHE** | Service API & gestion d'état |
| **Nick BEKOLO** | Formulaire, affichage météo & erreurs |
| **Rayan Degane** | Fonctionnalité libre, Postman & README |

## Technologies

- **Angular 20** (composants standalone, signals, routing)
- **TypeScript**
- **HTML / CSS**
- **OpenWeather API** (REST / JSON)
- **Postman** (test et documentation des requêtes)

---

## Installation

Prérequis : **Node.js** et **npm** installés.

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la clé API (voir section suivante)

# 3. Lancer le serveur de développement
npm start
# ou : npx ng serve
```

L'application est ensuite disponible sur http://localhost:4200.

## Configuration de la clé API

La clé API OpenWeather **n'est jamais versionnée dans Git**. Chaque membre
configure sa propre clé en local :

```bash
# Copier le modèle versionné vers le fichier local (ignoré par Git)
cp src/environments/environment.example.ts src/environments/environment.ts
```

Puis, dans `src/environments/environment.ts`, remplacer la valeur de `apiKey`
par votre clé personnelle :

```ts
export const environment = {
  production: false,
  apiKey: 'VOTRE_CLE_API_OPENWEATHER', // <-- votre clé ici
  apiBaseUrl: 'https://api.openweathermap.org/data/2.5',
};
```

- Obtenez une clé gratuite sur https://openweathermap.org/api (onglet _API keys_).
- Une clé récente peut mettre **jusqu'à 2 h** à s'activer (erreur `401` en attendant).
- Le fichier `src/environments/environment.ts` est listé dans `.gitignore` :
  la clé réelle du groupe n'apparaît donc jamais dans le dépôt.

---

## Fonctionnalité principale

- Recherche d'une ville via un formulaire (Reactive Forms, champ obligatoire)
- Routing : `/home`, `/weather/:city`, `/about`
- Récupération de la ville depuis le paramètre de route (`ActivatedRoute`)
- Appel à l'API OpenWeather via un service Angular (`HttpClient`)
- Affichage de la météo : ville, pays, température (°C), ressenti, description,
  humidité, vent, icône
- Gestion du chargement et des erreurs (ville introuvable, erreur API, 429)

## Architecture

Composants **standalone**, séparation nette des responsabilités :

```
src/
├── environments/
│   ├── environment.example.ts   # modèle versionné (sans clé réelle)
│   └── environment.ts           # clé locale — IGNORÉ par Git
└── app/
    ├── app.ts / app.html        # composant racine (navbar + router-outlet)
    ├── app.routes.ts            # table de routage (/home, /weather/:city, /about)
    ├── app.config.ts            # providers (router, HttpClient)
    ├── models/
    │   └── weather.model.ts     # contrat de données partagé (Weather)
    ├── services/
    │   └── weather.service.ts   # accès API OpenWeather (HttpClient)
    ├── components/
    │   ├── navbar/              # navigation
    │   ├── search/             # formulaire de recherche (émet la ville)
    │   └── weather-card/       # affichage météo (reçoit la ville en @Input)
    └── pages/
        ├── home/               # accueil + formulaire
        ├── weather/            # /weather/:city — lit le param de route
        └── about/              # infos groupe & technos
```

**Flux de données :**

```
Formulaire (search) --(@Output ville)--> Home --(router.navigate)-->
  /weather/:city --(ActivatedRoute)--> WeatherPage --(@Input city)-->
    WeatherCard --> WeatherService --HTTP GET--> OpenWeather API
```

La ville transite **par l'URL** (paramètre de route) plutôt que par une
variable de composant : la page météo est ainsi partageable / rechargeable, et
chaque responsabilité (saisie / affichage d'une ressource / page statique) est
isolée sur sa propre route.
