import { useEffect, useState } from 'react';
import { learnerApi } from '../api/learnerApi';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';


export default function CoursesPage() {
  const courses = useAsync(learnerApi.getCourses, []);
  const [filters, setFilters] = useState({ keyword: '', field: '', instructor: '', status: 'AVAILABLE' });

  const loadCourses = async (customFilters = filters) => {
    await courses.run(customFilters);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await loadCourses();
  };

  return (
    <div className="page-stack">
      <PageHeader title="Courses" subtitle="Search by course name, field, and instructor." />

      <form className="card filters" onSubmit={submit}>
        <input placeholder="Course name" value={filters.keyword} onChange={(e) => setFilters((p) => ({ ...p, keyword: e.target.value }))} />
        <input placeholder="Field" value={filters.field} onChange={(e) => setFilters((p) => ({ ...p, field: e.target.value }))} />
        <input placeholder="Instructor" value={filters.instructor} onChange={(e) => setFilters((p) => ({ ...p, instructor: e.target.value }))} />
        <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="Draft">Draft</option>
          <option value="Closed">Closed</option>
        </select>
        <button className="primary-btn" type="submit">Search</button>
      </form>

      {courses.error ? <div className="alert error">{courses.error}</div> : null}
      {courses.loading ? <LoadingState label="Loading courses..." /> : null}
      {!courses.loading && !courses.data?.length ? <EmptyState title="No course found" description="Try another keyword, field, or instructor." /> : null}

      <div className="card-grid">
        {courses.data?.map((course) => <CourseCard key={course.Course_ID} course={course} />)}
      </div>
    </div>
  );
}
