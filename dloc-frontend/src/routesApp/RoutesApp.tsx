import { Routes, Route } from 'react-router-dom';
import {Map} from 'pages/Map/Map';
import Auth from 'pages/Auth/Auth';
import Layout from 'pages/Layout';
import Login from 'pages/Login/Login';
import Logout from 'pages/Logout/Logout';
import Page404 from 'pages/Page404/Page404';
import Privacy from 'pages/Privacy/Privacy';
import Profile from 'pages/Profile/Profile';
import ProtectedRoute from 'components/ProtectRoute/ProtectRoute';
import Terms from 'pages/Terms/Terms';
import ContactUs from 'pages/ContactUs/ContactUs';

const RoutesApp = () => {
  return (
    <Routes>
      {/* Default Route (Home) */}
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes */}
        <Route path="/auth" element={<Auth />} />

        {/* Public Routes */}
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/logout/forced" element={<Logout />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};
export default RoutesApp;
