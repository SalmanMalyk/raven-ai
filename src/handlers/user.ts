import { Request, Response } from 'express';
import { AuthResponse } from '../types/auth.types';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      const response: AuthResponse = {
        success: false,
        message: 'User not authenticated',
      };
      res.status(401).json(response);
      return;
    }

    const response: AuthResponse = {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          ...req.user,
          email_confirmed_at: req.user.email_confirmed_at ?? undefined,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const response: AuthResponse = {
      success: false,
      message: 'Error retrieving profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};
