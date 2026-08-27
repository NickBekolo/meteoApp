/**
 * MODÈLE de configuration — fichier VERSIONNÉ dans Git (sans clé réelle).
 *
 * Pour lancer le projet :
 *   1. Copier ce fichier :   cp src/environments/environment.example.ts src/environments/environment.ts
 *   2. Remplacer la valeur de `apiKey` par votre propre clé OpenWeather.
 *
 * Le fichier `environment.ts` réel est ignoré par Git (voir .gitignore) :
 * la clé API du groupe n'est donc jamais poussée sur le dépôt.
 */
export const environment = {
  production: false,
  // Clé API OpenWeather — obtenue sur https://openweathermap.org/api (onglet "API keys")
  apiKey: 'VOTRE_CLE_API_OPENWEATHER',
  // Endpoint de base de l'API OpenWeather
  apiBaseUrl: 'https://api.openweathermap.org/data/2.5',
};
