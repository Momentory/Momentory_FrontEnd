import { createBrowserRouter, RouterProvider, Navigate, type RouteObject } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';
import CharacterPage from './pages/character-page';
import HomePage from './pages/home-page';
import TravelPage from './pages/travel-page';
import MyAlbumPage from './pages/myAlbum-page';
import UploadPage from './pages/photo-upload-page/UploadPage';
import { CommunityPage, CommunityUploadPage, CommunityDetailPage } from "./pages/community-page";
import SplashPage from "./pages/Auth/SplashPage";
import LoginScreen from "./pages/Auth/LoginScreen";
import SigninScreen from "./pages/Auth/SigninScreen";
import CreateAccountPage from "./pages/Auth/CreateAccountPage";
import TermsOfServicePage from "./pages/Auth/TermsOfServicePage";
import CreateProfilePage from "./pages/Auth/CreateProfilePage";
import SelectCharacterPage from './pages/Auth/SelectCharacterPage';
import AccountCreatedPage from "./pages/Auth/AccountCreatedPage";
import KakaoCallback from "./pages/Auth/KakaoCallback";



const queryClient = new QueryClient();

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <SplashPage /> },
      { path: 'login', element: <LoginScreen /> },
      { path: 'signinscreen', element: <SigninScreen /> },
      { path: 'signup', element: <CreateAccountPage /> },
      { path: 'auth/kakao/callback', element: <KakaoCallback /> },
      { path: 'terms', element: <TermsOfServicePage /> },
      { path: 'create-profile', element: <CreateProfilePage /> },
      { path: 'select', element: <SelectCharacterPage /> },
      { path: 'account', element: <AccountCreatedPage /> },
    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'character', element: <CharacterPage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: 'album', element: <MyAlbumPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: "community/upload", element: <CommunityUploadPage /> },
      { path: "community/:postId", element: <CommunityDetailPage /> },
      { path: 'travel', element: <TravelPage /> },
    ],
  },
];




const router = createBrowserRouter([...publicRoutes,...protectedRoutes]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
