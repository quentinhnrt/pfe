# Tests API - Documentation

Ce document liste tous les tests effectués pour chaque endpoint API du projet Artilink.

## Configuration des tests

- **Framework**: Vitest
- **Mocking**: vitest-mock-extended pour Prisma
- **Environnement**: Node.js (isolé de la base de données)

## API Artists (`/api/artists`)

### GET /api/artists

✅ **Tests effectués:**

1. **Retourne un tableau vide sans paramètre de recherche**

   - Vérifie que l'API retourne `[]` quand aucune recherche n'est fournie
   - S'assure qu'aucune requête n'est faite à la base de données

2. **Retourne les artistes correspondant à la recherche**

   - Teste la recherche sur les champs `name`, `firstname`, `lastname`
   - Vérifie que seuls les utilisateurs avec le rôle `ARTIST` sont retournés
   - Confirme la structure complète des données retournées

3. **Valide les paramètres de recherche invalides**

   - Teste avec une chaîne de plus de 100 caractères
   - Vérifie le retour d'erreur 400 avec les détails de validation

4. **Gère les erreurs de base de données**

   - Simule une erreur de connexion à la base de données
   - Vérifie le retour d'erreur 500 avec message générique

5. **Retourne 404 pour erreur Prisma P2025**

   - Teste le cas "Record not found"
   - Vérifie la gestion spécifique de cette erreur Prisma

6. **Retourne 409 pour erreur Prisma P2002**

   - Teste le cas "Unique constraint failed"
   - Vérifie la gestion des violations de contraintes

7. **Recherche insensible à la casse**
   - Teste que la recherche fonctionne indépendamment de la casse
   - Vérifie sur tous les champs de nom (name, firstname, lastname)

## API Artworks (`/api/artworks`)

### GET /api/artworks

✅ **Tests effectués:**

1. **Retourne toutes les œuvres sans filtres**

   - Vérifie la pagination par défaut (skip: 0, take: 10)
   - Confirme l'inclusion des données utilisateur
   - Teste le tri par date de création décroissante

2. **Filtre les œuvres par userId**

   - Teste le filtrage par artiste spécifique
   - Vérifie que seules les œuvres de l'utilisateur sont retournées

3. **Filtre les œuvres à vendre**

   - Teste avec `isForSale=true`
   - Vérifie que `sold=false` est automatiquement ajouté
   - Confirme que seules les œuvres disponibles sont retournées

4. **Gère la pagination**

   - Teste avec `page=2` et `limit=20`
   - Vérifie le calcul correct de `skip` et `take`

5. **Gère les erreurs de base de données**
   - Simule une erreur de base de données
   - Vérifie le retour d'erreur 500

### POST /api/artworks

✅ **Tests effectués:**

1. **Crée une œuvre pour un artiste authentifié**

   - Vérifie l'authentification et le rôle ARTIST
   - Teste la création complète avec tous les champs
   - Confirme l'upload d'image et l'enregistrement en base

2. **Rejette les utilisateurs non-artistes**

   - Teste avec un utilisateur ayant le rôle USER
   - Vérifie le retour d'erreur 403

3. **Rejette les utilisateurs non authentifiés**

   - Teste sans session
   - Vérifie le retour d'erreur 403

4. **Valide les champs requis**

   - Teste avec des données manquantes (titre)
   - Vérifie le retour d'erreur 400 avec détails

5. **Exige une image**
   - Teste sans fichier image
   - Vérifie le message d'erreur spécifique "Image is required"

### PUT /api/artworks

✅ **Tests effectués:**

1. **Met à jour une œuvre pour le propriétaire**

   - Vérifie l'authentification et la propriété
   - Teste la mise à jour partielle des champs
   - Confirme que seuls les champs fournis sont mis à jour

2. **Empêche la modification par un autre utilisateur**

   - Teste avec un artiste différent
   - Vérifie le retour d'erreur 404

3. **Gère la mise à jour d'image**

   - Teste l'upload d'une nouvelle image
   - Vérifie la mise à jour du thumbnail

4. **Valide l'ID de l'œuvre**
   - Teste sans artworkId
   - Vérifie le retour d'erreur 400

### DELETE /api/artworks/[id]

✅ **Tests effectués:**

1. **Supprime une œuvre pour le propriétaire**

   - Vérifie l'authentification et la propriété
   - Confirme la suppression effective

2. **Empêche la suppression par un autre utilisateur**

   - Teste avec un artiste différent
   - Vérifie que la suppression n'est pas effectuée

3. **Valide l'ID de l'œuvre**

   - Teste avec un ID invalide (non numérique)
   - Vérifie le retour d'erreur 400

4. **Gère l'erreur P2025 (non trouvé)**

   - Simule une tentative de suppression d'une œuvre inexistante
   - Vérifie le retour d'erreur 404

5. **Gère l'erreur P2003 (contrainte de clé étrangère)**
   - Simule une œuvre liée à d'autres enregistrements
   - Vérifie le message d'erreur approprié (409)

## API Collections (`/api/collections`)

### GET /api/collections

✅ **Tests effectués:**

1. **Retourne les collections par IDs et userId**

   - Vérifie le filtrage par IDs multiples (format CSV)
   - Confirme le filtrage par userId
   - Teste l'inclusion des œuvres associées

2. **Erreur quand collectionIds manque**

   - Teste l'absence du paramètre collectionIds
   - Vérifie le retour d'erreur 400

3. **Erreur quand userId manque**

   - Teste l'absence du paramètre userId
   - Vérifie le retour d'erreur 400

4. **Erreur pour format d'ID invalide**

   - Teste avec des IDs non numériques
   - Vérifie la validation du format

5. **Gère les collections vides**

   - Teste quand aucune collection ne correspond
   - Vérifie le retour d'un tableau vide

6. **Gère les erreurs de base de données**
   - Simule une erreur de base de données
   - Vérifie le retour d'erreur 500

### POST /api/collections

✅ **Tests effectués:**

1. **Crée une collection pour un artiste authentifié**

   - Vérifie l'authentification et le rôle ARTIST
   - Teste la création sans œuvres
   - Confirme la structure de retour

2. **Crée une collection avec des œuvres**

   - Teste l'ajout d'œuvres à la collection
   - Vérifie que les œuvres appartiennent à l'utilisateur
   - Confirme la connexion des œuvres

3. **Rejette les utilisateurs non-artistes**

   - Teste avec un utilisateur ayant le rôle USER
   - Vérifie le retour d'erreur 403

4. **Rejette les utilisateurs non authentifiés**

   - Teste sans session
   - Vérifie le retour d'erreur 403

5. **Valide les champs requis**

   - Teste sans titre
   - Vérifie le retour d'erreur 400 avec détails

6. **Rejette quand les œuvres n'appartiennent pas à l'utilisateur**

   - Teste avec des IDs d'œuvres non autorisées
   - Vérifie la validation de propriété

7. **Utilise une chaîne vide pour la description si non fournie**

   - Teste la création sans description
   - Vérifie la valeur par défaut

8. **Gère l'erreur P2002 (titre dupliqué)**

   - Simule une violation de contrainte unique
   - Vérifie le message d'erreur spécifique (409)

9. **Gère l'erreur P2025 (enregistrement lié non trouvé)**
   - Simule une référence à un enregistrement inexistant
   - Vérifie le retour d'erreur 404

## API Posts (`/api/posts`)

### GET /api/posts

✅ **Tests effectués:**

1. **Retourne les posts avec pagination par défaut**

   - Vérifie la pagination par défaut (limit: 10, page: 1)
   - Teste l'inclusion des relations (artworks, question, answers, user)
   - Confirme le tri par date décroissante

2. **Gère la pagination personnalisée**

   - Teste avec des paramètres page et limit personnalisés
   - Vérifie le calcul correct de skip

3. **Filtre les posts par userId**

   - Teste le filtrage par utilisateur spécifique
   - Vérifie l'ajout de la clause where

4. **Fonctionne sans authentification**

   - Teste l'accès public aux posts
   - Vérifie que l'ID utilisateur vide est utilisé pour les answers

5. **Applique les limites de pagination**

   - Teste que la limite maximale (100) est respectée
   - Vérifie la protection contre les valeurs excessives

6. **Gère les paramètres de pagination invalides**

   - Teste avec des valeurs non numériques
   - Vérifie le retour aux valeurs par défaut

7. **Gère les erreurs de base de données**
   - Simule une erreur de base de données
   - Vérifie le retour d'erreur 500

### POST /api/posts

✅ **Tests effectués:**

1. **Crée un post sans question pour un artiste authentifié**

   - Vérifie l'authentification et le rôle ARTIST
   - Teste la création avec contenu et artworks
   - Confirme la transaction et les relations

2. **Crée un post avec question et réponses**

   - Teste la création complète avec question
   - Vérifie la création des réponses associées
   - Confirme la structure de retour complète

3. **Rejette les utilisateurs non-artistes**

   - Teste avec un utilisateur ayant le rôle USER
   - Vérifie le retour d'erreur 403

4. **Rejette les utilisateurs non authentifiés**

   - Teste sans session
   - Vérifie le retour d'erreur 403

5. **Valide les champs requis**

   - Teste sans contenu ni artworks
   - Vérifie le retour d'erreur 400 avec détails

6. **Exige au moins une œuvre**

   - Teste avec un tableau d'artworks vide
   - Vérifie la validation minimale

7. **Rejette une question sans réponses**

   - Teste la cohérence question/réponses
   - Vérifie le message d'erreur spécifique

8. **Exige au moins 2 réponses pour une question**

   - Teste avec une seule réponse
   - Vérifie la validation du nombre minimum

9. **Rejette quand les œuvres n'appartiennent pas à l'utilisateur**
   - Teste avec des IDs d'œuvres non autorisées
   - Vérifie la validation de propriété

### PUT /api/posts

✅ **Tests effectués:**

1. **Met à jour un post pour le propriétaire**

   - Vérifie l'authentification et la propriété
   - Teste la mise à jour du contenu et des artworks
   - Confirme le remplacement complet des artworks (set)

2. **Empêche la modification par un autre utilisateur**

   - Teste avec un artiste différent
   - Vérifie le retour d'erreur 404

3. **Rejette les utilisateurs non-artistes**

   - Teste avec un utilisateur ayant le rôle USER
   - Vérifie le retour d'erreur 403

4. **Valide les champs requis**

   - Teste sans les champs obligatoires
   - Vérifie le retour d'erreur 400 avec détails

5. **Rejette quand les œuvres n'appartiennent pas à l'utilisateur**

   - Teste avec des IDs d'œuvres non autorisées
   - Vérifie la validation de propriété

6. **Gère les erreurs de base de données**
   - Simule une erreur lors de la recherche du post
   - Vérifie le retour d'erreur 500

## Statistiques globales

- **Total des tests**: 63
- **API Artists**: 7 tests
- **API Artworks**: 19 tests
  - GET: 5 tests
  - POST: 5 tests
  - PUT: 4 tests
  - DELETE: 5 tests
- **API Collections**: 15 tests
  - GET: 6 tests
  - POST: 9 tests
- **API Posts**: 22 tests
  - GET: 7 tests
  - POST: 9 tests
  - PUT: 6 tests
