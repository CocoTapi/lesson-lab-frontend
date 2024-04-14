import './App.css';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router/router';
import UserProvider, { useUserContext } from './pages/util/UserProvider';
export const API_URL = 'http://localhost:8080';

function App() {

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
