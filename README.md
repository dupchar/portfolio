# Portfolio Charles Dupont — version 2 (refonte)

Site statique HTML/CSS/JS, sans build. Animations : GSAP + ScrollTrigger + Lenis, copiés dans `assets/js/vendor/` (aucun CDN requis).

## Pages

```
index.html                  Accueil (nom, métiers, sections animées, sélection)
phantom/index.html          Projets Phantom
motion-control/index.html   Projets motion control
autres-projets/index.html   Tout le reste (clips, fiction, mode, émissions...)
404.html
portfolio/, contact/        Redirections des anciennes adresses
assets/css/style.css
assets/js/app.js            Animations, transitions, curseur, lecteur vidéo, listes de projets
assets/js/projects.js       ← LA LISTE DES PROJETS (seul fichier à modifier au quotidien)
assets/js/gear3d.js         Modèles 3D de la section « Le matériel que j'utilise » (Phantom Flex4K, Robot 3100 = Colossus, Robot 850 = Evo)
assets/img/videos/          Vignettes (nommées d'après l'identifiant de la vidéo)
assets/video/loops/         Courtes boucles vidéo des fonds (hero, catégories)
assets/video/portfolio/     Vidéos auto-hébergées des projets
```

Instagram et mail sont en bas de chaque page. Il n'y a plus de formulaire.

## Générer les pages

Les pages HTML sont produites par `~/Desktop/Site portfolio - outils/generer_pages.py` (en-tête et pied de page communs, chemins relatifs). Modifier ce script puis le relancer : les retouches faites à la main dans les `.html` seraient écrasées.

## En ligne (prévisualisation)

https://dupchar.github.io/portfolio/ — dépôt github.com/dupchar/portfolio. Mise à jour : `git add -A && git commit -m "..." && git push`. Sur github.io le site n'est pas référencé par les moteurs de recherche. Après une modification de CSS/JS, incrémenter `?v=N` dans les liens (cache navigateur).

## Prévisualiser en local

```bash
cd "Site portfolio"
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000. Double-cliquer sur `index.html` ne marchera pas, car les chemins partent de la racine du site.

## Classer / ajouter un projet

Tout se fait dans `assets/js/projects.js`. Chaque ligne correspond à un projet :

```js
{ category: "phantom", tag: "Pub", type: "youtube", id: "IDENTIFIANT", title: "Titre", client: "Marque", duration: "00:30" },
```

- `category` : `"phantom"`, `"motion"` ou `"autres"`. C'est la page où le projet apparaît.
- `tag` : étiquette libre (Pub, Clip, Mode...). Les filtres de chaque page sont créés automatiquement à partir des tags.
- `featured: true` : ajoute le projet à la « Sélection » de l'accueil.
- **YouTube** : `type: "youtube"`, `id` = identifiant de la vidéo. Enregistrer la vignette `https://i.ytimg.com/vi/IDENTIFIANT/maxresdefault.jpg` sous `assets/img/videos/IDENTIFIANT.jpg`.
- **Fichier vidéo** : `type: "file"`, `file: "nom.mp4"`. Déposer la vidéo dans `assets/video/portfolio/` et sa vignette sous `assets/img/videos/<id>.jpg`.

L'ordre des lignes est l'ordre d'affichage.

## Vidéos auto-hébergées

Les 10 vidéos récupérées depuis Wix (Polène, Dior, Lemaire SS27, Angèle, Le Plongeur, Film Beauty) sont dans `assets/video/portfolio/`. Le lecteur s'adapte automatiquement au format de chaque vidéo (verticale, 4:5, 4:3, 16:9).

## Mise en ligne

Envoyer **le contenu** du dossier sur l'hébergeur (racine du domaine ou sous-dossier : les chemins sont relatifs). Les anciennes adresses `/portfolio` et `/contact` redirigent vers `/autres-projets/` et vers le contact en bas de l'accueil.

## Section « Le matériel que j'utilise » (3D)

Modèles 3D au format glTF (`.glb`) placés dans `assets/models/` :
`phantom-flex4k.glb`, `colossus.glb` (Robot 3100), `evo.glb` (Robot 850), `evo-tripod.glb`.
Ils sont affichés par `assets/js/gear3d.js` (three.js + GLTFLoader, chargés seulement à l'approche de la section). Les robots animent leurs 6 axes en boucle. Si un fichier ne se charge pas, un modèle simplifié construit en code s'affiche à la place.

Les caractéristiques affichées (cadence, portée, charge, poids) sont dans `index.html`, section `data-gear`.

## Accessibilité

Si le visiteur a activé « réduire les animations » dans son système, le site s'affiche sans loader, sans défilement fluide et sans animations au scroll.
