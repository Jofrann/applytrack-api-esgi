import bcrypt from 'bcrypt';
import { db } from '../database/mysql2-promise.js';  
import jwt from "jsonwebtoken";

function homepageHandler(req, res) {
  res.send('Hello from the home handler!');
}

async function registerHandler(req, res) {
  const { username, password } = req.body;
  //console.log(`Le nom d'utilisateur est : ${username}, avec comme mot de passe : ${password}`);

  
  //console.log("Mot de passe hashé : ", hashedpassword);

  // 2 - store user in database (simulated here with a console log)
  //console.log(`Storing user: ${username} avec comme mot de passe hashé : ${hashedpassword} dans la base de données.`);


  ///////////          VRAI CODE          ///////////
  
  // 1 - Check if user already exists
  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );

          //ERREUR EN CAS D'UTILISATEUR EXISTANT
            if (rows.length > 0) {
              return res.status(400).send('Username already exists!');
            } 


  // 2 - hash password 
      const hashedpassword = await bcrypt.hash(password, 10); 



  // 3 - store user in database
    await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)', 
      [username, hashedpassword]
    );

  } catch (error) {
    console.error('Erreur lors de l’enregistrement:', error);
    return res.status(500).send('Internal Server Error');
  }

  res.send('User registered successfully and stored in database!');

  ///////////          FIN VRAI CODE          ///////////
}


async function loginHandler(req, res) {
    const { username, password } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).send('Invalid username or password!');
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send('Invalid username or password!');
    }


    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });


    res.json({ message: 'Login successful!', token });

  }

export { homepageHandler, registerHandler, loginHandler };