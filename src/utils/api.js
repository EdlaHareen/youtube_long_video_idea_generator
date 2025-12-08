const API_URL = 'https://n8n.srv1162636.hstgr.cloud/webhook-test/96826df0-6cdc-42b4-bd81-cb0e3f0eff45';
const TIMEOUT_MS = 180000;

export async function fetchVideoIdeas(keyword, channelBrief) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
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

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    throw error;
  }
}
