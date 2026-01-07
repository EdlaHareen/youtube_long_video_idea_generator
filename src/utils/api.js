const API_URL = 'https://n8n.srv1162636.hstgr.cloud/webhook/96826df0-6cdc-42b4-bd81-cb0e3f0eff45';
const TIMEOUT_MS = 900000; // 15 minutes (900,000 milliseconds)

export async function fetchVideoIdeas(keyword, channelBrief) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    console.log('Sending request to n8n webhook...', { keyword, channelBrief });
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword,
        channelBrief,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw response data:', JSON.stringify(data, null, 2));
    console.log('Response data type:', typeof data);
    console.log('Is array?', Array.isArray(data));
    console.log('Data keys:', Object.keys(data || {}));

    // Handle different response formats from n8n
    let results = null;

    // Check various possible locations for results
    if (data.results && Array.isArray(data.results)) {
      results = data.results;
      console.log('Found results in data.results:', results.length);
    } else if (Array.isArray(data)) {
      results = data;
      console.log('Response is directly an array:', results.length);
    } else if (data.data && Array.isArray(data.data)) {
      results = data.data;
      console.log('Found results in data.data:', results.length);
    } else if (data.body && Array.isArray(data.body)) {
      results = data.body;
      console.log('Found results in data.body:', results.length);
    } else if (data.output && Array.isArray(data.output)) {
      results = data.output;
      console.log('Found results in data.output:', results.length);
    } else if (data.items && Array.isArray(data.items)) {
      results = data.items;
      console.log('Found results in data.items:', results.length);
    } else {
      // Try to find any array in the response
      const possibleResults = Object.values(data || {}).find(val => Array.isArray(val) && val.length > 0);
      if (possibleResults) {
        results = possibleResults;
        console.log('Found results array in response:', results.length);
      }
    }

    if (!results || !Array.isArray(results) || results.length === 0) {
      console.error('No valid results array found in response');
      console.error('Full response structure:', JSON.stringify(data, null, 2));
      throw new Error('No results found in API response. Please check the n8n workflow output format.');
    }

    // Normalize the results to match the expected format
    // n8n might return field names in different cases or formats
    const normalizedResults = results.map((item, index) => {
      // Handle both direct field access and json property access
      const video = item.json || item;
      
      // Extract newTitle - it might be a JSON string from n8n
      let newTitle = video.newTitle || video['New Title'] || video.new_title || '';
      
      // If newTitle is a JSON string, parse it but keep the original structure
      // The VideoCard component will handle the parsing
      if (typeof newTitle === 'string' && newTitle.trim().startsWith('{')) {
        // Keep as is, VideoCard will parse it
      } else if (!newTitle && video['New Title']) {
        newTitle = video['New Title'];
      }
      
      // Extract generated thumbnail URL - check multiple possible locations
      // The n8n "Generate an image1" node returns the URL in output[0].url
      // The "Update Rows" node maps it to "Thumbnail_url" field
      let generatedThumbnailUrl = '';
      
      // First, check the "Thumbnail_url" field from Update Rows mapping
      if (video['Thumbnail_url'] || video.Thumbnail_url || video.thumbnail_url) {
        generatedThumbnailUrl = video['Thumbnail_url'] || video.Thumbnail_url || video.thumbnail_url;
      }
      // Check various other possible field names
      else if (video.generatedThumbnailUrl) {
        generatedThumbnailUrl = video.generatedThumbnailUrl;
      } else if (video['Generated Thumbnail']) {
        generatedThumbnailUrl = video['Generated Thumbnail'];
      } else if (video['Generated Thumbnail URL']) {
        generatedThumbnailUrl = video['Generated Thumbnail URL'];
      } else if (video.generated_thumbnail) {
        generatedThumbnailUrl = video.generated_thumbnail;
      } else if (video.generated_thumbnail_url) {
        generatedThumbnailUrl = video.generated_thumbnail_url;
      } else if (video.newThumbnailUrl) {
        generatedThumbnailUrl = video.newThumbnailUrl;
      } else if (video.new_thumbnail_url) {
        generatedThumbnailUrl = video.new_thumbnail_url;
      } else if (video.imageUrl) {
        generatedThumbnailUrl = video.imageUrl;
      } else if (video.image_url) {
        generatedThumbnailUrl = video.image_url;
      }
      // Check nested structures from Generate an image node
      else if (video.output && Array.isArray(video.output) && video.output[0] && video.output[0].url) {
        // Check if it's in output[0].url (from Generate an image node)
        generatedThumbnailUrl = video.output[0].url;
      } else if (video.json && video.json.output && Array.isArray(video.json.output) && video.json.output[0] && video.json.output[0].url) {
        // Check nested json.output[0].url
        generatedThumbnailUrl = video.json.output[0].url;
      }
      // Check if referenced by node name (n8n sometimes includes node outputs)
      else if (video['Generate an image1']) {
        const genImage = video['Generate an image1'];
        if (genImage.url) {
          generatedThumbnailUrl = genImage.url;
        } else if (genImage.output && Array.isArray(genImage.output) && genImage.output[0] && genImage.output[0].url) {
          generatedThumbnailUrl = genImage.output[0].url;
        } else if (genImage.json && genImage.json.output && Array.isArray(genImage.json.output) && genImage.json.output[0] && genImage.json.output[0].url) {
          generatedThumbnailUrl = genImage.json.output[0].url;
        }
      }
      
      // If we found a URL that looks like an image URL (contains blob.core.windows.net or similar image hosting)
      // and it's different from the video URL, use it
      if (!generatedThumbnailUrl) {
        const videoUrl = video.url || video.Url || '';
        // Check if the URL is an image URL (not a YouTube URL)
        if (videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be') && 
            (videoUrl.includes('blob.core.windows.net') || videoUrl.includes('.png') || videoUrl.includes('.jpg') || videoUrl.includes('.jpeg') || videoUrl.includes('dalleapi'))) {
          generatedThumbnailUrl = videoUrl;
        }
      }
      
      // Log for debugging
      if (generatedThumbnailUrl) {
        console.log(`Found generated thumbnail URL for video ${index}:`, generatedThumbnailUrl);
      } else {
        console.log(`No generated thumbnail URL found for video ${index}. Available keys:`, Object.keys(video));
      }
      
      // Handle both YouTube and Instagram content
      // Instagram posts might have different field names
      const isInstagram = video.instagram || video['Instagram'] || video.caption || video['Instagram Caption'] || 
                         video.postUrl || (video.url && !video.url.includes('youtube.com') && !video.url.includes('youtu.be'));
      
      return {
        id: video.id || video.Id || video.videoId || video.postId || `content-${index}`,
        title: video.title || video.Title || video.originalTitle || video.caption || video['Instagram Caption'] || '',
        newTitle: newTitle || video.title || video.caption || '',
        thumbnailUrl: video.thumbnailUrl || video.Thumbnailurl || video.thumbnail_url || video.thumbnail || 
                     video.imageUrl || video.image_url || video.mediaUrl || '',
        channelName: video.channelName || video.Channelname || video.channel_name || video.channel || 
                    video.accountName || video.username || video.author || '',
        viewCount: parseInt(video.viewCount || video.Viewcount || video.view_count || video.views || 
                          video.likes || video.engagement || 0, 10),
        likes: parseInt(video.likes || video.Likes || video.like_count || 
                       video.engagement || video.interactions || 0, 10),
        url: video.url || video.Url || video.videoUrl || video.video_url || 
            video.postUrl || video.post_url || video.permalink || '',
        ideaContent: video.ideaContent || video['Idea Content'] || video.idea_content || video.outline || 
                    video.content || video.caption || video['Instagram Caption'] || '',
        duration: video.duration || video.Duration || '',
        thumbnailText: video.thumbnailText || video['Thumbnail Text'] || video.thumbnail_text || '',
        generatedThumbnailUrl: generatedThumbnailUrl,
        contentType: isInstagram ? 'instagram' : 'youtube', // Track content type for future use
      };
    });

    console.log('Normalized results:', normalizedResults.length, 'items');
    console.log('Sample normalized result:', normalizedResults[0]);
    console.log('Generated thumbnail URL in first result:', normalizedResults[0]?.generatedThumbnailUrl);
    
    // Log all keys from the first video to help debug
    if (normalizedResults.length > 0 && results.length > 0) {
      const firstVideo = results[0].json || results[0];
      console.log('All keys in first video from n8n:', Object.keys(firstVideo || {}));
      console.log('First video full data:', JSON.stringify(firstVideo, null, 2));
      
      // Check for Instagram-specific fields
      if (firstVideo.instagram || firstVideo['Instagram'] || firstVideo.caption || firstVideo['Instagram Caption']) {
        console.log('Instagram content detected in response');
        console.log('Instagram fields:', {
          caption: firstVideo.caption || firstVideo['Instagram Caption'] || firstVideo.instagram?.caption,
          postUrl: firstVideo.postUrl || firstVideo.url || firstVideo.instagram?.url,
          imageUrl: firstVideo.imageUrl || firstVideo.thumbnailUrl || firstVideo.instagram?.imageUrl,
        });
      }
    }
    
    return { success: true, results: normalizedResults };
  } catch (error) {
    clearTimeout(timeoutId);

    console.error('API request error:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The workflow may still be processing. Please check n8n and try again.');
    }

    if (error.message.includes('fetch') || error.message.includes('Network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    throw error;
  }
}
