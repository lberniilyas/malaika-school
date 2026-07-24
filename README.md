# Groupe Scolaire Malaika — Fès

Site vitrine de démonstration pour le **Groupe Scolaire Malaika**, établissement privé
situé à Fès (Maroc), accueillant les élèves de la maternelle au lycée.

## Aperçu

Site statique multi‑pages en français, sans dépendance à installer.
Pour le consulter : ouvrez `index.html` dans un navigateur, ou servez le dossier :

```bash
python -m http.server 8000
# puis http://localhost:8000
```

## Pages

| Page | Fichier |
|------|---------|
| Accueil | `index.html` |
| L'École | `ecole.html` |
| Programmes (maternelle → lycée) | `programmes.html` |
| Vie scolaire | `vie-scolaire.html` |
| Galerie | `galerie.html` |
| Actualités & agenda | `actualites.html` |
| Admission / Inscription | `admission.html` |
| Contact | `contact.html` |

## Structure

```
.
├── index.html            # + 7 autres pages HTML
├── assets/
│   ├── css/style.css     # design system complet
│   └── js/main.js        # navigation, galerie, lightbox, accordéon, formulaires
└── images/               # photographies de l'établissement
```

## Fonctionnalités

- Design responsive (menu mobile), animations au défilement, compteurs animés
- Galerie filtrable avec visionneuse (lightbox) navigable au clavier
- FAQ en accordéon, formulaires de démonstration, carte d'accès
- Accessibilité : navigation clavier, attributs ARIA, `prefers-reduced-motion`

## Remarques

Site de démonstration : les coordonnées (téléphone, e‑mail, adresse), les chiffres
(effectifs, taux de réussite) et les frais de scolarité sont **illustratifs** et
doivent être remplacés par les informations réelles de l'établissement.
