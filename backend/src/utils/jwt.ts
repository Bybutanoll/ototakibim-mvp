import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'production_jwt_secret_key_2024';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'production_refresh_secret_key_2024';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

export interface TokenPayload {
  id: string;
  email: string;
  tenantId: string;
  tenantRole: string;
  globalRole?: string;
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
  const options: SignOptions = {
    expiresIn: JWT_EXPIRE as any,
    issuer: 'ototakibim-api',
    audience: 'ototakibim-client'
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Generate refresh token (long-lived)
 */
export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: JWT_REFRESH_EXPIRE as any,
    issuer: 'ototakibim-api',
    audience: 'ototakibim-client'
  };
  
  return jwt.sign({ id: userId, type: 'refresh' }, JWT_REFRESH_SECRET, options);
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (payload: Omit<TokenPayload, 'iat' | 'exp'>): TokenPair => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload.id);
  
  // Calculate expiration time in seconds
  const decoded = jwt.decode(accessToken) as any;
  const expirationTime = decoded && decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 0;

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
    const options: VerifyOptions = {
      issuer: 'ototakibim-api',
      audience: 'ototakibim-client'
    };
    
    return jwt.verify(token, JWT_SECRET, options) as TokenPayload;
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
    const options: VerifyOptions = {
      issuer: 'ototakibim-api',
      audience: 'ototakibim-client'
    };
    
    const payload = jwt.verify(token, JWT_REFRESH_SECRET, options) as any;
    
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
  return generateAccessToken({ 
    id: userId, 
    email: '', 
    tenantId: 'default-tenant',
    tenantRole: 'technician'
  });
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
