import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';
import CharacterPage from './pages/character-page';
import HomePage from './pages/home-page';
import MyAlbumPage from './pages/myAlbum-page';
import UploadPage from './pages/photo-upload-page';
import CommunityPage from './pages/community-page';
import SplashPage from "./pages/Auth/SplashPage";
import LoginScreen from "./pages/Auth/LoginScreen";
import SigninScreen from "./pages/Auth/SigninScreen";
import CreateAccountPage from "./pages/Auth/CreateAccountPage";


const queryClient = new QueryClient();

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
   children: [
      { index: true, element: <SplashPage /> }, // "/" 기본 경로일 때 스플래시
      { path: 'login', element: <LoginScreen /> },
      { path: 'signinscreen', element: <SigninScreen /> },
      { path: 'signup', element: <CreateAccountPage /> },
    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {index: true, element:<HomePage/>},
      {path:'upload', element:<UploadPage />},
      {path:'character', element:<CharacterPage />},
      {path:'album', element:<MyAlbumPage />},
      {path:'community', element:<CommunityPage />},
    ],
    
  },
];




const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
