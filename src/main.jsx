import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import store from './redux/store.js'; // or './redux/store' — your actual path
import { Provider } from 'react-redux';


const App = lazy(() => import('./App.jsx'));

createRoot(document.getElementById('root')).render(
  <Suspense >
    <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
  </Suspense>
);
