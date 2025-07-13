import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
  

  // ✅ Only this dynamic route — no hardcoded /student/:id etc.
  {
    path: '/:role/:id',
    element: <SharedLayout />,
    children: [
      { index: true, element: <Home /> }, // This Home includes CardsSection
      { path: 'leaverequest', element: <LeaveRequest /> },
      { path: 'announcement', element: <Announcement /> },
      { path: 'exam', element: <Exam /> },
      { path: 'report', element: <Report /> },
      { path: 'AllUsers', element: <AllUsers /> },
      { path: 'Document', element: <Document /> },
      { path: 'Profile', element: <Profile /> },
    ]
  },
]);

function App() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Page...</div>}>
      <RouterProvider router={appRouter} />
    </Suspense>
  );
}

export default App;
