// Export utilities for PDF, CSV, and Markdown

export function exportToCSV(videos, filename = 'video-ideas') {
  const headers = ['Title', 'New Title', 'Channel', 'Views', 'Likes', 'URL', 'Outline'];
  
  const rows = videos.map(video => [
    `"${(video.title || '').replace(/"/g, '""')}"`,
    `"${(video.newTitle || '').replace(/"/g, '""')}"`,
    `"${(video.channelName || '').replace(/"/g, '""')}"`,
    video.viewCount || 0,
    video.likes || 0,
    video.url || '',
    `"${(video.ideaContent || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

export function exportToMarkdown(videos, filename = 'video-ideas') {
  let markdown = `# Video Ideas\n\n`;
  markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`;
  markdown += `---\n\n`;

  videos.forEach((video, index) => {
    markdown += `## ${index + 1}. ${video.newTitle || video.title}\n\n`;
    markdown += `**Original Title:** ${video.title}\n\n`;
    markdown += `**Channel:** ${video.channelName}\n\n`;
    markdown += `**Stats:** 👁️ ${video.viewCount || 0} views | 👍 ${video.likes || 0} likes\n\n`;
    markdown += `**URL:** ${video.url}\n\n`;
    
    if (video.ideaContent) {
      markdown += `### Outline\n\n`;
      markdown += `${video.ideaContent}\n\n`;
    }
    
    markdown += `---\n\n`;
  });

  downloadFile(markdown, `${filename}.md`, 'text/markdown');
}

export function exportToPDF(videos, filename = 'video-ideas') {
  // For PDF, we'll use a simple HTML approach that can be printed
  // For a more robust solution, you'd use a library like jsPDF or pdfmake
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Video Ideas</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        h1 {
          color: #000;
          border-bottom: 2px solid #22c55e;
          padding-bottom: 10px;
        }
        h2 {
          color: #000;
          margin-top: 30px;
          border-left: 4px solid #22c55e;
          padding-left: 10px;
        }
        .video-item {
          margin-bottom: 40px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .meta {
          color: #666;
          font-size: 14px;
          margin: 10px 0;
        }
        .outline {
          background: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          margin-top: 15px;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.6;
        }
        .stats {
          display: inline-block;
          margin-right: 15px;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .video-item { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>Video Ideas</h1>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Total Ideas:</strong> ${videos.length}</p>
  `;

  videos.forEach((video, index) => {
    html += `
      <div class="video-item">
        <h2>${index + 1}. ${escapeHtml(video.newTitle || video.title)}</h2>
        <div class="meta">
          <strong>Original Title:</strong> ${escapeHtml(video.title)}<br>
          <strong>Channel:</strong> ${escapeHtml(video.channelName)}<br>
          <span class="stats"><strong>Views:</strong> ${video.viewCount || 0}</span>
          <span class="stats"><strong>Likes:</strong> ${video.likes || 0}</span><br>
          <strong>URL:</strong> <a href="${video.url}">${video.url}</a>
        </div>
        ${video.ideaContent ? `
          <div class="outline">
            <strong>Full Outline:</strong><br>
            ${escapeHtml(video.ideaContent)}
          </div>
        ` : ''}
      </div>
    `;
  });

  html += `
      </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}






