📌 ApplyTrack – API REST de suivi des candidatures (Node.js + Express + MySQL)

API permettant de gérer vos candidatures, entreprises ciblées, contacts associés et interactions (relances, entretiens, emails, etc.).

✨ Fonctionnalités principales
🔐 Authentification

Inscription & connexion utilisateur

JWT obligatoire pour les routes protégées

Middleware d'auth sécurisée

🏢 Gestion des entreprises

Création, lecture, modification, suppression

Chaque entreprise appartient à un utilisateur

Protection par JWT

Détection de doublons

🧑‍💼 Gestion des contacts

Ajout / récupération / suppression de contacts liés à une entreprise

📆 Gestion des interactions

Ajout d’une interaction (email, appel, entretien, relance…)

Récupération de toutes les interactions d’une entreprise

Tri automatique par date décroissante

Validation de la date (pas dans le futur)

📁 Structure du projet
/project
│── index.js
│── package.json
│── schema.sql
│
├── database/
│   └── connection.js
│
├── controllers/
│   ├── users.controller.js
│   ├── companies.controller.js
│   ├── contacts.controller.js
│   └── interactions.controller.js
│
├── middlewares/
│   ├── authentication.js
│   └── validation.js
│
└── routes/
    ├── users.routes.js
    ├── companies.routes.js
    ├── contacts.routes.js
    └── interactions.routes.js

🛠️ Installation
1️⃣ Cloner le projet
git clone https://github.com/ton-compte/applytrack-api.git
cd applytrack-api

2️⃣ Installer les dépendances
npm install

3️⃣ Créer la base MySQL

Lancer MySQL puis exécuter :

SOURCE schema.sql;

4️⃣ Lancer l’API
npm run dev


L’API se lance sur :

👉 http://localhost:3000

🗄️ Fichier SQL (schema.sql)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(255),
  postal_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  UNIQUE (name, user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  job_title VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE interactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT,
  date DATE,
  type VARCHAR(255),
  description TEXT,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

🔐 Authentification (JWT)

Toutes les routes protégées nécessitent ce header :

token: VOTRE_JWT

🛣️ Documentation des routes
🔹 1. Users
POST /register

Body :

{
  "username": "john",
  "password": "123456"
}

POST /login

Retourne un JWT.

Réponse :

{
  "message": "Login successful!",
  "token": "xxxxx.yyyyy.zzzzz"
}

🔹 2. Companies
POST /companies

Créer une entreprise.

GET /companies

Liste des entreprises de l'utilisateur.

GET /companies/:id

Détails d’une entreprise.

PUT /companies/:id

Modifier une entreprise.

DELETE /companies/:id

Supprimer une entreprise.

🔹 3. Contacts
POST /companies/:companyId/contacts

Créer un contact.

GET /companies/:companyId/contacts

Voir les contacts d’une entreprise.

DELETE /companies/:companyId/contacts/:contactId

Supprimer un contact.

🔹 4. Interactions
POST /companies/:companyId/interactions

Créer une interaction.

Body :

{
  "date": "2025-01-12",
  "type": "Email",
  "description": "Relance envoyée"
}


Règles :

La date ne peut pas être dans le futur

L'entreprise doit appartenir à l'utilisateur

GET /companies/:companyId/interactions

Renvoie toutes les interactions, triées par date DESC.

⭐ Bonus : Dernière interaction

Pour afficher uniquement la dernière interaction d’une entreprise, votre front peut utiliser :

GET /companies/:id/interactions


et prendre le premier élément du tableau :

const last = interactions[0];

👨‍💻 Développement

Lancer le serveur :

npm run dev


Tests API recommandés :

Thunder Client (VSCode)

Postman

Insomnia

🏁 Conclusion

Ce projet fournit :

✔ Une API complète
✔ Sécurisée avec JWT
✔ Architecture professionnelle MVC
✔ Validation Zod
✔ MySQL + requêtes préparées
✔ Gestion Users / Companies / Contacts / Interactions
