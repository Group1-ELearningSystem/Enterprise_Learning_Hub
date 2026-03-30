import { useEffect } from 'react';
import { learnerApi } from '../api/learnerApi';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';

export default function RecommendationsPage() {
  const recommendations = useAsync(learnerApi.getRecommendations, { items: [] });
  useEffect(() => { recommendations.run(); }, []);

  return (
    <div className="page-stack">
      <PageHeader title="Recommendations" subtitle="Suggested courses after filtering out enrolled and completed ones." />
      {recommendations.loading ? <LoadingState label="Loading recommendations..." /> : null}
      {recommendations.error ? <div className="alert error">{recommendations.error}</div> : null}
      {!recommendations.loading && !recommendations.data?.items?.length ? <EmptyState title="No recommendation" description="Complete some courses or add more available courses in the database." /> : null}
      <div className="card-grid">
        {recommendations.data?.items?.map((item) => <CourseCard key={item.Course_ID} course={item} />)}
      </div>
    </div>
  );
}
