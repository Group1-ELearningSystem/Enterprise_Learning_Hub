import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learnerApi } from '../api/learnerApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';
import { formatCurrency } from '../utils/format';

export default function MyCoursesPage() {
  const courses = useAsync(learnerApi.getMyCourses, []);
  useEffect(() => { courses.run(); }, []);

  return (
    <div className="page-stack">
      <PageHeader title="My Courses" subtitle="Courses registered through subscription." />
      {courses.loading ? <LoadingState label="Loading your courses..." /> : null}
      {courses.error ? <div className="alert error">{courses.error}</div> : null}
      {!courses.loading && !courses.data?.length ? <EmptyState title="No registered course" description="Register a course from the courses page first." /> : null}

      <div className="table-card card">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Field</th>
              <th>Instructor</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.data?.map((item) => (
              <tr key={item.Subscription_ID}>
                <td>{item.Course_Name}</td>
                <td>{item.Field_Name || '—'}</td>
                <td>{item.Instructor_Full_Name || '—'}</td>
                <td>{Number(item.Course_Fee) > 0 ? formatCurrency(item.Course_Fee) : 'Free'}</td>
                <td>{item.Subscription_Status}</td>
                <td>
                  <div className="table-actions">
                    <Link className="ghost-btn small-btn" to={`/courses/${item.Course_ID}`}>Detail</Link>
                    {item.Subscription_Status === 'Active' ? <Link className="primary-btn small-btn" to={`/learning/${item.Course_ID}`}>Learn</Link> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
