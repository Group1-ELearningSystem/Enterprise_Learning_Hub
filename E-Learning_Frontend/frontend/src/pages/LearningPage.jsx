import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { learnerApi } from '../api/learnerApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';
import { normalizeAssetUrl } from '../utils/format';

export default function LearningPage() {
  const { courseId } = useParams();
  const learning = useAsync(() => learnerApi.getLearningContent(courseId), { sessions: [] });
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [exerciseResult, setExerciseResult] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    learning.run();
  }, [courseId]);

  useEffect(() => {
    const first = learning.data?.sessions?.[0]?.Session_ID;
    if (first) setSelectedSessionId(first);
  }, [learning.data]);

  const currentSession = useMemo(
    () => learning.data?.sessions?.find((item) => item.Session_ID === selectedSessionId) || learning.data?.sessions?.[0],
    [learning.data, selectedSessionId]
  );

  const exercises = useAsync(
    () => currentSession ? learnerApi.getExercises(courseId, currentSession.Session_ID) : Promise.resolve([]),
    []
  );

  useEffect(() => {
    if (currentSession) {
      exercises.run();
      setExerciseAnswers({});
      setExerciseResult(null);
    }
  }, [currentSession?.Session_ID]);

  const saveProgress = async () => {
    const video = document.querySelector('video');
    if (!video || !currentSession) return;

    const res = await learnerApi.saveVideoProgress(courseId, currentSession.Session_ID, {
      watchedSeconds: Math.floor(video.currentTime || 0),
      lastPositionSeconds: Math.floor(video.currentTime || 0),
      videoDurationSeconds: Math.floor(video.duration || currentSession.videoDurationSeconds || 0)
    });

    setMessage(res.message + (res.completed ? ' Session auto-completed.' : ''));
    learning.run();
  };

  const markCompleted = async () => {
    if (!currentSession) return;
    const res = await learnerApi.markSessionComplete(courseId, currentSession.Session_ID);
    setMessage(res.message);
    learning.run();
  };

  const submitExercises = async (e) => {
    e.preventDefault();
    if (!currentSession) return;
    const result = await learnerApi.submitExercises(courseId, currentSession.Session_ID, exerciseAnswers);
    setExerciseResult(result);
    setMessage(result.message);
    learning.run();
  };

  if (learning.loading && !learning.data?.sessions?.length) return <LoadingState label="Loading learning content..." />;
  if (!learning.data?.sessions?.length) return <EmptyState title="No session available" description="This course has no session or you are not actively subscribed." />;

  return (
    <div className="page-stack">
      <PageHeader title={`Learning - ${courseId}`} subtitle="Video tracking, session completion, and exercise submission." />
      {message ? <div className="alert success">{message}</div> : null}
      {learning.error ? <div className="alert error">{learning.error}</div> : null}

      <div className="learning-layout">
        <aside className="card session-list">
          <h3>Sessions</h3>
          {learning.data.sessions.map((session) => (
            <button
              key={`${session.Course_ID}-${session.Session_ID}`}
              className={`session-item ${currentSession?.Session_ID === session.Session_ID ? 'active' : ''}`}
              onClick={() => setSelectedSessionId(session.Session_ID)}
            >
              <strong>{session.Session_Title}</strong>
              <span>Status: {session.Progress_Status || 'Not started'}</span>
              <small>Watched: {session.watchedSeconds || 0}s / {session.videoDurationSeconds || 0}s</small>
            </button>
          ))}
        </aside>

        <section className="page-stack">
          <div className="card">
            <h3>{currentSession?.Session_Title}</h3>
            {currentSession?.Session_Video ? (
              <video key={currentSession.Session_ID} controls src={normalizeAssetUrl(currentSession.Session_Video)} className="video-player" />
            ) : (
              <p>No video uploaded for this session.</p>
            )}
            <div className="actions-row">
              <button className="ghost-btn" onClick={saveProgress}>Save video progress</button>
              <button className="primary-btn" onClick={markCompleted}>Mark session completed</button>
              {currentSession?.Session_Document ? <a className="ghost-btn" href={normalizeAssetUrl(currentSession.Session_Document)} target="_blank" rel="noreferrer">Open document</a> : null}
            </div>
          </div>

          <form className="card form-card" onSubmit={submitExercises}>
            <h3>Exercises</h3>
            {!exercises.data?.length ? <p className="muted">No exercise for this session.</p> : null}
            <div className="list-stack">
              {exercises.data?.map((question) => (
                <div className="list-item" key={question.Exercise_Number}>
                  <strong>{question.Exercise_Number}. {question.Exercise_Question}</strong>
                  <div className="option-grid">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <label key={option} className="option-item">
                        <input
                          type="radio"
                          name={question.Exercise_Number}
                          value={option}
                          checked={exerciseAnswers[question.Exercise_Number] === option}
                          onChange={(e) => setExerciseAnswers((prev) => ({ ...prev, [question.Exercise_Number]: e.target.value }))}
                        />
                        <span>{option}. {question[`Option_${option}`]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {exercises.data?.length ? <button className="primary-btn" type="submit">Submit exercises</button> : null}
          </form>

          {exerciseResult ? (
            <section className="card">
              <h3>Submission result</h3>
              <p>Score: <strong>{exerciseResult.score}</strong> | Correct: <strong>{exerciseResult.correct}</strong> / {exerciseResult.total}</p>
              <div className="list-stack">
                {exerciseResult.results.map((item) => (
                  <div key={item.exerciseNumber} className="list-item">
                    <div className="list-head">
                      <strong>{item.exerciseNumber}</strong>
                      <span className={item.isCorrect ? 'text-success' : 'text-danger'}>{item.isCorrect ? 'Correct' : 'Incorrect'}</span>
                    </div>
                    <p>{item.question}</p>
                    <small>Submitted: {item.submittedAnswer || '—'} | Correct answer: {item.correctAnswer}</small>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}
