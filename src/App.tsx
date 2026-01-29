import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout, ProtectedLayout, AdminLayout } from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BishopPage from './pages/BishopPage';
import LeadershipPage from './pages/LeadershipPage';
import MemberHome from './pages/MemberHome';
import LiveStream from './pages/LiveStream';
import MemberChat from './pages/MemberChat';
import PastorInteraction from './pages/PastorInteraction';
import UserManagement from './pages/UserManagement';
import SubscriptionPage from './pages/SubscriptionPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import PremiumRoute from './components/dashboard/PremiumRoute';
import PrayerWall from './pages/PrayerWall';
import SermonJournal from './pages/SermonJournal';
import DailyBread from './pages/DailyBread';
import ResourceLibrary from './pages/ResourceLibrary';
import CommunityGroups from './pages/CommunityGroups';
import SpiritualGifts from './pages/SpiritualGifts';
import GivingAnalytics from './pages/GivingAnalytics';
import GivingPage from './pages/GivingPage';
import EventsCalendar from './pages/EventsCalendar';
import BishopQA from './pages/BishopQA';
import KidsKingdom from './pages/KidsKingdom';
import TermsConditions from './pages/TermsConditions';
import AdminHome from './pages/admin/AdminHome';
import AdminContent from './pages/admin/AdminContent';
import AdminPrayers from './pages/admin/AdminPrayers';
import AdminChat from './pages/admin/AdminChat';
import AdminNotifications from './pages/admin/AdminNotifications';
import ProfilePage from './pages/ProfilePage';

import ScrollToAnchor from './components/ScrollToAnchor';

function App() {
  return (
    <BrowserRouter>
      <ScrollToAnchor />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/leadership/bishop-sapp" element={<BishopPage />} />
            <Route path="/leadership" element={<LeadershipPage />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/give" element={<GivingPage />} />
          </Route>

          {/* Protected Member Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<MemberHome />} />
            {/* Premium Features (Golden Vessel Only) */}
            <Route path="live" element={<PremiumRoute><LiveStream /></PremiumRoute>} />
            <Route path="chat" element={<PremiumRoute><MemberChat /></PremiumRoute>} />
            <Route path="pastor" element={<PremiumRoute><PastorInteraction /></PremiumRoute>} />
            <Route path="library" element={<PremiumRoute><ResourceLibrary /></PremiumRoute>} />
            <Route path="qa" element={<PremiumRoute><BishopQA /></PremiumRoute>} />

            {/* Newly Restricted Features */}
            {/* <Route path="journal" element={<PremiumRoute><SermonJournal /></PremiumRoute>} /> */}
            {/* <Route path="groups" element={<PremiumRoute><CommunityGroups /></PremiumRoute>} /> */}
            <Route path="gifts" element={<PremiumRoute><SpiritualGifts /></PremiumRoute>} />
            <Route path="groups" element={<PremiumRoute><CommunityGroups /></PremiumRoute>} />
            {/* <Route path="kids" element={<PremiumRoute><KidsKingdom /></PremiumRoute>} /> */}

            {/* General Features (Free with Upsell) */}
            <Route path="prayer" element={<PrayerWall />} />
            <Route path="devotional" element={<DailyBread />} />
            <Route path="devotional" element={<DailyBread />} />
            <Route path="giving" element={<GivingPage />} />
            <Route path="giving/history" element={<GivingAnalytics />} />
            <Route path="events" element={<EventsCalendar />} />
            <Route path="events" element={<EventsCalendar />} />
            <Route path="journal" element={<SermonJournal />} />
            {/* <Route path="groups" element={<CommunityGroups />} /> */}
            <Route path="kids" element={<KidsKingdom />} />
            <Route path="profile" element={<ProfilePage />} />

          </Route>

          <Route element={<ProtectedLayout />}>
            <Route path="/subscribe" element={<SubscriptionPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="prayers" element={<AdminPrayers />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
