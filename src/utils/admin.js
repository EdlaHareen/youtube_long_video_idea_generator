import { supabase } from '../lib/supabase';

/**
 * Check if a user is an admin
 * Currently hardcoded to check for edlahareen02@gmail.com
 */
export function isAdmin(user) {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === 'edlahareen02@gmail.com';
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Get user with statistics (searches count, favorites count)
 */
export async function getUserWithStats(userId) {
  try {
    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Get search count
    const { count: searchCount } = await supabase
      .from('search_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get favorites count
    const { count: favoritesCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      ...user,
      searchCount: searchCount || 0,
      favoritesCount: favoritesCount || 0,
    };
  } catch (error) {
    console.error('Error fetching user with stats:', error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUser(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId) {
  try {
    // Delete user will cascade to related records due to ON DELETE CASCADE
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Get all search history with filters
 */
export async function getAllSearchHistory(filters = {}) {
  try {
    let query = supabase
      .from('search_history')
      .select(`
        *,
        user:users!search_history_user_id_fkey(email, name)
      `)
      .order('created_at', { ascending: false });

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    if (filters.keyword) {
      query = query.ilike('keyword', `%${filters.keyword}%`);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching search history:', error);
    throw error;
  }
}

/**
 * Delete search history entries
 */
export async function deleteSearchHistory(ids) {
  try {
    const { error } = await supabase
      .from('search_history')
      .delete()
      .in('id', Array.isArray(ids) ? ids : [ids]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting search history:', error);
    throw error;
  }
}

/**
 * Get all favorites with filters
 */
export async function getAllFavorites(filters = {}) {
  try {
    let query = supabase
      .from('favorites')
      .select(`
        *,
        user:users!favorites_user_id_fkey(email, name)
      `)
      .order('created_at', { ascending: false });

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

/**
 * Delete favorites
 */
export async function deleteFavorites(ids) {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .in('id', Array.isArray(ids) ? ids : [ids]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting favorites:', error);
    throw error;
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics() {
  try {
    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // New users this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: newUsersThisWeek } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());

    // Total searches
    const { count: totalSearches } = await supabase
      .from('search_history')
      .select('*', { count: 'exact', head: true });

    // Total favorites
    const { count: totalFavorites } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true });

    // User growth over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: userGrowth } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Searches per day (last 30 days)
    const { data: searchesData } = await supabase
      .from('search_history')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Most popular keywords
    const { data: allSearches } = await supabase
      .from('search_history')
      .select('keyword');

    // Process keyword frequency
    const keywordCounts = {};
    if (allSearches) {
      allSearches.forEach(search => {
        const keyword = search.keyword?.toLowerCase().trim();
        if (keyword) {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        }
      });
    }

    const popularKeywords = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Most favorited videos
    const { data: allFavorites } = await supabase
      .from('favorites')
      .select('video_data');

    const videoCounts = {};
    if (allFavorites) {
      allFavorites.forEach(fav => {
        const videoData = fav.video_data;
        if (videoData && videoData.id) {
          const videoId = videoData.id;
          if (!videoCounts[videoId]) {
            videoCounts[videoId] = {
              count: 0,
              title: videoData.title || 'Unknown',
              channelName: videoData.channelName || 'Unknown',
            };
          }
          videoCounts[videoId].count++;
        }
      });
    }

    const mostFavorited = Object.values(videoCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalUsers: totalUsers || 0,
      newUsersThisWeek: newUsersThisWeek || 0,
      totalSearches: totalSearches || 0,
      totalFavorites: totalFavorites || 0,
      userGrowth: userGrowth || [],
      searchesData: searchesData || [],
      popularKeywords,
      mostFavorited,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

/**
 * Export data to CSV
 */
export function exportToCSV(data, filename = 'export') {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle nested objects (e.g., user: { email, name })
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value || '').replace(/"/g, '""');
        return stringValue.includes(',') || stringValue.includes('\n')
          ? `"${stringValue}"`
          : stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

