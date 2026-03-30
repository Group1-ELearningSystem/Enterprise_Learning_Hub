import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyCoursesPage from './pages/MyCoursesPage';
import ProgressPage from './pages/ProgressPage';
import LearningPage from './pages/LearningPage';
import FinancialRequestsPage from './pages/FinancialRequestsPage';
import NotificationsPage from './pages/NotificationsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/my-courses" element={<MyCoursesPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/learning/:courseId" element={<LearningPage />} />
        <Route path="/financial-requests" element={<FinancialRequestsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}