import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';
import { AuthResponse } from '../types/auth.types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        email_confirmed_at?: string | null;
        phone?: string | null;
        last_sign_in_at?: string | null;
      };
    }
  }
}

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 * Expects Authorization header with Bearer token
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: AuthResponse = {
        success: false,
        message: 'Authentication required',
        error: 'No authorization token provided',
      };
      res.status(401).json(response);
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      const response: AuthResponse = {
        success: false,
        message: 'Invalid or expired token',
        error: error?.message || 'Authentication failed',
      };
      res.status(401).json(response);
      return;
    }

    // Attach user to request object
    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.first_name,
      email_confirmed_at: data.user.email_confirmed_at,
      phone: data.user?.phone,
      last_sign_in_at: data.user?.last_sign_in_at,
    };

    // Continue to next middleware/handler
    next();
  } catch (error) {
    const response: AuthResponse = {
      success: false,
      message: 'Authentication error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

/**
 * Optional authentication middleware - attaches user if token is valid, but doesn't block request
 * Useful for routes that have different behavior for authenticated vs unauthenticated users
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user
      next();
      return;
    }

    const token = authHeader.substring(7);
    const { data, error } = await supabase.auth.getUser(token);

    if (!error && data.user) {
      // Valid token, attach user
      req.user = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.first_name,
        email_confirmed_at: data.user.email_confirmed_at,
        phone: data.user?.phone,
        last_sign_in_at: data.user?.last_sign_in_at,
      };
    }

    // Continue regardless of token validity
    next();
  } catch (error) {
    // On error, just continue without user
    next();
  }
};
