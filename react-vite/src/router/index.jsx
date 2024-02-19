import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import HomePage from '../components/HomePage';
import WorkspaceForm from '../components/WorkspaceForm';
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
        path: "/workspace",
        element: <WorkspaceForm />
      },
      {
        path: "*",
        element: <HomePage />
      }
    ],
  },
]);
