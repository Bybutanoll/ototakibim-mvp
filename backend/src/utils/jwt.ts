import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

export const generateToken = (userId: string): string => {
  return (jwt as any).sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return (jwt as any).verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): any => {
  try {
    return (jwt as any).decode(token);
  } catch (error) {
    return null;
  }
};
