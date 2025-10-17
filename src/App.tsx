import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';
import CharacterPage from './pages/character-page';
import HomePage from './pages/home-page';
import MyAlbumPage from './pages/myAlbum-page';
import UploadPage from './pages/photo-upload-page';
import CommunityPage from './pages/community-page';


const queryClient = new QueryClient();

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    // children:[
    //   {path:'login', element:<LoginPage />}
    //   {path:'signup', element:<SignUpPage />}
    // ]
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

export default App;
