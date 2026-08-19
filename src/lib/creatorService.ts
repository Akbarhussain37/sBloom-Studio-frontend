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
