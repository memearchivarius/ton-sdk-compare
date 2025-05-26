import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

const dappMetadata = {
  manifestUrl: `${BASE_URL}/tonconnect-manifest.json`,
  items: [
    {
      name: 'TON SDK Compare',
      url: BASE_URL
    }
  ]
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={dappMetadata.manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
); 