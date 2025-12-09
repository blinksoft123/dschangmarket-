# Dschang HyperMarket

Une marketplace hybride moderne construite avec React, TailwindCSS et Supabase, conçue pour le marché camerounais.

## Fonctionnalités

- **Multi-vendeur**: Les utilisateurs peuvent créer leur boutique.
- **Paiements**: Intégration simulée Mobile Money (MTN/Orange).
- **Backend**: Supabase (Postgres, Auth, Storage, RLS).
- **UI/UX**: Design premium inspiré des thèmes WordPress.

## Installation & Connexion Supabase

### Option A : Via Supabase Dashboard (Recommandé si pas de CLI)

1. Allez sur votre projet : https://nvdibztptczjckxalejt.supabase.co
2. Ouvrez l'éditeur SQL (SQL Editor).
3. Copiez le contenu du fichier `supabase/migrations/20240524000000_remote_schema.sql`.
4. Collez et cliquez sur **Run**.
5. Allez dans **Storage** et vérifiez que le bucket `product-images` est créé et public.

### Option B : Via Supabase CLI

Si vous avez installé le CLI (`npm i -g supabase`), suivez ces étapes pour pousser la structure :

1.  **Login**
    ```bash
    supabase login
    ```
    (Entrez votre Access Token Supabase)

2.  **Lier le projet**
    ```bash
    supabase link --project-ref nvdibztptczjckxalejt
    ```
    (Entrez votre mot de passe de base de données si demandé)

3.  **Pousser le schéma**
    ```bash
    supabase db push
    ```

## Lancer l'application

1. `npm install`
2. `npm start`

## Structure

- `/src/pages`: Pages principales (Home, Product, Dashboard, Checkout).
- `/src/services`: API calls (Supabase wrapper, Payment mock).
- `/src/components`: UI Components réutilisables.
- `/src/hooks`: React Hooks (Cart logic).
- `/supabase/migrations`: Fichiers SQL pour la structure de base de données.
