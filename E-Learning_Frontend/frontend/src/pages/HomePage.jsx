import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="landing">
      <div className="hero card">
        <span className="badge">ReactJS Frontend + NodeJS Login</span>
        <h1>Learner Portal for your E-Learning system</h1>
        <p>
          This frontend now supports real learner login with username and password, then uses JWT
          to access all learner APIs: profile, courses, learning progress, exercises, feedback,
          notifications, financial requests, reminders, and recommendations.
        </p>
        <div className="hero-actions">
          <Link className="primary-btn" to="/login">Login</Link>
          <Link className="ghost-btn" to="/courses">Open app</Link>
        </div>
      </div>
    </div>
  );
}
