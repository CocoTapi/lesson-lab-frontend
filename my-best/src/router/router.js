import { createBrowserRouter } from "react-router-dom";
import RootLayout from '../pages/RootLayout';
import ErrorPage from '../pages/util/ErrorPage';
import HomePage from '../pages/HomePage';
import ActivitiesRootLayout from '../pages/activities/ActivitiesRootLayout';
import ActivitiesPage, { loader as activitiesLoader} from '../pages/activities/ActivitiesPage';
import MyPage from '../pages/MyPage';
import LoginPage, { action as loginAction } from '../pages/auth/LoginPage';
import LoginLayout from '../pages/auth/LoginLayout';
import SignUpPage, { action as signUpAction } from '../pages/auth/SignUpPage';
import { action as logoutAction } from '../pages/auth/logout';
import { checkAuthLoader, loader as tokenLoader } from '../pages/util/checkAuth';
import ActivityDetailPage from '../pages/activities/ActivityDetailPage';
import EditActivityPage from '../pages/activities/EditActivityPage';
import NewActivityPage, {action as newActivityAction, loader as tagLoader } from '../pages/activities/NewActivityPage';

export const router = createBrowserRouter([
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
            { 
              index: true, 
              element: <ActivitiesPage />,
              loader: activitiesLoader
            },
            {
              path: ':activityId',
              id: 'activity-detail',
              children: [
                {
                  index: true,
                  element: <ActivityDetailPage /> ,
                },
                {
                  path: 'edit',
                  element: <EditActivityPage />,
                }
              ]
            },
            {
              path: 'new',
              element: <NewActivityPage />,
              loader: tagLoader,
              action: newActivityAction
            }
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
              path: 'signup',
              element: <SignUpPage />,
              action: signUpAction
            },
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