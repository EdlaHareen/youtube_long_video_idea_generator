import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

console.log('main.tsx: Starting to load...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('main.tsx: Root element found, importing modules...');

Promise.all([
  import('./App.jsx'),
  import('./contexts/AuthContext.jsx')
]).then(([{ default: App }, { AuthProvider }]) => {
  console.log('main.tsx: Modules loaded, rendering React app...');
  
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
  
  console.log('main.tsx: React app rendered successfully!');
}).catch((error) => {
  console.error('main.tsx: Error loading or rendering app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; background: #ff0000; color: white; font-family: monospace;">
      <h1>Error Loading App</h1>
      <p><strong>${error.message}</strong></p>
      <pre style="background: #000; padding: 10px; overflow: auto;">${error.stack}</pre>
    </div>
  `;
});
