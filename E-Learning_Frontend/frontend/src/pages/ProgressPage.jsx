import { useEffect } from 'react';
import { learnerApi } from '../api/learnerApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';

export default function ProgressPage() {
  const progress = useAsync(learnerApi.getMyProgress, []);
  useEffect(() => { progress.run(); }, []);

  return (
    <div className="page-stack">
      <PageHeader title="My Progress" subtitle="Track completed sessions in your active courses." />
      {progress.loading ? <LoadingState label="Loading progress..." /> : null}
      {progress.error ? <div className="alert error">{progress.error}</div> : null}
      {!progress.loading && !progress.data?.length ? <EmptyState title="No progress data" description="Start learning an active course first." /> : null}

      <div className="card-grid">
        {progress.data?.map((item) => (
          <section key={item.Course_ID} className="card progress-card">
            <h3>{item.Course_Name}</h3>
            <p>{item.completedSessions} / {item.totalSessions} sessions completed</p>
            <div className="progress-bar"><span style={{ width: `${item.progressPercentage}%` }} /></div>
            <div className="list-head">
              <strong>{item.progressPercentage}%</strong>
              <small className="muted">Last update: {item.lastUpdated || '—'}</small>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
