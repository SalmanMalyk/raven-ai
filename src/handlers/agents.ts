import { Request, Response } from 'express';
import * as z from 'zod';
import { getAuthenticatedSupabaseClient } from '../utils/supabase';
import { AgentResponse } from '../types/agent.types';

// Validation schemas
const createAgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required').max(255, 'Agent name must be less than 255 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().min(1, 'Description is required'),
  contact_person_name: z.string().max(255, 'Contact person name must be less than 255 characters').optional(),
  contact_email: z.string().email('Invalid email format').optional().or(z.literal('')),
  contact_phone: z.string().max(50, 'Phone number must be less than 50 characters').optional(),
  signature: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal', 'enthusiastic']).optional(),
  language: z.string().length(2, 'Language must be a 2-letter ISO code').optional(),
  business_hours: z.string().max(255, 'Business hours must be less than 255 characters').optional(),
});

const updateAgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required').max(255, 'Agent name must be less than 255 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().min(1, 'Description is required').optional(),
  contact_person_name: z.string().max(255, 'Contact person name must be less than 255 characters').optional(),
  contact_email: z.string().email('Invalid email format').optional().or(z.literal('')),
  contact_phone: z.string().max(50, 'Phone number must be less than 50 characters').optional(),
  signature: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal', 'enthusiastic']).optional(),
  language: z.string().length(2, 'Language must be a 2-letter ISO code').optional(),
  business_hours: z.string().max(255, 'Business hours must be less than 255 characters').optional(),
});

/**
 * Create a new agent
 */
export const createAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validatedData = createAgentSchema.parse(req.body);

    // Get user ID from authenticated request
    const userId = req.user?.id;
    if (!userId) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'User not authenticated',
      };
      res.status(401).json(response);
      return;
    }

    // Get authenticated Supabase client
    const token = req.token;
    if (!token) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'Authentication token not found',
      };
      res.status(401).json(response);
      return;
    }

    const supabase = getAuthenticatedSupabaseClient(token);

    // Insert agent into database
    const { data, error } = await supabase
      .from('agents')
      .insert({
        user_id: userId,
        name: validatedData.name,
        website: validatedData.website || null,
        description: validatedData.description,
        contact_person_name: validatedData.contact_person_name || null,
        contact_email: validatedData.contact_email || null,
        contact_phone: validatedData.contact_phone || null,
        signature: validatedData.signature || null,
        tone: validatedData.tone || 'professional',
        language: validatedData.language || 'en',
        business_hours: validatedData.business_hours || null,
      })
      .select()
      .single();

    if (error) {
      const response: AgentResponse = {
        success: false,
        message: 'Failed to create agent',
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AgentResponse = {
      success: true,
      message: 'Agent created successfully',
      data,
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: AgentResponse = {
        success: false,
        message: 'Validation error',
        error: z.flattenError(error),
      };
      res.status(400).json(response);
      return;
    }

    const response: AgentResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

/**
 * Get all agents for the authenticated user
 */
export const getAgents = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    if (!userId) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'User not authenticated',
      };
      res.status(401).json(response);
      return;
    }

    // Get authenticated Supabase client
    const token = req.token;
    if (!token) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'Authentication token not found',
      };
      res.status(401).json(response);
      return;
    }

    const supabase = getAuthenticatedSupabaseClient(token);

    // Fetch agents from database
    const { data, error } = await supabase.from('agents').select('*').eq('user_id', userId).order('created_at', { ascending: false });

    if (error) {
      const response: AgentResponse = {
        success: false,
        message: 'Failed to fetch agents',
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AgentResponse = {
      success: true,
      message: 'Agents fetched successfully',
      data: data || [],
    };

    res.status(200).json(response);
  } catch (error) {
    const response: AgentResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

/**
 * Get a specific agent by ID
 */
export const getAgentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get user ID from authenticated request
    const userId = req.user?.id;
    if (!userId) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'User not authenticated',
      };
      res.status(401).json(response);
      return;
    }

    // Get authenticated Supabase client
    const token = req.token;
    if (!token) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'Authentication token not found',
      };
      res.status(401).json(response);
      return;
    }

    const supabase = getAuthenticatedSupabaseClient(token);

    // Fetch agent from database
    const { data, error } = await supabase.from('agents').select('*').eq('id', id).eq('user_id', userId).single();

    if (error) {
      const response: AgentResponse = {
        success: false,
        message: 'Agent not found',
        error: error.message,
      };
      res.status(404).json(response);
      return;
    }

    const response: AgentResponse = {
      success: true,
      message: 'Agent fetched successfully',
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: AgentResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

/**
 * Update an existing agent
 */
export const updateAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate request body
    const validatedData = updateAgentSchema.parse(req.body);

    // Check if there's at least one field to update
    if (Object.keys(validatedData).length === 0) {
      const response: AgentResponse = {
        success: false,
        message: 'Validation error',
        error: 'At least one field must be provided for update',
      };
      res.status(400).json(response);
      return;
    }

    // Get user ID from authenticated request
    const userId = req.user?.id;
    if (!userId) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'User not authenticated',
      };
      res.status(401).json(response);
      return;
    }

    // Get authenticated Supabase client
    const token = req.token;
    if (!token) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'Authentication token not found',
      };
      res.status(401).json(response);
      return;
    }

    const supabase = getAuthenticatedSupabaseClient(token);

    // Update agent in database
    const { data, error } = await supabase
      .from('agents')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      const response: AgentResponse = {
        success: false,
        message: 'Failed to update agent',
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AgentResponse = {
      success: true,
      message: 'Agent updated successfully',
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: AgentResponse = {
        success: false,
        message: 'Validation error',
        error: error.issues.map((e) => e.message).join(', '),
      };
      res.status(400).json(response);
      return;
    }

    const response: AgentResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

/**
 * Delete an agent
 */
export const deleteAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get user ID from authenticated request
    const userId = req.user?.id;
    if (!userId) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'User not authenticated',
      };
      res.status(401).json(response);
      return;
    }

    // Get authenticated Supabase client
    const token = req.token;
    if (!token) {
      const response: AgentResponse = {
        success: false,
        message: 'Unauthorized',
        error: 'Authentication token not found',
      };
      res.status(401).json(response);
      return;
    }

    const supabase = getAuthenticatedSupabaseClient(token);

    // Delete agent from database
    const { error } = await supabase.from('agents').delete().eq('id', id).eq('user_id', userId);

    if (error) {
      const response: AgentResponse = {
        success: false,
        message: 'Failed to delete agent',
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AgentResponse = {
      success: true,
      message: 'Agent deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    const response: AgentResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};
