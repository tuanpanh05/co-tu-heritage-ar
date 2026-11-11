import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Font tự host, hỗ trợ đầy đủ tiếng Việt (không phụ thuộc Google Fonts CDN)
import '@fontsource/be-vietnam-pro/300.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/400-italic.css';
import '@fontsource-variable/lora/wght.css';
import '@fontsource-variable/lora/wght-italic.css';

import './index.css';

// Import model-viewer for WebAR rendering
import '@google/model-viewer';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

