import { useEffect, useState } from 'react';
import { learnerApi } from '../api/learnerApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';
import { formatDateTime } from '../utils/format';

export default function NotificationsPage() {
  const notifications = useAsync(learnerApi.getNotifications, []);
  const [message, setMessage] = useState('');

  useEffect(() => { notifications.run(); }, []);

  const triggerReminder = async () => {
    const res = await learnerApi.runReminders();
    setMessage(`${res.message} Total learners reminded: ${res.totalLearners}`);
    notifications.run();
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Notifications"
        subtitle="View learner notifications and manually trigger inactive-learning reminder."
        action={<button className="primary-btn" onClick={triggerReminder}>Run reminder check</button>}
      />
      {message ? <div className="alert success">{message}</div> : null}
      {notifications.loading ? <LoadingState label="Loading notifications..." /> : null}
      {notifications.error ? <div className="alert error">{notifications.error}</div> : null}
      {!notifications.loading && !notifications.data?.length ? <EmptyState title="No notification" description="Notifications will appear after learning events or reminders." /> : null}

      <div className="list-stack">
        {notifications.data?.map((item) => (
          <article className="card" key={item.Notification_ID}>
            <div className="list-head">
              <strong>{item.title}</strong>
              <span className="badge">{item.notification_type}</span>
            </div>
            <p>{item.message}</p>
            <small className="muted">{formatDateTime(item.created_at)}</small>
          </article>
        ))}
      </div>
    </div>
  );
}
