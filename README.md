# SVT — Localiser l’information héréditaire (3e)

Application web (iPad-friendly) pour faire construire aux élèves le raisonnement :
**noyau → chromosomes → ADN → information héréditaire**.

## Usage en classe (1 à 2 séances)
- Séance 1 : tri Observation / Interprétation / Conclusion + reconstitution de la chaîne logique.
- Séance 2 : justification rédigée + trace écrite.

## Mode enseignant
- Accès par PIN (défaut : 1234)
- Tableau de bord : résultats, export CSV, purge des essais
- Données stockées localement sur l’iPad (localStorage)

## Installation (sur ton Mac)
```bash
npm install
npm run dev
```

## Build (GitHub Pages)
```bash
npm run build
```
Le dossier `dist/` est produit.

## Personnalisation
Le contenu pédagogique est dans :
- `src/content/sequence.fr.json`

Tu peux y modifier :
- textes, cartes de preuves, ordre cible de la chaîne, mots-clés attendus.

## Licence
Tu peux ajouter un fichier `LICENSE` (MIT par exemple).
