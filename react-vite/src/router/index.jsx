import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import HomePage from '../components/HomePage';
import SomethingWentWrong from '../components/SomethingWentWrong';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <SomethingWentWrong />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "*",
        element: <HomePage />
      }
    ],
  },
]);
