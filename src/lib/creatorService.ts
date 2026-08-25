import { supabase } from './supabase';
import type { Database } from '../types/database.types';

type Project = Database['public']['Tables']['projects_studio']['Row'];
type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];
type ProductionJob = Database['public']['Tables']['production_jobs_studio']['Row'];

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
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects_studio')
    .insert({
      user_id: userData.user.id,
      name,
      description,
      status: 'DRAFT',
    } as any)
    .select()
    .single();

  if (error) throw error;
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

export async function getMediaAssetById(id: string) {
  const { data, error } = await supabase
    .from('media_assets_studio')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as MediaAsset;
}

export async function updateMediaAsset(id: string, updates: Partial<Database['public']['Tables']['media_assets_studio']['Update']>) {
  const { data, error } = await supabase
    .from('media_assets_studio')
    // @ts-ignore
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as MediaAsset;
}

export async function deleteMediaAsset(id: string, storagePath: string) {
  // First delete from storage
  const { error: storageError } = await supabase.storage
    .from('creator-content')
    .remove([storagePath]);
  
  if (storageError) console.error('Failed to delete file from storage', storageError);

  // Then delete the DB record
  const { error } = await supabase
    .from('media_assets_studio')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// PRODUCTION JOBS
export async function submitForProduction(mediaAssetId: string, notes?: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  // Create job
  const { data: job, error: jobError } = await supabase
    .from('production_jobs_studio')
    .insert({
      media_asset_id: mediaAssetId,
      user_id: userData.user.id,
      status: 'SUBMITTED',
      notes,
    } as any)
    .select()
    .single();

  if (jobError) throw jobError;

  // Update asset status
  await supabase
    .from('media_assets_studio')
    // @ts-ignore
    .update({ status: 'SUBMITTED' } as any)
    .eq('id', mediaAssetId);

  return job as ProductionJob;
}

// FILE UPLOAD
export async function uploadMediaFile(
  file: File
) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${userData.user.id}/${fileName}`;

  // Direct upload for now (could be improved with multipart for very large files)
  const { error: uploadError } = await supabase.storage
    .from('creator-content')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Create DB record
  const { data: asset, error: dbError } = await supabase
    .from('media_assets_studio')
    .insert({
      user_id: userData.user.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: filePath,
      status: 'UPLOADED',
    } as any)
    .select()
    .single();

  if (dbError) {
    // Cleanup storage if DB insert fails
    await supabase.storage.from('creator-content').remove([filePath]);
    throw dbError;
  }

  return asset as MediaAsset;
}

// FALLBACK FOR LOCAL TESTING
export async function createMockMediaAsset(file: File) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  
  // Just insert the DB record without doing storage upload
  const { data: asset, error: dbError } = await supabase
    .from('media_assets_studio')
    .insert({
      user_id: userData.user.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: `mock_path/${fileName}`,
      status: 'UPLOADED',
    } as any)
    .select()
    .single();

  if (dbError) throw dbError;

  return asset as MediaAsset;
}

// SECURE URL GENERATION
export async function getSecureMediaUrl(storagePath: string) {
  if (storagePath.startsWith('onedrive:')) {
    const fileId = storagePath.replace('onedrive:', '');
    return `http://localhost:3000/api/documents/${fileId}/stream`;
  }
  
  if (storagePath.startsWith('mock_path/')) {
    // Cannot generate secure URLs for mock local testing paths
    return null;
  }

  const { data, error } = await supabase.storage
    .from('creator-content')
    .createSignedUrl(storagePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}
