import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/CreateAccountPage";
import HomePage from "../pages/home-page/HomePage";
import PhotoUploadPage from "../pages/photo-upload-page";
import PhotoEditPage from "../pages/photo-edit-page";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/photo-upload" element={<PhotoUploadPage />} />
        <Route path="/photo-edit" element={<PhotoEditPage />} />
      </Routes>
    </Router>
  );
}

