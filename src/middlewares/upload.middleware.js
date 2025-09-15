import multer from 'multer';
import jwt from 'jsonwebtoken';
 
const storage = multer.memoryStorage();
 
export const upload = multer({ storage });
 
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Token missing or invalid' });
  }
 
  const token = authHeader.split(' ')[1];
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token invalid' });
  }
};
 
 