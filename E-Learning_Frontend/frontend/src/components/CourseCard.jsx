import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function CourseCard({ course }) {
  return (
    <article className="card course-card">
      <div className="badge-row">
        <span className="badge">{course.Field_Name || 'General'}</span>
        <span className="badge outline">{course.Course_Status}</span>
      </div>
      <h3>{course.Course_Name}</h3>
      <p className="line-clamp-3">{course.Course_Overview || 'No overview yet.'}</p>
      <div className="meta-grid">
        <span><strong>Instructor:</strong> {course.Instructor_Full_Name || 'Updating'}</span>
        <span><strong>Rating:</strong> {course.avgRating || 0} / 5</span>
        <span><strong>Reviews:</strong> {course.totalFeedbacks || 0}</span>
        <span><strong>Fee:</strong> {Number(course.Course_Fee) > 0 ? formatCurrency(course.Course_Fee) : 'Free'}</span>
      </div>
      {course.learnerSubscriptionStatus ? (
        <div className="status-chip success">Your status: {course.learnerSubscriptionStatus}</div>
      ) : null}
      <Link className="primary-btn" to={`/courses/${course.Course_ID}`}>
        View detail
      </Link>
    </article>
  );
}
