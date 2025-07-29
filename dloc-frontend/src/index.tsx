import 'styles/index.style.css';
import { configApp } from 'config/configApp';
import { DevicesProvider } from 'providers/DevicesProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from 'providers/UserProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

document.title = configApp.appName;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={configApp.googleAuht0ClientId}>
    <React.StrictMode>
      <DevicesProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </DevicesProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
