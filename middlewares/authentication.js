import jwt from "jsonwebtoken";

function authenticationMiddleware(req, res, next) {
  const token = req.header('token');
  if (!token) {
    res.status(401).send('Unauthorized: No token provided')
    return;
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    console.log('Decoded token:', decoded);

    req.user = {
        id: decoded.id,
        username: decoded.username
    }


  // Request contains an API key in header
    return next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).send('Unauthorized: Invalid token');
    }
}   

export { authenticationMiddleware };