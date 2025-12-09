# Dschang HyperMarket

Une marketplace hybride moderne construite avec React, TailwindCSS et Supabase, conçue pour le marché camerounais.

## Fonctionnalités

- **Multi-vendeur**: Les utilisateurs peuvent créer leur boutique.
- **Paiements**: Intégration simulée Mobile Money (MTN/Orange).
- **Backend**: Supabase (Postgres, Auth, Storage, RLS).
- **UI/UX**: Design premium inspiré des thèmes WordPress.

## Installation

1. Cloner le dépôt.
2. `npm install`
3. Copier le contenu de `supabase_schema.sql` dans l'éditeur SQL de votre projet Supabase.
4. Mettre à jour `lib/supabaseClient.ts` avec vos propres clés si nécessaire.
5. Créer un bucket de stockage public nommé `product-images` dans Supabase Storage.
6. `npm start` pour lancer en local.

## Structure

- `/src/pages`: Pages principales (Home, Product, Dashboard, Checkout).
- `/src/services`: API calls (Supabase wrapper, Payment mock).
- `/src/components`: UI Components réutilisables.
- `/src/hooks`: React Hooks (Cart logic).

## Déploiement

Ce projet est prêt pour Vercel ou Netlify. Assurez-vous d'ajouter les variables d'environnement dans votre plateforme de déploiement si vous sortez les clés du code.
