import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import store, { persistor } from './redux/store.js'; // or './redux/store' — your actual path
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';


const App = lazy(() => import('./App.jsx'));

createRoot(document.getElementById('root')).render(
  <Suspense >
    <React.StrictMode>
    <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>  {/* ✅ Add this */}
      <App />
           </PersistGate>
    </Provider>
  </React.StrictMode>
  </Suspense>
);
