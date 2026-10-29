#!/usr/bin/env python3
"""Contrôle qualité du site avant livraison.  Usage : python3 _outils/verifier.py"""
import re, pathlib, sys

RACINE = pathlib.Path(__file__).resolve().parent.parent
pages = sorted(p for p in RACINE.glob('*.html') if not p.name.startswith('_'))

# pages planifiées mais pas encore écrites : signalées en information, pas en alerte
# (aucune pour le moment : toutes les pages existent, la version anglaise est abandonnée)
PREVUES = set()

alertes, infos, manquantes = [], [], set()

for p in pages:
    h = p.read_text(encoding='utf-8')
    n = p.name

    # fichiers locaux référencés
    for lien in set(re.findall(r'(?:src|href)="((?!https?:|mailto:|tel:|#)[^"]+)"', h)):
        cible = (RACINE / lien.split('#')[0]).resolve()
        if not cible.exists():
            if lien in PREVUES:
                manquantes.add(lien)
            else:
                alertes.append(f'{n} : cible manquante -> {lien}')

    # images sans alt
    for img in re.findall(r'<img[^>]*>', h):
        if 'alt=' not in img:
            alertes.append(f'{n} : image sans attribut alt -> {img[:70]}')

    # un seul h1
    nb_h1 = len(re.findall(r'<h1[\s>]', h))
    if nb_h1 != 1:
        alertes.append(f'{n} : {nb_h1} balise(s) h1 (il en faut exactement une)')

    # identifiants dupliqués
    ids = re.findall(r'\sid="([^"]+)"', h)
    for i in set(ids):
        if ids.count(i) > 1:
            alertes.append(f'{n} : identifiant dupliqué -> {i}')

    # balises non fermées
    for t in ['section','div','article','aside','nav','button','main','table','ul','li','figure']:
        o = len(re.findall(r'<%s[\s>]' % t, h)); c = len(re.findall(r'</%s>' % t, h))
        if o != c:
            alertes.append(f'{n} : balise {t} déséquilibrée ({o} ouvertes, {c} fermées)')

    # champs à compléter
    todo = h.count('class="todo"')
    if todo:
        infos.append(f'{n} : {todo} champ(s) à compléter')

# poids des médias
for f in sorted((RACINE / 'assets').rglob('*')):
    if f.is_file() and f.suffix.lower() in {'.jpg','.jpeg','.png','.webp','.svg'}:
        ko = f.stat().st_size / 1024
        if ko > 400:
            alertes.append(f'image lourde : {f.relative_to(RACINE)} — {ko:.0f} ko')

print(f'{len(pages)} page(s) contrôlée(s) : ' + ', '.join(p.name for p in pages))
print()
if alertes:
    print('ALERTES')
    for a in alertes: print('  x', a)
else:
    print('Aucune alerte.')
if manquantes:
    print('\nPAGES ENCORE À PRODUIRE')
    for m in sorted(manquantes): print('  -', m)
if infos:
    print('\nCHAMPS À COMPLÉTER')
    for i in infos: print('  -', i)
sys.exit(1 if alertes else 0)
