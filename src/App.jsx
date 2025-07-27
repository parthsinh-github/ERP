import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import SharedLayout from './layouts/SharedLayout';
import Document from './components/Document';
import Profile from './components/Profile';

const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));
const Announcement = lazy(() => import('./components/Announcement'));
const LeaveRequest = lazy(() => import('./components/LeaveRequest'));
const IDCard = lazy(() => import('./components/IDCard'));
const Exam = lazy(() => import('./components/Exam'));
const Report = lazy(() => import('./components/Report'));
const AllUsers = lazy(() => import('./components/AllUsers'));

const appRouter = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  {
    path: '/:role/:id',
    element: <SharedLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'leaverequest', element: <LeaveRequest /> },
      { path: 'announcement', element: <Announcement /> },
      { path: 'exam', element: <Exam /> },
      { path: 'report', element: <Report /> },
      { path: 'AllUsers', element: <AllUsers /> },
      { path: 'Document', element: <Document /> },
      { path: 'Profile', element: <Profile /> },
      { path: 'IDCard', element: <IDCard /> },
    ],
  },
]);

function App() {
  return (
    <>
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Page...</div>}>
        <RouterProvider router={appRouter} />
      </Suspense>
         <Toaster position="top-right" reverseOrder={false} />
      {/* Place ToastContainer here as well if needed for SSR/hydration-safe routes */}
    </>
  );
}

export default App;
