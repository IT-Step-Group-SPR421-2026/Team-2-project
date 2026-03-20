import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import TestsPage from './pages/Tests';
import TestDetailsPage from './pages/TestDetails';
import ProfilePage from './pages/Profile';
import SubscriptionPage from './pages/Subscription';
import { GuestOnlyRoute, ProtectedRoute } from './routes/ProtectedRoute';
import CommentsPage from './pages/Comments';
import { HEADER_ROUTES, ROUTE_PATTERNS } from './constants';

function App() {
  return (
    <div>
      <Routes>
        <Route path={HEADER_ROUTES.HOME} element={<HomePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path={HEADER_ROUTES.TESTS} element={<TestsPage />} />
          <Route path={ROUTE_PATTERNS.TEST_DETAILS} element={<TestDetailsPage />} />
          <Route path={HEADER_ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={HEADER_ROUTES.SUBSCRIPTION} element={<SubscriptionPage />} />
          <Route path={ROUTE_PATTERNS.COMMENTS} element={<CommentsPage />} />
        </Route>

        <Route element={<GuestOnlyRoute />}>
          <Route path={HEADER_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={HEADER_ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route path="*" element={<Navigate to={HEADER_ROUTES.HOME} replace />} />
      </Routes>
    </div>
  );
}

export default App;
