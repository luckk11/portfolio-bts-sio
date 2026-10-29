# Portfolio BTS SIO — Luc Zhang

Contexte de travail pour toute session Claude Code sur ce dépôt.
Lis ce fichier avant de modifier quoi que ce soit.

---

## 1. Le projet

Portfolio d'un étudiant en **2ᵉ année de BTS SIO option SLAM** à l'ENC Bessières (Paris 17ᵉ).
Il sert de support à l'**épreuve E5**, dont le tableau de synthèse porte l'adresse du site en en-tête.

- **Échéance : 2 novembre 2026.**
- Dépôt : `https://github.com/luckk11/portfolio-bts-sio` — public.
- Hébergement : GitHub Pages, adresse `https://luckk11.github.io/portfolio-bts-sio/`.
- Site **statique**, écrit à la main : aucun framework, aucun générateur, aucune dépendance npm.
- Seule ressource externe : les polices Google Fonts.

Public visé, par ordre de priorité : le jury BTS, les entreprises pour un stage ou une alternance de 2ᵉ année, les écoles post-BTS.

---

## 2. Structure

```
index.html          Accueil — autosuffisant, reprend l'essentiel de tout le site
profil.html         Parcours, carte d'identité, cap, langues
bts-sio.html        Le diplôme, les options, le programme, les épreuves
competences.html    Référentiel, technologies, preuves
stage-1.html        ZENG Expertise — effectué
stage-2.html        À venir — coquille structurée
projets.html        Crypto Analyser + autres réalisations
veille.html         IA et données personnelles
certifications.html MOOC ANSSI, freeCodeCamp, PIX
contact.html        Formulaire + coordonnées
a-propos.html       Comment le site est construit
mentions-legales.html  Éditeur, hébergement, données personnelles
plan-du-site.html   Toutes les pages et leur contenu

assets/css/style.css   toute la mise en forme
assets/js/main.js      thème, menu, sous-menu, animations, formulaire
assets/img/            logo Zeng, captures du projet, illustrations SVG de la veille
assets/docs/           CV, rapport de stage, attestation

_outils/propager.py    recopie header + footer depuis index.html vers les autres pages
_outils/verifier.py    contrôle liens morts, alt manquants, balises, poids des images
```

Toutes les pages prévues existent. **Version anglaise abandonnée** (décision du 29 octobre 2026) : le bouton EN a été retiré du header et `index-en.html` n'est plus planifiée. Elle ne serait reprise qu'après l'échéance ; une page anglaise isolée, reliée à un site français, nuit plus qu'elle ne sert.

Reste à faire : les champs `.todo` (voir §5) et les photos de justificatifs des certifications, mises de côté sur la branche locale `certifs-justificatifs`.

---

## 3. Les deux scripts — à utiliser systématiquement

**`python3 _outils/propager.py`**
`index.html` est la **source de vérité** du header et du footer. Ils sont délimités par des marqueurs :

```html
<!-- #header --> … <!-- /#header -->
<!-- #footer --> … <!-- /#footer -->
```

Toute modification du menu se fait dans `index.html`, puis on lance le script : il recopie les blocs dans les autres pages, remplace `href="#top"` par `href="index.html"` et pose `aria-current="page"` sur la bonne entrée.
**Ne jamais modifier un header à la main dans une page interne** : la prochaine propagation l'écrasera.

**`python3 _outils/verifier.py`**
À lancer avant chaque commit. Il signale liens cassés, images sans `alt`, balises déséquilibrées, `h1` en double, identifiants dupliqués, images de plus de 400 ko, et compte les champs restant à compléter. Il distingue les pages planifiées mais non écrites des vraies erreurs.

---

## 4. Direction artistique — non négociable

Palette **échantillonnée** sur une référence visuelle, définie en variables CSS dans `style.css` :

| Variable | Clair | Rôle |
|---|---|---|
| `--deep` | `#183FBA` | couleur signature — titres, boutons, liens. Contraste 8,5:1 |
| `--vivid` | `#4776F5` | haut du dégradé, aplats. **Interdit pour le texte** (4,1:1) |
| `--pale` | `#AECBF5` | formes pleines, texte sur fond bleu |
| `--faint` | `#D8E3FC` | lignes de grille |
| `--surf` | `#F0F4FE` | pastilles, boutons secondaires |
| `--ink` | `#121826` | texte courant |
| `--sec` | `#4A5468` | texte secondaire — 7,6:1 |

Un thème sombre existe via `[data-theme="dark"]`. **Toute nouvelle couleur doit passer par une variable**, jamais en dur.

**Typographie.** Poppins pour les titres, Inter pour le corps, JetBrains Mono pour les étiquettes.
**Aucun texte sous 15 px**, sauf les étiquettes en monospace (11 à 13 px) qui sont décoratives. Cette règle vient d'un retour explicite : les petits gris étaient illisibles.

**Verre liquide.** Une couche translucide a été ajoutée en septembre et validée en octobre : nappes de couleur floutées en fond de page, `backdrop-filter` sur la navigation, les cartes, les boutons et les pastilles. Elle vit dans la section 14 de `style.css` et dans les variables `--glass-*` et `--blob-*`. Deux points de vigilance : le contraste du texte secondaire au-dessus des nappes animées, et le coût de rendu sur machine modeste. **Ne jamais placer de `.card` (ni de composant en verre) dans une `.band`** : en thème clair, le blanc translucide sur le bleu soutenu donne un fond lavande où le texte gris et le titre hérité en blanc deviennent illisibles.

**Interdits.**
- Pas de bandeau défilant (marquee) — refusé explicitement.
- Pas de « nous » ni de « on » qui laisserait croire à une équipe. Registre impersonnel, « je » quand la phrase l'exige.
- Pas de contenu inventé. Si une information manque, poser un marqueur (voir §5) plutôt que de combler.

---

## 5. Les champs à compléter

Tout ce qui manque est balisé ainsi :

```html
<span class="todo">description de ce qu'il faut mettre</span>
```

Rendu en violet, volontairement voyant. `verifier.py` les compte par page. On les supprime au fur et à mesure que le contenu arrive.

**Il reste principalement :**
- période et durée du stage de 2ᵉ année (10 semaines de stage au total sur le cursus, 5 déjà faites)
- descriptions techniques des trois projets personnels
- reformulation du paragraphe d'ouverture de la veille, avec les mots de Luc
- photo de profil
- identifiant Formspree pour le formulaire de contact

---

## 6. Composants disponibles dans `style.css`

Réutiliser plutôt que réinventer : `.card`, `.tbl`, `.tag` (`.tag-slam`, `.tag-commun`), `.badge` (`.badge-ok`, `.badge-wait`), `.chip`, `.gauge`, `.lvl`, `.acc` (accordéon), `.band` (section pleine couleur), `.timeline`, `.steps` / `.step`, `.note` (encadré), `.prj` (carte projet), `.axe` (carte illustrée), `.feat` (bloc en vedette), `.pagehead`, `.cta`, `.form`.

Grilles : `.grid-2`, `.grid-3`, `.grid-4`, `.prj-grid`. Toutes repassent en une colonne sous 760 px.

Animations : ajouter la classe `.rv` à un élément suffit pour qu'il apparaisse au scroll. `prefers-reduced-motion` désactive tout.

---

## 7. Faits établis — ne pas les réinventer

**Stage de 1ʳᵉ année.** ZENG Expertise, SASU fondée en 2021 par David Zeng, Lyon 6ᵉ, en distanciel intégral. Ingénierie des données et IA, clientèle banque et finance. Du **4 mai au 5 juin 2026**, 200 heures, 5 semaines. Poste : assistant développeur data et back-end. Projet : preuve de concept d'un moteur d'analyse de données crypto sur architecture **RAG**. Six tâches : exploration JSON et schéma PostgreSQL, pipeline ETL, génération d'embeddings avec pgvector, optimisation des index, interface CLI, moteur de recherche hybride. Le tuteur a demandé en cours de stage d'accentuer la part IA et RAG.

**Crypto Anomaly Analyser.** Issu de ce stage, poursuivi au-delà de l'échéance car trop lourd. Dépôt : `https://github.com/Zeng-Zer/crypto-analyser` — **vérifier qu'il est public** avant de communiquer le lien.

**Parcours.** Bac général 2024 (spé maths et physique, maths expertes, mention assez bien, lycée Charles de Gaulle à Rosny-sous-Bois), licence informatique à Paris 8 en 2024-2025, MIASHS à Gustave Eiffel de septembre à novembre 2025, BTS SIO depuis novembre 2025. Objectif : licence pro ou école, puis Data Analyst et Data Scientist en IA.

**Certifications.** MOOC ANSSI sur le RGPD (2026), freeCodeCamp Relational Database (2026), PIX 509 points.

**Veille.** « Comment l'IA utilise nos données pour choisir à notre place sans que nous en ayons conscience. » Collection publique : `https://www.pearltrees.com/lucque`. Trois axes : collecte et traçage, recommandation et influence, cadre juridique.

**Épreuves.** Coefficient total 25, dont 12 sur E4, E5 et E6. E5 est un oral de 40 minutes avec 1 h 30 de préparation.

---

## 8. Conventions de travail

- Un commit par unité de sens, message en français à l'impératif : `Ajoute la page profil`, `Corrige le contraste du gris secondaire`.
- Lancer `verifier.py` avant chaque commit.
- Après toute modification du menu : `propager.py`, puis vérifier que les huit pages ont bien changé.
- Ne pas ajouter de dépendance. Si une bibliothèque semble nécessaire, en discuter d'abord — l'absence de dépendance est un argument à l'oral.
