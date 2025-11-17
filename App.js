import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/register";
import Header from "./components/common/Header/header";
import ContactUs from "./pages/ContactUs/Contact";
import Footer from "./components/common/Footer/footer";
import Listing from './pages/PublicProperties/PublicProperties';
import BookingPage from './pages/ApplicationPage/ApplicationPage';
import EditProperty from './pages/EditProperty/EditProperty';
import AddProperty from './pages/AddProperty/AddProperty';
import Property from './pages/Property/Property';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import LandlordDashboard from './pages/LandlordDashboard/LandlordDashboard';
import TenantDashboard from './pages/TenantDashboard/TenantDashboard';
import Profile from './pages/Profile/Profile';
import ApplicationDetailPage from './pages/ApplicationDetailPage/ApplicationDetailPage';
import ChatPage from './pages/ChatPage/ChatPage';
import ChatPageLand from './pages/LandlordChatPage/ChatPageLand';
import useTokenRefresh from './hooks/useTokenRefresh';
import { Navigate } from "react-router-dom"
import {
    AuthGuard,
    PublicOnlyGuard,
    AdminGuard,
    LandlordGuard,
    TenantGuard,
    AuthenticatedGuard
} from './guards';

function App() {
    const { loading } = useTokenRefresh();

    return (
        <div className="app-wrapper d-flex flex-column min-vh-100">
            <Header />

            <div className="flex-fill">
                {loading && <div>Refreshing token....</div>}

                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/listings" element={<Listing />} />
                    <Route path="/property/:propertyId" element={<Property />} />

                    {/* Auth-only routes */}
                    <Route element={<PublicOnlyGuard />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Role-specific routes */}
                    <Route element={<AdminGuard />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                    <Route element={<LandlordGuard />}>
                        <Route path="/landlord" element={<LandlordDashboard />} />
                        <Route path="/add-property" element={<AddProperty />} />
                        <Route path="/edit-property/:propertyId" element={<EditProperty />} />
                        <Route path="/landlordChat/:landlordId" element={<ChatPageLand />} />
                    </Route>

                    <Route element={<TenantGuard />}>
                        <Route path="/tenant" element={<TenantDashboard />} />
                        <Route path="/apply/:propertyId" element={<BookingPage />} />
                        <Route path="/booking/:BookingId" element={<BookingPage />} />
                        <Route path="/tenant/applications" element={<TenantDashboard defaultTab="applications" />} />
                        <Route path="/chat/:chatId" element={<ChatPage userType="landlord" />} /> 
                        <Route path="/chat/:conversationId" element={<ChatPage />} /> 
                    </Route>

                    {/* Authenticated routes (any logged-in user) */}
                    <Route element={<AuthenticatedGuard />}>
                        <Route path="/profile/:userType" element={<Profile />} />
                        <Route path="/application/:id" element={<ApplicationDetailPage />} />
                    </Route>

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>

            <Footer />
        </div>
    );
}

export default App;