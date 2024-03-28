import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/util/ErrorPage';
import HomePage from './pages/HomePage';
import ActivitiesRootLayout from './pages/activities/ActivitiesRootLayout';
import ActivitiesPage from './pages/activities/ActivitiesPage';
import MyPage from './pages/MyPage';
import LoginPage, { action as loginAction } from './pages/auth/LoginPage';
import GoogleOAuthPage, { action as googleOAuthAction } from './pages/auth/googleOAuth';
import LoginLayout from './pages/auth/LoginLayout';
import SignUpPage, { action as signUpAction } from './pages/auth/SignUpPage';
import { action as logoutAction } from './pages/auth/logout';
import { checkAuthLoader, loader as tokenLoader } from './pages/util/checkAuth';
import OAuthRedirectPage from './pages/auth/OAuthRedirectPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    loader: tokenLoader,
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
            path: 'signup',
            element: <SignUpPage />,
            action: signUpAction
          },
          {
            path: 'callback',
            element: <OAuthRedirectPage />
          }
        ]
      },
      {
        path: 'my-page',
        errorElement: <ErrorPage />,
        loader: checkAuthLoader,
        children: [
          { index: true, element: <MyPage /> }
        ]
      },
      {
        path: 'logout',
        action: logoutAction,
      },
    ],
  }
]);

export const API_URL = 'http://localhost:8080';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
