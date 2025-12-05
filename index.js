import express from 'express';
import { 
    homepageHandler, registerHandler, loginHandler
 } from './handlers/example.js';
import { authenticationMiddleware } from './middlewares/authentication.js';
import { validationMiddleware, loginSchema, registerSchema } from './middlewares/validation.js';




const app = express();
const PORT = 3000

/*app.get('/', (req, res) => {
  res.send('Hello, World!');
});*/


app.use(express.json());
app.get('/', homepageHandler);
app.post('/register', validationMiddleware(registerSchema), registerHandler);
app.post('/login', validationMiddleware(loginSchema), loginHandler);


app.get('/with-auth', authenticationMiddleware, (req, res) => {
  console.log('User info from token:', req.user);
  const { user } = req;
  res.send(`Ok`);
});

app.post('/project', authenticationMiddleware, (req, res) => {
  res.send('Project created successfully!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
