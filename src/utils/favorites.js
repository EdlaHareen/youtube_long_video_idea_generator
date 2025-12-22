// Favorites management - Supabase only

import { supabase } from '../lib/supabase';

// Get favorites from Supabase
export async function getFavorites(userId) {
  if (!userId) {
    return [];
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    throw new Error('Supabase is not configured');
  }

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('video_data')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Extract video data from JSONB
    return data.map(item => item.video_data);
  } catch (error) {
    console.error('Error getting favorites from Supabase:', error);
    throw error;
  }
}

// Save favorite to Supabase
export async function saveFavorite(video, userId) {
  if (!userId) {
    throw new Error('User must be authenticated to save favorites');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    throw new Error('Supabase is not configured');
  }

  try {
    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('video_id', video.id || video.videoId)
      .single();

    if (existing) {
      return false; // Already favorited
    }

    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        video_id: video.id || video.videoId || String(Date.now()),
        video_data: video,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving favorite to Supabase:', error);
    throw error;
  }
}

// Remove favorite from Supabase
export async function removeFavorite(videoId, userId) {
  if (!userId) {
    throw new Error('User must be authenticated to remove favorites');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    throw new Error('Supabase is not configured');
  }

  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('video_id', videoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing favorite from Supabase:', error);
    throw error;
  }
}

// Check if video is favorited
export async function isFavorite(videoId, userId) {
  if (!userId) {
    return false;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which is fine
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

// Clear all favorites for a user
export async function clearFavorites(userId) {
  if (!userId) {
    throw new Error('User must be authenticated to clear favorites');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    throw new Error('Supabase is not configured');
  }

  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
}






