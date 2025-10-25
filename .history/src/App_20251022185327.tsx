
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 페이지 import
import SplashPage from "./pages/Auth/SplashPage";
import LoginScreen from "./pages/Auth/LoginScreen"
import SigninScreen from "./pages/Auth/SigninScreen";
import CreateAccountPage from "./pages/CreateAccountPage";

const router = createBrowserRouter([
  
  { path: "/", element: <SplashPage /> },
  { path: "/login", element: <LoginScreen /> },
  { path: "/signinscreen", element: <SigninScreen /> },
  { path: "/signup", element: <SCreateAccountPage /> },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
