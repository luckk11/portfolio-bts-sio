# Portfolio BTS SIO — Luc Zhang

Portfolio d'un étudiant en BTS Services Informatiques aux Organisations, option SLAM.
Il sert de support à l'épreuve E5 et présente le parcours, les compétences, le stage, les projets et la veille technologique.

Site **statique**, écrit à la main en HTML, CSS et JavaScript. Aucun framework, aucun générateur, aucune dépendance à installer.

---

## Lancer le site

Double-cliquer sur `index.html`. Tout fonctionne, y compris le thème sombre et les animations.

Pour un rendu identique à la production, avec un serveur local :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

---

## Structure

```
index.html            Accueil
profil.html           Parcours détaillé
bts-sio.html          Le diplôme
competences.html      Référentiel et preuves
stage-1.html          Stage de 1re année — ZENG Expertise
stage-2.html          Stage de 2e année — à venir
projets.html          Réalisations
veille.html           Veille technologique
contact.html          Formulaire et coordonnées

assets/css/style.css  Mise en forme complète, pilotée par variables CSS
assets/js/main.js     Thème sombre, menu, sous-menu, animations, formulaire
assets/img/           Images et illustrations
assets/docs/          CV, rapport de stage, attestation

_outils/              Scripts de maintenance (non servis aux visiteurs)
```

---

## Maintenance

Le header et le footer sont définis **une seule fois**, dans `index.html`, entre les marqueurs `<!-- #header -->` et `<!-- #footer -->`.

Après toute modification du menu :

```bash
python3 _outils/propager.py
```

Avant chaque publication :

```bash
python3 _outils/verifier.py
```

Ce script signale les liens cassés, les images sans texte alternatif, les balises déséquilibrées, les images trop lourdes, et compte les champs restant à compléter.

---

## Champs à compléter

Les informations manquantes sont balisées `<span class="todo">…</span>` et apparaissent en violet sur le site. Elles se suppriment au fur et à mesure que le contenu arrive.

---

## Formulaire de contact

GitHub Pages n'héberge que des fichiers statiques et ne peut pas envoyer d'e-mail. Le formulaire passe donc par un service externe.

1. Créer un compte gratuit sur [Formspree](https://formspree.io) ou [Web3Forms](https://web3forms.com)
2. Créer un formulaire et récupérer l'identifiant
3. Dans `contact.html`, remplacer `VOTRE_ID` dans l'attribut `data-endpoint`

Tant que l'identifiant n'est pas renseigné, le formulaire ouvre automatiquement le logiciel de messagerie du visiteur avec le message pré-rempli. Rien n'est cassé pendant la mise en place.

---

## Publier

Le dépôt est en place : [github.com/luckk11/portfolio-bts-sio](https://github.com/luckk11/portfolio-bts-sio).

Pour envoyer les modifications :

```bash
python3 _outils/verifier.py
git add .
git commit -m "Décris ce que tu as fait"
git push
```

**Activer GitHub Pages**, une seule fois : sur le dépôt, **Settings → Pages → Source : Deploy from a branch → main / (root) → Save**.

Le site est ensuite en ligne à l'adresse `https://luckk11.github.io/portfolio-bts-sio/`, et chaque `git push` le met à jour quelques minutes plus tard.

C'est cette adresse qui figure en en-tête du tableau de synthèse de l'épreuve E5.

---

## Accessibilité

Contraste conforme au niveau AA, navigation au clavier complète, lien d'évitement, textes alternatifs sur toutes les images, structure sémantique, et désactivation des animations si le système le demande (`prefers-reduced-motion`).
