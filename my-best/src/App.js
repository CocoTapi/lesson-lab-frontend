import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';

export const API_URL = 'http://localhost:8080';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
