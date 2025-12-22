import { supabase } from '../lib/supabase';

/**
 * Save search history for a user
 */
export async function saveSearchHistory(userId, keyword, channelBrief, results) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    // Supabase not configured, save to localStorage as fallback
    try {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      history.unshift({
        userId,
        keyword,
        channelBrief,
        resultsCount: results?.length || 0,
        timestamp: new Date().toISOString(),
      });
      // Keep only last 50 searches
      const limitedHistory = history.slice(0, 50);
      localStorage.setItem('searchHistory', JSON.stringify(limitedHistory));
    } catch (error) {
      console.warn('Failed to save search history to localStorage:', error);
    }
    return;
  }

  try {
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        keyword,
        channel_brief: channelBrief,
        results_count: results?.length || 0,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving search history:', error);
    throw error;
  }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(userId) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    // Supabase not configured, get from localStorage as fallback
    try {
      const prefs = localStorage.getItem(`userPreferences_${userId}`);
      return prefs ? JSON.parse(prefs) : null;
    } catch (error) {
      console.warn('Failed to get preferences from localStorage:', error);
      return null;
    }
  }

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which is fine
      throw error;
    }

    return data?.preferences || null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return null;
  }
}

/**
 * Save user preferences
 */
export async function saveUserPreferences(userId, preferences) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    // Supabase not configured, save to localStorage as fallback
    try {
      localStorage.setItem(`userPreferences_${userId}`, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error);
    }
    return;
  }

  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        preferences,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
}
