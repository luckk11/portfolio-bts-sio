#!/usr/bin/env python3
"""Propage le header et le footer de index.html vers toutes les autres pages.

Les blocs sont délimités dans chaque fichier par :
    <!-- #header -->  ...  <!-- /#header -->
    <!-- #footer -->  ...  <!-- /#footer -->

Usage :  python3 _outils/propager.py
"""
import re, pathlib, sys

RACINE = pathlib.Path(__file__).resolve().parent.parent

def bloc(html, nom):
    m = re.search(r'<!-- #%s -->(.*?)<!-- /#%s -->' % (nom, nom), html, re.S)
    return m.group(1) if m else None

def remplacer(html, nom, contenu):
    return re.sub(r'(<!-- #%s -->).*?(<!-- /#%s -->)' % (nom, nom),
                  lambda m: m.group(1) + contenu + m.group(2), html, flags=re.S)

def adapter_header(h, fichier):
    h = h.replace('href="#top"', 'href="index.html"')
    h = h.replace(' aria-current="page"', '')
    motifs = [r'(<a class="nl" href="%s")', r'(<a class="nl nl-main" href="%s")', r'(<a href="%s")']
    for m in motifs:
        h2 = re.sub(m % re.escape(fichier), r'\1 aria-current="page"', h, count=1)
        if h2 != h:
            return h2
    return h

def main():
    src = (RACINE / 'index.html').read_text(encoding='utf-8')
    header, footer = bloc(src, 'header'), bloc(src, 'footer')
    if header is None or footer is None:
        sys.exit('Marqueurs #header / #footer absents de index.html')

    for f in sorted(RACINE.glob('*.html')):
        if f.name == 'index.html' or f.name.startswith('_'):
            continue
        html = f.read_text(encoding='utf-8')
        if bloc(html, 'header') is None:
            print('  ignoré (pas de marqueurs) :', f.name); continue
        html = remplacer(html, 'header', adapter_header(header, f.name))
        html = remplacer(html, 'footer', footer)
        f.write_text(html, encoding='utf-8')
        print('  mis à jour :', f.name)

if __name__ == '__main__':
    print('Propagation depuis index.html')
    main()
