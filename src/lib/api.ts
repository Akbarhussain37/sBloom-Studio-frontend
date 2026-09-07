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
    .eq('id', userId);
    
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

/**
 * Uploads a document to the backend integration for OneDrive.
 */
export const uploadDocument = async (file: File, userName?: string, userEmail?: string, userPhone?: string, instructions?: string, userRole?: string, requirements?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (userName) formData.append('userName', userName);
  if (userEmail) formData.append('userEmail', userEmail);
  if (userPhone) formData.append('userPhone', userPhone);
  if (instructions) formData.append('instructions', instructions);
  if (userRole) formData.append('userRole', userRole);
  if (requirements) formData.append('requirements', requirements);

  const response = await fetch('http://localhost:3000/api/upload-document', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.details ? errorData.error + ': ' + errorData.details : errorData.error;
    throw new Error(errorMessage || 'Failed to upload document');
  }

  return response.json();
};

// ==========================================


// CHAT MODULE API CALLS
// ==========================================

const getAuthToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

/**
 * Fetches all chat messages for a given job ID via the Node.js backend
 */
export const fetchChatMessages = async (jobId: string, chatType: string = 'public') => {
  const token = await getAuthToken();
  const response = await fetch(`http://localhost:3000/api/messages/${jobId}?chatType=${chatType}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch messages from backend');
  return response.json();
};

/**
 * Sends a chat message via the Node.js backend
 */
export const sendChatMessage = async (jobId: string, senderId: string, content: string, chatType: string = 'public') => {
  const token = await getAuthToken();
  const response = await fetch('http://localhost:3000/api/messages', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ jobId, senderId, content, chatType }),
  });
  
  if (!response.ok) throw new Error('Failed to send message via backend');
  return response.json();
};

/**
 * Marks unread messages as read for a specific job via the Node.js backend
 */
export const markChatAsRead = async (jobId: string, currentUserId: string, chatType: string = 'public') => {
  const token = await getAuthToken();
  const response = await fetch('http://localhost:3000/api/messages/read', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ jobId, currentUserId, chatType }),
  });
  
  if (!response.ok) throw new Error('Failed to mark messages as read via backend');
  
  // Dispatch custom event to notify components like Sidebar to update unread counts
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('chatReadUpdate'));
  }
  
  return response.json();
};

/**
 * Fetches unread message counts across all jobs for the current user
 */
export const fetchUnreadCounts = async (userId: string, chatType: string = 'public') => {
  const token = await getAuthToken();
  const response = await fetch(`http://localhost:3000/api/messages/unread/counts?userId=${userId}&chatType=${chatType}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch unread counts via backend');
  return response.json();
};

/**
 * Deletes a chat message by ID via backend.
 */
export const deleteChatMessage = async (messageId: string, jobId: string) => {
  const token = await getAuthToken();
  const response = await fetch(`http://localhost:3000/api/messages/${messageId}?jobId=${jobId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Failed to delete message via backend');
  return response.json();
};

/**
 * Deletes an entire chat for a given job ID via backend.
 */
export const deleteEntireChat = async (jobId: string) => {
  const token = await getAuthToken();
  const response = await fetch(`http://localhost:3000/api/messages/chat/${jobId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Failed to delete chat via backend');
  return response.json();
};
