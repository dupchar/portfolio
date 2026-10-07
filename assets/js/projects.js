/*
  Liste des projets du site.

  - category : "phantom", "motion" (motion control) ou "autres"  → page où le projet apparaît
  - tag      : petite étiquette affichée (Pub, Clip, Fiction, Mode, Émission...)
  - type     : "youtube" (id = identifiant YouTube) ou "file" (vidéo dans /assets/video/portfolio/)
  - La vignette doit exister sous /assets/img/videos/<id>.jpg
  - L'ordre dans la liste est l'ordre d'affichage. Mettre featured: true pour l'afficher dans la sélection de l'accueil.
*/
window.PROJECTS = [
  /* ---------------- PHANTOM ---------------- */
  { category: "phantom", tag: "Film", type: "file", id: "c115cc_c15d3a37d34f4ce5aeb502c7e5bbfb0b", file: "la-maison-noir-carte-blanche-numero-7-le-plongeur.mp4", title: "Le Plongeur", client: "La Maison Noir — Carte blanche n°7", duration: "00:49", featured: true },
  { category: "phantom", tag: "Beauté", type: "file", id: "c115cc_674c4051cc5d481cb31d70ca9533e5f5", file: "film-beauty-directed-by-juliette-allix.mp4", title: "Film Beauty — Juliette Allix", client: "Film beauté — réal. Juliette Allix", duration: "00:48", featured: true },
  { category: "phantom", tag: "Clip", type: "youtube", id: "aKJyRwJYJXI", title: "Home", client: "Darwin Experience", duration: "03:40", featured: true },
  { category: "phantom", tag: "Clip", type: "youtube", id: "5VFiI0cXKxo", title: "Humanoid", client: "Nox Oleander", duration: "04:42" },
  { category: "phantom", tag: "Fiction", type: "youtube", id: "dKGGSBZHdDU", title: "Challenger", client: "Bande-annonce — Alban Ivanov", duration: "01:52", featured: true },

  /* ---------------- MOTION CONTROL ---------------- */
  { category: "motion", tag: "Clip", type: "file", id: "c115cc_8e381ba8dc074edd9977580209b6e245", file: "angele-vl-instinct-2026-new-album-teaser.mp4", title: "Instinct", client: "Angèle — Teaser album 2026", duration: "00:37", featured: true },
  { category: "motion", tag: "Pub", type: "file", id: "c115cc_2923e0f4a92146c9939c90e7fe94c03a", file: "director-s-cut-new-product-dior.mp4", title: "Director's Cut", client: "Dior — New product", duration: "00:46" },
  { category: "motion", tag: "Pub", type: "file", id: "la-mer-spark-rejuvenation", file: "la-mer-spark-rejuvenation-oily-skin.mp4", title: "Spark Rejuvenation", client: "La Mer — The Balancing Collection", duration: "00:15" },
  { category: "motion", tag: "Pub", type: "file", id: "c115cc_5d691be4198c43ddbf0a7642efc6c195", file: "neyu-taupe-edition-polene.mp4", title: "Neyu — Taupe", client: "Polène", duration: "00:16", featured: true },
  { category: "motion", tag: "Pub", type: "file", id: "c115cc_bee492fea1c1476598f77144e1aee91f", file: "mokki-mini-camel-edition-polene.mp4", title: "Mokki Mini — Camel", client: "Polène", duration: "00:13", featured: true },
  { category: "motion", tag: "Pub", type: "file", id: "c115cc_4a686713847e460d9b3ee20138f74cdb", file: "numero-neuf-mini-chalk-edition-polene.mp4", title: "Numéro Neuf Mini — Chalk", client: "Polène", duration: "00:16", featured: true },
  { category: "motion", tag: "Pub", type: "file", id: "c115cc_217b91be065a4f4d9d83b84e65795854", file: "cyme-root-edition-polene.mp4", title: "Cyme — Root", client: "Polène", duration: "00:10", featured: true },
  { category: "motion", tag: "Clip", type: "youtube", id: "tOQX6ZwMHy0", title: "Idée noire", client: "Ava Baya", duration: "03:01" },
  { category: "motion", tag: "Clip", type: "youtube", id: "JLOe7eTH9Jg", title: "Plus 20 ans", client: "DA Uzi", duration: "02:49" },

  /* ---------------- AUTRES PROJETS ---------------- */
  { category: "autres", tag: "Mode", type: "file", id: "c115cc_033df484777a418e97db38d6a721c4ae", file: "lemaire-springsummer-2027-show-film-2.mp4", title: "SS27 Show — Film 2", client: "Lemaire", duration: "00:14" },
  { category: "autres", tag: "Mode", type: "file", id: "c115cc_247512dd9e6749ab866492dfeff4d1bb", file: "lemaire-springsummer-2027-show-film-1.mp4", title: "SS27 Show — Film 1", client: "Lemaire", duration: "00:15" },
  { category: "autres", tag: "Mode", type: "youtube", id: "CXzwDCb0W8Y", title: "SS26 Show — Director's Cut", client: "Lemaire", duration: "05:05", featured: true },
  { category: "autres", tag: "Mode", type: "youtube", id: "WDzEL8ibY9I", title: "FW25 Show", client: "Lemaire", duration: "04:59" },
  { category: "autres", tag: "Mode", type: "youtube", id: "yUFZZ-aNsp8", title: "SS24 Show", client: "Lemaire", duration: "03:51" },
  { category: "autres", tag: "Mode", type: "youtube", id: "zrDLEGp-NUo", title: "FW23/24 Full Show", client: "Lemaire", duration: "09:30" },
  { category: "autres", tag: "Mode", type: "youtube", id: "QgT1tGI7DE8", title: "SS23 Full Show", client: "Lemaire", duration: "04:14" },
  { category: "autres", tag: "Mode", type: "youtube", id: "ZjRMWGpLC9M", title: "SS22 Collection Film", client: "Lemaire", duration: "05:20" },
  { category: "autres", tag: "Clip", type: "youtube", id: "ptEpfpgYuwk", title: "PLMB ft. Tendry", client: "Ti-Yo", duration: "05:34" },
  { category: "autres", tag: "Clip", type: "youtube", id: "0mxTyMJkw2o", title: "Looking for You", client: "Elias Wallace", duration: "04:09" },
  { category: "autres", tag: "Clip", type: "youtube", id: "APeUJxtqz5c", title: "Bridges", client: "Elias Wallace", duration: "04:00" },
  { category: "autres", tag: "Clip", type: "youtube", id: "N61tKQ0i47o", title: "Somewhere", client: "Elias Wallace", duration: "03:45" },
  { category: "autres", tag: "Clip", type: "youtube", id: "_HDXzR3DBuo", title: "Heaven", client: "Elias Wallace", duration: "03:39" },
  { category: "autres", tag: "Clip", type: "youtube", id: "xIEQoXZudrI", title: "If I Could Love You", client: "Elias Wallace", duration: "03:51" },
  { category: "autres", tag: "Clip", type: "youtube", id: "u3_j-L_aVpI", title: "Pour Toi", client: "Bethléem Bâtiment C", duration: "04:14" },
  { category: "autres", tag: "Fiction", type: "youtube", id: "4iLA0AVhTL8", title: "Les Lendemains de veille", client: "Bande-annonce", duration: "01:27" },
  { category: "autres", tag: "Fiction", type: "youtube", id: "xWEUoDs3hyQ", title: "Une belle course", client: "Bande-annonce — Pathé", duration: "01:59" },
  { category: "autres", tag: "Fiction", type: "youtube", id: "v_a3wzdu98I", title: "Hybris", client: "Court métrage", duration: "09:10" },
  { category: "autres", tag: "Émission", type: "youtube", id: "5alyVQkXmfs", title: "Saint Artist — Ah-Young Son", client: "HEYA&CO", duration: "06:15" },
  { category: "autres", tag: "Émission", type: "youtube", id: "p7oPCrMeP5Q", title: "Saint Artist — Noémie Pons", client: "HEYA&CO", duration: "07:07" },
  { category: "autres", tag: "Live", type: "youtube", id: "h_kHLajm2eY", title: "Te donner — Live session", client: "Prisca Vua", duration: "16:25" },
  { category: "autres", tag: "Émission", type: "youtube", id: "Np5HUyQ3b1M", title: "Esdras — Interview", client: "HEYA&CO — A Glimpse of Heaven", duration: "04:37" },
  { category: "autres", tag: "Live", type: "youtube", id: "zSIV0QntpV0", title: "Esdras — Acquitté", client: "HEYA&CO — A Glimpse of Heaven", duration: "03:26" },
  { category: "autres", tag: "Émission", type: "youtube", id: "ng8P3dxsuIs", title: "Claudia Isaki — Interview", client: "HEYA&CO — A Glimpse of Heaven", duration: "07:12" },
  { category: "autres", tag: "Live", type: "youtube", id: "j9_A-V-ZGb8", title: "Claudia Isaki — Medley", client: "HEYA&CO — A Glimpse of Heaven", duration: "03:21" },
  { category: "autres", tag: "Émission", type: "youtube", id: "2NyA5l8n2Aw", title: "Ti-Yo — Interview", client: "HEYA&CO — A Glimpse of Heaven", duration: "06:36" },
  { category: "autres", tag: "Live", type: "youtube", id: "BYLOb_qC1-c", title: "Ti-Yo — TEC", client: "HEYA&CO — A Glimpse of Heaven", duration: "02:44" },
  { category: "autres", tag: "Pub", type: "youtube", id: "JSccrLdoam4", title: "Simone Pérèle II", client: "Simone Pérèle", duration: "01:05" },
  { category: "autres", tag: "Pub", type: "youtube", id: "rC0Ne6VpNIE", title: "Simone Pérèle I", client: "Simone Pérèle", duration: "00:22" },
];
