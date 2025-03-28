import { createBrowserRouter } from "react-router-dom";
import RootLayout from '../pages/home/RootLayout';
// import ErrorPage from '../pages/util/ErrorPage';
import HomePage from '../pages/home/HomePage';
import ActivitiesRootLayout from '../pages/activities/ActivitiesRootLayout';
import ActivitiesPage, { loader as activitiesLoader, action as searchAction } from '../pages/activities/ActivitiesPage';
import LoginPage, { action as loginAction } from '../pages/auth/LoginPage';
import LoginLayout from '../pages/auth/LoginLayout';
import SignUpPage, { action as signUpAction } from '../pages/auth/SignUpPage';
import { logoutAction } from '../pages/auth/logout';
import { userLoader } from '../pages/util/checkAuth';
import ActivityDetailPage, { loader as activityDetailLoader, action as activityItemAction } from '../pages/activities/ActivityDetailPage';
import EditActivityPage from '../pages/activities/EditActivityPage';
import NewActivityPage from '../pages/activities/NewActivityPage';
import { action as activityFormAction, loader as tagsLoader } from '../pages/activities/formAction';
import UserLayout from "../pages/user_page/UserLayout";
import UserMainPage, { loader as userDetailLoader } from "../pages/user_page/UserMainPage";
import EditProfilePage, { action as profileEditAction } from "../pages/user_page/EditProfilePage";
import UserUploadsPage, { loader as userUploadsLoader, action as deleteUserActivityAction } from "../pages/user_page/UserUploadsPage";
import UserFavoritesPage, { loader as userFavoritesLoader, action as removeFavoriteActivity } from "../pages/user_page/UserFavoritesPage";
import UserPlaylistsPage, { userPlaylistsLoader, action as playlistAction } from "../pages/user_page/UserPlaylistsPage";
import OauthRedirectPage, { loader as tokenLoader } from "../pages/auth/OauthRedirectPage";
import ErrorPage from "../pages/util/ErrorPage";



export const createRouter = (setUserInfo) => createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    id: 'root',
    loader: userLoader,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'activities',
        element: <ActivitiesRootLayout />,
        children: [
          {
            index: true,
            id: 'activities',
            element: <ActivitiesPage />,
            loader: activitiesLoader,
            action: searchAction
          },
          {
            path: ':activityId',
            id: 'activity-detail',
            loader: activityDetailLoader,
            children: [
              {
                index: true,
                element: <ActivityDetailPage />,
                action: activityItemAction
              },
              {
                path: 'edit',
                id: 'edit-tags',
                element: <EditActivityPage />,
                loader: tagsLoader,
                action: activityFormAction
              }
            ]
          },
          {
            path: 'new',
            id: 'tags',
            element: <NewActivityPage />,
            loader: tagsLoader,
            action: activityFormAction
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
            action: ({ request }) => loginAction({ request, setUserInfo })
          },
          {
            path: 'signup',
            element: <SignUpPage />,
            action: signUpAction
          },
          {
            path: 'oauth-redirect',
            element: <OauthRedirectPage />,
            loader: tokenLoader
          }
        ]
      },
      {
        path: 'logout',
        action: logoutAction,
      },
      {
        path: 'mypage',
        element: <UserLayout />,
        children: [
          {
            path: ':user_id',
            id: 'user-detail',
            loader: userDetailLoader,
            children: [
              {
                index: true,
                element: <UserMainPage />
              },
              {
                path: 'edit',
                id: 'profile-edit',
                element: <EditProfilePage />,
                action: profileEditAction,
              },
              {
                path: 'favorites',
                id: 'user-favorites',
                element: <UserFavoritesPage />,
                loader: userFavoritesLoader,
                action: removeFavoriteActivity,
              },
              {
                path: 'uploads',
                id: 'user-uploads',
                element: <UserUploadsPage />,
                loader: userUploadsLoader,
                action: deleteUserActivityAction,
              },
              {
                path: 'playlists',
                id: 'user-playlists',
                element: <UserPlaylistsPage />,
                loader: userPlaylistsLoader,
                action: playlistAction
              }
            ]
          }
        ]
      }
    ]
  }
], {
  basename: "/lesson-lab-frontend"
});

