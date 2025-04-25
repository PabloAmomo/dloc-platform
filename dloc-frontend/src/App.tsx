import { BrowserRouter } from 'react-router-dom';
import { configApp } from 'config/configApp';
import { DeviceFormProvider } from 'providers/DeviceFormProvider';
import { initReactI18next } from 'react-i18next';
import { WebsocketProvider } from 'providers/WebsocketProvider';
import configI18n from 'config/configI18n';
import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import RoutesApp from 'routesApp/RoutesApp';

/** Set i18n config */
i18n.use(I18nextBrowserLanguageDetector).use(initReactI18next).init(configI18n);

function App() {
  return (
    <WebsocketProvider url={configApp.webSocket.url}>
      <BrowserRouter>
        <DeviceFormProvider>
          <RoutesApp />
        </DeviceFormProvider>
      </BrowserRouter>
    </WebsocketProvider>
  );
}

export default App;
