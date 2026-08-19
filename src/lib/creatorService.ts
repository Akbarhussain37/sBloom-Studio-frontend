import { supabase } from './supabase';
import type { Database } from '../types/database.types';

type Project = Database['public']['Tables']['projects_studio']['Row'];
type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

// PROJECTS
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects_studio')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Project[];
}

export async function createProject(name: string, description?: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  const payload: Database['public']['Tables']['projects_studio']['Insert'] = {
    user_id: user.id,
    name: name.trim(),
    status: 'DRAFT'
  };

  if (description && description.trim()) {
    payload.description = description.trim();
  }

  const query = supabase
    .from('projects_studio')
    .insert([payload as never])
    .select()
    .single();
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as Project;
}

// MEDIA ASSETS
export async function getMediaAssets(projectId?: string) {
  let query = supabase
    .from('media_assets_studio')
    .select('*')
    .order('created_at', { ascending: false });

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as MediaAsset[];
}
