// controllers/users.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database/connection.js';
import { JWT_SECRET } from '../config.js'; // Ma clé secrète pour JWT


// Handlers
function homepageHandler(req, res) {
  res.send('Hello from the home handler!');
}


// Enregistrement d'un nouvel utilisateur
async function registerHandler(req, res) {
  const { username, password } = req.body;

  try {
    // 1 - Vérifie si l'utilisateur existe déjà
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );

        // Si l'utilisateur existe déjà, renvoyer une erreur
        if (rows.length > 0) {
        return res.status(400).send('Username already exists!');
        }


    // 2 - Hashe le mot de passe
    const hashedpassword = await bcrypt.hash(password, 10);


    // 3 - Insére l'utilisateur en BDD
    await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)', 
      [username, hashedpassword]
    );


    // 4 - Renvoie une réponse de succès
    return res.send('User registered successfully and stored in database!');
  } catch (error) {
    console.error('Erreur lors de l’enregistrement:', error);
    return res.status(500).send('Internal Server Error');
  }
}


// Connexion d'un utilisateur existant
async function loginHandler(req, res) {
  const { username, password } = req.body;


  // 1 - Récupère l'utilisateur en BDD
  try {

    // Récupère l'utilisateur par son nom d'utilisateur
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );


    // 2 - Vérifie le mot de passe
    if (rows.length === 0) {
      return res.status(400).send('Invalid username or password!');
    }

    // Compare le mot de passe fourni avec le mot de passe hashé en BDD
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Si le mot de passe est invalide, renvoyer une erreur
    if (!isPasswordValid) {
      return res.status(400).send('Invalid username or password!');
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3 - Renvoie le token au client & message de succès
    return res.json({ message: 'Login successful!', token });
  } catch (error) {
    // Gérer les erreurs
    console.error('Erreur lors du login:', error);
    return res.status(500).send('Internal Server Error');
  }
}

export { homepageHandler, registerHandler, loginHandler };
