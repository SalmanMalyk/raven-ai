export interface Agent {
  id: string;
  user_id: string;
  name: string;
  website?: string;
  description: string;
  contact_person_name?: string;
  contact_email?: string;
  contact_phone?: string;
  signature?: string;
  tone?: string;
  language?: string;
  business_hours?: string;
  keywords?: string[];
  match_all_keywords?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentRequest {
  name: string;
  website?: string;
  description: string;
  contact_person_name?: string;
  contact_email?: string;
  contact_phone?: string;
  signature?: string;
  tone?: string;
  language?: string;
  business_hours?: string;
  keywords?: string[];
  match_all_keywords?: boolean;
}

export interface UpdateAgentRequest {
  name?: string;
  website?: string;
  description?: string;
  contact_person_name?: string;
  contact_email?: string;
  contact_phone?: string;
  signature?: string;
  tone?: string;
  language?: string;
  business_hours?: string;
  keywords?: string[];
  match_all_keywords?: boolean;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: Agent | Agent[];
  error?: string | object;
}
