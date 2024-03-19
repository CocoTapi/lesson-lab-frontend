import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import ActivitiesRootLayout from './pages/ActivitiesRootLayout';
import ActivitiesPage from './pages/ActivitiesPage';
import MyPage from './pages/MyPage';
import LoginPage, { action as loginAction } from './pages/auth/LoginPage';
import { action as googleOAuthAction } from './pages/auth/googleOAuth';
import LoginLayout from './pages/auth/LoginLayout';
import SignUpPage, { action as signUpAction } from './pages/auth/SignUpPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { 
        path: 'activities',
        element: <ActivitiesRootLayout />,
        children: [
          { index: true, element: <ActivitiesPage />}
        ]
      },
      {
        path: 'auth',
        element: <LoginLayout />,
        children: [
          {
            index: true,
            element: <LoginPage />,
            action: loginAction
          },
          {
            path: 'google',
            action: googleOAuthAction
          },
          {
            path: 'sign-up',
            element: <SignUpPage />,
            action: signUpAction
          }
        ]
      },
      {
        path: 'my-page',
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <MyPage /> }
        ]
      },
      {
        path: 'logout',
      }
    ],
  }
]);

export const API_URL = 'http://localhost:8080/';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
