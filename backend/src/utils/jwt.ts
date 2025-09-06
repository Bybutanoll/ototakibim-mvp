import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'; // Reduced from 30d to 7d for security
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_super_secret_refresh_key_here_change_in_production';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Generate access token (short-lived)
 */
export const generateAccessToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(
    payload,
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRE,
      issuer: 'ototakibim-api',
      audience: 'ototakibim-client'
    }
  );
};

/**
 * Generate refresh token (long-lived)
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { 
      expiresIn: JWT_REFRESH_EXPIRE,
      issuer: 'ototakibim-api',
      audience: 'ototakibim-client'
    }
  );
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (payload: Omit<TokenPayload, 'iat' | 'exp'>): TokenPair => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload.id);
  
  // Calculate expiration time in seconds
  const expiresIn = jwt.decode(accessToken) as any;
  const expirationTime = expiresIn ? expiresIn.exp - Math.floor(Date.now() / 1000) : 0;

  return {
    accessToken,
    refreshToken,
    expiresIn: expirationTime
  };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'ototakibim-api',
      audience: 'ototakibim-client'
    }) as TokenPayload;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): { id: string } | null => {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'ototakibim-api',
      audience: 'ototakibim-client'
    }) as any;
    
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    return { id: payload.id };
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
};

/**
 * Legacy function for backward compatibility
 */
export const generateToken = (userId: string): string => {
  return generateAccessToken({ id: userId, email: '', role: 'user' });
};

/**
 * Legacy function for backward compatibility
 */
export const verifyToken = (token: string): any => {
  return verifyAccessToken(token);
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};
