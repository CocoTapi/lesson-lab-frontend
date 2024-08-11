import './App.css';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router/router';
import UserProvider, { useUserContext } from './pages/util/UserProvider';
// env.config();

export const API_URL = process.env.REACT_APP_API_URL;
export const baseUrl = process.env.REACT_APP_BASE_URL;

function App() {
console.log(API_URL);
  return (
    <UserProvider>
      <AppWithRouter />
    </UserProvider>
  );
}

function AppWithRouter() {
  const { setUserInfo } = useUserContext(); //NOTE* cannot call within "App" function. Need to investigate why.  
  const router = createRouter(setUserInfo);

  return <RouterProvider router={router} />;
}
export default App;
