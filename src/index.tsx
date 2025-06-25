import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import cryptoPolyfill from 'isomorphic-webcrypto';

if (!window.crypto || !window.crypto.subtle) {
  Object.defineProperty(window, 'crypto', {
    value: cryptoPolyfill,
    writable: true,
  });
}

// FIXME Attempts at polyfilling the crypto for http-only env
console.log(
  window.crypto.subtle.digest('SHA-256', new Buffer([]))
);

const root = ReactDOM.createRoot(
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint.
reportWebVitals();
