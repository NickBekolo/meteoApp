# 🌤️ MétéoApp

Application web Angular permettant de rechercher la météo actuelle d'une ville
via l'API REST **OpenWeather**. Projet de groupe — module « Angular et
communication vers une API ».

---

## 📖 Présentation

MétéoApp permet à l'utilisateur de saisir le nom d'une ville et d'afficher sa
météo en temps réel (température, ressenti, humidité, vent, description, icône).
L'application met en pratique : composants Angular, formulaires, routing,
services, communication entre composants, appels HTTP vers une API REST et
gestion des erreurs / du chargement.

## 👥 Membres du groupe

| Membre | Périmètre |
| --- | --- |
| **Nikola MILOSAVLJEVIC** | Setup, routing & architecture |
| **Nick BEKOLO** | Service météo & API OpenWeather |
| **Leroy MONTHE** | Formulaire de recherche |
| **Rayan Degane** | Affichage météo & fonctionnalité libre |

> _À vérifier : l'attribution des rôles de chaque membre._

## 🛠️ Technologies

- **Angular 20** (composants standalone, signals, routing)
- **TypeScript**
- **HTML / CSS**
- **OpenWeather API** (REST / JSON)
- **Postman** (test et documentation des requêtes)

---

## 🚀 Installation

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

## 🔑 Configuration de la clé API

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
- ⚠️ Une clé récente peut mettre **jusqu'à 2 h** à s'activer (erreur `401` en attendant).
- Le fichier `src/environments/environment.ts` est listé dans `.gitignore` :
  la clé réelle du groupe n'apparaît donc jamais dans le dépôt.

---

## ✅ Fonctionnalités obligatoires

- [x] Routing : `/home`, `/weather/:city`, `/about`
- [x] Page d'accueil avec formulaire de recherche
- [x] Récupération de la ville via le paramètre de route (`ActivatedRoute`)
- [ ] Formulaire de recherche (Reactive Forms + validation) — _membre recherche_
- [ ] Service Angular + appel HttpClient vers OpenWeather — _membre API_
- [ ] Affichage météo (°C, ressenti, humidité, vent, icône) — _membre affichage_
- [ ] Gestion du chargement et des erreurs (vide / 404 / 429 / API) — _membre API_

> _Cocher au fur et à mesure de l'avancement._

## ✨ Fonctionnalité supplémentaire

> _À compléter : décrire la fonctionnalité libre choisie (ex. prévisions à
> 5 jours via l'endpoint `/forecast`)._

## 🏗️ Architecture

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

## 🌐 API

> _À compléter par le membre API : endpoints utilisés (`/weather`,
> éventuellement `/forecast`), paramètres (`q`, `appid`, `units`, `lang`),
> données récupérées et format JSON._

## 📮 Postman

> _À compléter : comment importer et utiliser la collection Postman
> (variables `{{base_url}}`, `{{api_key}}`, `{{city}}`)._

## 🧩 Difficultés rencontrées

> _À compléter : au moins deux difficultés et leur résolution._

## 🔧 Améliorations possibles

> _À compléter : ce que l'équipe aurait voulu améliorer avec plus de temps._
