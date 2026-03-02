import ProfilePage from './pages/ProfilePage.jsx';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import VerifyOTPPage from "./pages/VerifyOTPPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CompanyPage from "./pages/CompanyPage.jsx";
import ProgramPage from "./pages/ProgramPage.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
        </Route>

        {/* Protected pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/companies/:companyId" element={<CompanyPage />} />
            <Route path="/programs/:progId" element={<ProgramPage />} />

            {/* ✅ NEW Leaderboard route */}
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}