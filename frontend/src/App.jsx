import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout          from './layouts/AuthLayout.jsx';
import RootLayout          from './layouts/RootLayout.jsx';
import ProtectedRoute      from './components/common/ProtectedRoute.jsx';
import LoginPage           from './pages/LoginPage.jsx';
import ForgotPasswordPage  from './pages/ForgotPasswordPage.jsx';
import VerifyOTPPage       from './pages/VerifyOTPPage.jsx';
import HomePage            from './pages/HomePage.jsx';
import CompanyPage         from './pages/CompanyPage.jsx';
import ProgramPage         from './pages/ProgramPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp"      element={<VerifyOTPPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/"                     element={<HomePage />} />
            <Route path="/companies/:companyId" element={<CompanyPage />} />
            <Route path="/programs/:progId"     element={<ProgramPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}