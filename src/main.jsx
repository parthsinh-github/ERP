import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import store, { persistor } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
  
const App = lazy(() => import('./App.jsx'));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<div>Loading...</div>}>
          <HelmetProvider>
            <App />
            <ToastContainer position="top-right" autoClose={3000} />
          </HelmetProvider>
        </Suspense>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
