import express from 'express';
import usersRouter from './routes/users.routes.js';
import { authenticationMiddleware } from './middlewares/authentication.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Toutes les routes users (/, /register, /login)
app.use('/', usersRouter);

// Routes protégées par JWT (on les gardera pour tester l’auth)
app.get('/with-auth', authenticationMiddleware, (req, res) => {
  const { user } = req;
  console.log('User info from token:', user);
  res.send('Ok');
});

app.post('/project', authenticationMiddleware, (req, res) => {
  res.send('Project created successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
