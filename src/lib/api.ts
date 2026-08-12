import { supabase } from './supabase';
import type { Database } from '../types/database.types';

type ProfileUpdate = Database['public']['Tables']['profile_studio']['Update'];
type BookingInsert = Database['public']['Tables']['bookings_studio']['Insert'];
type ContactInsert = Database['public']['Tables']['contact_submissions_studio']['Insert'];

/**
 * Fetches the user profile by user ID.
 */
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profile_studio')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    throw error;
  }
  return data;
};

/**
 * Updates a user profile.
 */
export const updateProfile = async (userId: string, updates: ProfileUpdate) => {
  const query = supabase
    .from('profile_studio')
    // @ts-ignore
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  const { data, error } = await query;

  if (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
  return data;
};

/**
 * Creates a new booking submission.
 */
export const createBooking = async (booking: BookingInsert) => {
  const query = supabase
    .from('bookings_studio')
    // @ts-ignore
    .insert([booking])
    .select()
    .single();
  const { data, error } = await query;

  if (error) {
    console.error('Error creating booking:', error.message);
    throw error;
  }
  return data;
};

/**
 * Submits the contact form.
 */
export const submitContactForm = async (submission: ContactInsert) => {
  const query = supabase
    .from('contact_submissions_studio')
    // @ts-ignore
    .insert([submission])
    .select()
    .single();
  const { data, error } = await query;

  if (error) {
    console.error('Error submitting contact form:', error.message);
    throw error;
  }
  return data;
};

/**
 * Uploads an image to the profile_images_studio storage bucket.
 * The file is placed in a folder named after the user's ID.
 */
export const uploadProfileImage = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('profile_images_studio')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError.message);
    throw uploadError;
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('profile_images_studio')
    .getPublicUrl(filePath);

  // Insert record into profile_images_studio table
  const query = supabase
    .from('profile_images_studio')
    // @ts-ignore
    .insert([{ user_id: userId, image_url: publicUrlData.publicUrl }])
    .select()
    .single();
    
  const { data, error } = await query;

  if (error) {
    console.error('Error saving image reference:', error.message);
    throw error;
  }
  return data;
};

/**
 * Fetches all images for a specific user.
 */
export const getProfileImages = async (userId: string) => {
  const { data, error } = await supabase
    .from('profile_images_studio')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching images:', error.message);
    throw error;
  }
  return data;
};
