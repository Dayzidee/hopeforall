import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout, ProtectedLayout, AdminLayout } from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MemberHome from './pages/MemberHome';
import LiveStream from './pages/LiveStream';
import MemberChat from './pages/MemberChat';
import PastorInteraction from './pages/PastorInteraction';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Protected Member Routes */}
          <Route path="/dashboard" element={<ProtectedLayout />}>
            <Route index element={<MemberHome />} />
            <Route path="live" element={<LiveStream />} />
            <Route path="chat" element={<MemberChat />} />
            <Route path="pastor" element={<PastorInteraction />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
