import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../components/HomePage';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      }
    ],
  },
]);
