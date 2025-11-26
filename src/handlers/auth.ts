import { Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../utils/supabase';
import { AuthResponse } from '../types/auth.types';

// Validation schemas
const loginSchema = z.object({
  email: z.string('Email field is required').email('Invalid email format'),
  password: z.string('Password field is required').min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  first_name: z.string('First name field is required'),
  last_name: z.string('Last name field is required'),
  email: z.string('Email field is required').email('Invalid email format'),
  password: z.string('Password field is required').min(8, 'Password must be at least 8 characters'),
});

const resetPasswordSchema = z.object({
  email: z.string('Email field is required').email('Invalid email format'),
});

/**
 * Login handler - authenticates user with email and password
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      const response: AuthResponse = {
        success: false,
        message: 'Login failed',
        error: error.message,
      };
      res.status(401).json(response);
      return;
    }

    const response: AuthResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.name,
              email_confirmed_at: data.user.email_confirmed_at,
            }
          : undefined,
        session: data.session
          ? {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
              expires_in: data.session.expires_in,
              expires_at: data.session.expires_at,
              token_type: data.session.token_type,
            }
          : undefined,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: AuthResponse = {
        success: false,
        message: 'Validation error',
        error: z.flattenError(error),
      };
      res.status(400).json(response);
      return;
    }

    const response: AuthResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

/**
 * Register handler - creates new user account
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Create user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/verify`,
        data: {
          name: `${validatedData.first_name} ${validatedData.last_name}`,
        },
      },
    });

    if (error) {
      const response: AuthResponse = {
        success: false,
        message: 'Registration failed',
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AuthResponse = {
      success: true,
      message: 'Registration successful. Please check your email for verification.',
      data: {
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.name,
              email_confirmed_at: data.user.email_confirmed_at,
            }
          : undefined,
        session: data.session
          ? {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
              expires_in: data.session.expires_in,
              expires_at: data.session.expires_at,
              token_type: data.session.token_type,
            }
          : undefined,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: AuthResponse = {
        success: false,
        message: 'Validation error',
        error: z.flattenError(error),
      };
      res.status(400).json(response);
      return;
    }

    const response: AuthResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

/**
 * Reset password handler - sends password reset email
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validatedData = resetPasswordSchema.parse(req.body);

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      const response: AuthResponse = {
        success: false,
        message: 'Password reset failed',
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AuthResponse = {
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: AuthResponse = {
        success: false,
        message: 'Validation error',
        error: error.issues.map((e: z.ZodIssue) => e.message).join(', '),
      };
      res.status(400).json(response);
      return;
    }

    const response: AuthResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

/**
 * Logout handler - signs out the current user
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      const response: AuthResponse = {
        success: false,
        message: 'Logout failed',
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AuthResponse = {
      success: true,
      message: 'Logout successful',
    };

    res.status(200).json(response);
  } catch (error) {
    const response: AuthResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

/**
 * Email verification handler - displays success page after email verification
 */
export const verifyEmail = async (_req: Request, res: Response): Promise<void> => {
  // Send a simple HTML response
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
        }
        .success-icon {
          width: 80px;
          height: 80px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .checkmark {
          width: 40px;
          height: 40px;
          border: 4px solid white;
          border-top: none;
          border-right: none;
          transform: rotate(-45deg);
          margin-top: 10px;
        }
        h1 {
          color: #1f2937;
          margin-bottom: 1rem;
          font-size: 1.875rem;
        }
        p {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .info {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: #4b5563;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">
          <div class="checkmark"></div>
        </div>
        <h1>Email Verified! ✓</h1>
        <p>Your email has been successfully verified. You can now log in to your account.</p>
        <div class="info">
          <strong>Next Steps:</strong><br>
          Use the login endpoint to access your account with your email and password.
        </div>
      </div>
    </body>
    </html>
  `);
};
