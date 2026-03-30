// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { learnerApi } from '../api/learnerApi';
// import EmptyState from '../components/EmptyState';
// import LoadingState from '../components/LoadingState';
// import PageHeader from '../components/PageHeader';
// import StatCard from '../components/StatCard';
// import { useAsync } from '../hooks/useAsync';

// import { formatCurrency, formatDateTime } from '../utils/format';

// export default function CourseDetailPage() {
//   const { courseId } = useParams();
//   const detail = useAsync(() => learnerApi.getCourseDetail(courseId));
//   const feedbacks = useAsync(() => learnerApi.getCourseFeedbacks(courseId), { summary: {}, items: [] });
//   const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });
//   const [paidProof, setPaidProof] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const reload = async () => {
//     await Promise.all([detail.run(), feedbacks.run()]);
//   };

//   useEffect(() => { reload(); }, [courseId]);

//   const registerFree = async () => {
//     const res = await learnerApi.registerFreeCourse(courseId);
//     setMessage(res.message);
//     reload();
//   };

//   const registerPaid = async () => {
//     const res = await learnerApi.registerPaidCourse(courseId, { paymentProof: paidProof || null });
//     setMessage(res.message);
//     reload();
//   };
//   const goToFinancialRequest = () => {
//     navigate('/financial-requests', {
//       state: { courseId }
//     });
//   };

//   const submitFeedback = async (e) => {
//     e.preventDefault();
//     const res = await learnerApi.saveFeedback(courseId, { rating: Number(feedbackForm.rating), comment: feedbackForm.comment });
//     setMessage(res.message);
//     setFeedbackForm({ rating: 5, comment: '' });
//     feedbacks.run();
//   };

//   const react = async (reactionType) => {
//     const res = await learnerApi.saveReaction(courseId, { reactionType });
//     setMessage(res.message);
//     feedbacks.run();
//   };

//   if (detail.loading && !detail.data) return <LoadingState label="Loading course detail..." />;
//   if (!detail.data?.course) return <EmptyState title="Course not found" description="Please go back to course list." />;

//   const { course, isSubscribed, subscriptionStatus, effectiveFee, financialSupport, hasPendingRequest } = detail.data;

//   return (
//     <div className="page-stack">
//       <PageHeader title={course.Course_Name} subtitle={course.Course_Overview || 'Course detail'} />
//       {message ? <div className="alert success">{message}</div> : null}
//       {detail.error ? <div className="alert error">{detail.error}</div> : null}

//       <div className="stats-grid">
//         <StatCard label="Field" value={course.Field_Name || 'General'} />
//         <StatCard label="Instructor" value={course.Instructor_Full_Name || 'Updating'} />
//         <StatCard label="Fee" value={Number(effectiveFee) > 0 ? formatCurrency(effectiveFee) : 'Free'} hint={financialSupport ? 'Applied from financial support' : 'Original/current fee'} />
//         <StatCard label="Subscription" value={subscriptionStatus || 'Not enrolled'} hint={hasPendingRequest ? 'There is a pending financial request.' : ''} />
//       </div>

//       <section className="card">
//         <h3>Objective</h3>
//         <p>{course.Course_Objective || 'No objective yet.'}</p>
//       </section>

//       <section className="card">
//         <h3>Registration</h3>
//         {isSubscribed ? <div className="alert success">You already registered this course with status: {subscriptionStatus}</div> : null}
//         {!isSubscribed && Number(effectiveFee) <= 0 ? (
//           <button className="primary-btn" onClick={registerFree}>Register free course</button>
//         ) : null}
//         {!isSubscribed && Number(effectiveFee) > 0 ? (
//           <div className="inline-form">
//             <input placeholder="Payment proof path or note" value={paidProof} onChange={(e) => setPaidProof(e.target.value)} />
//             <button className="primary-btn" onClick={registerPaid}>Register paid course</button>
//           </div>
//         ) : null}
//         {financialSupport ? <p className="muted">Financial support approved amount: {formatCurrency(financialSupport.Request_Amount)}</p> : null}
//       </section>

//       <section className="card">
//         <h3>Ratings & reactions</h3>
//         <div className="stats-grid compact">
//           <StatCard label="Average rating" value={feedbacks.data?.summary?.avgRating || 0} />
//           <StatCard label="Feedbacks" value={feedbacks.data?.summary?.totalFeedbacks || 0} />
//           <StatCard label="Likes" value={feedbacks.data?.summary?.totalLikes || 0} />
//           <StatCard label="Dislikes" value={feedbacks.data?.summary?.totalDislikes || 0} />
//         </div>
//         <div className="actions-row">
//           <button className="ghost-btn" onClick={() => react('LIKE')}>Like</button>
//           <button className="ghost-btn" onClick={() => react('DISLIKE')}>Dislike</button>
//         </div>
//       </section>

//       <form className="card form-card" onSubmit={submitFeedback}>
//         <h3>Write feedback</h3>
//         <div className="two-col compact-grid">
//           <label>Rating
//             <select value={feedbackForm.rating} onChange={(e) => setFeedbackForm((p) => ({ ...p, rating: e.target.value }))}>
//               {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
//             </select>
//           </label>
//           <div className="muted small">Only enrolled learners can submit feedback and reaction.</div>
//         </div>
//         <label>Comment<textarea rows="4" value={feedbackForm.comment} onChange={(e) => setFeedbackForm((p) => ({ ...p, comment: e.target.value }))} /></label>
//         <button className="primary-btn" type="submit">Submit feedback</button>
//       </form>

//       <section className="card">
//         <h3>All feedbacks</h3>
//         {!feedbacks.data?.items?.length ? <EmptyState title="No feedback yet" description="Be the first learner to leave a review." /> : (
//           <div className="list-stack">
//             {feedbacks.data.items.map((item) => (
//               <div key={item.Feedback_ID} className="list-item">
//                 <div className="list-head">
//                   <strong>{item.Learner_Full_Name || 'Anonymous learner'}</strong>
//                   <span>{item.Feedback_Rating} / 5</span>
//                 </div>
//                 <p>{item.Feedback_Comment || 'No comment.'}</p>
//                 <small className="muted">{formatDateTime(item.Feedback_Created_At)}</small>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { learnerApi } from '../api/learnerApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useAsync } from '../hooks/useAsync';
import { formatCurrency, formatDateTime } from '../utils/format';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const detail = useAsync(() => learnerApi.getCourseDetail(courseId));
  const feedbacks = useAsync(() => learnerApi.getCourseFeedbacks(courseId), {
    summary: {},
    items: []
  });

  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });
  const [paidProof, setPaidProof] = useState('');
  const [message, setMessage] = useState('');

  const reload = async () => {
    await Promise.all([detail.run(), feedbacks.run()]);
  };

  useEffect(() => {
    reload();
  }, [courseId]);

  const registerFree = async () => {
    try {
      const res = await learnerApi.registerFreeCourse(courseId);
      setMessage(res.message);
      await reload();
    } catch (error) {
      setMessage(error?.message || 'Cannot register free course.');
    }
  };

  // const registerPaid = async () => {
  //   try {
  //     const res = await learnerApi.registerPaidCourse(courseId, {
  //       paymentProof: paidProof || null
  //     });
  //     setMessage(res.message);
  //     await reload();
  //   } catch (error) {
  //     setMessage(error?.message || 'Cannot register paid course.');
  //   }
  // };
  const registerPaid = async () => {
    try {
      const payload = financialSupport
        ? { password: confirmPassword }
        : { paymentProof: paidProof || null };

      const res = await learnerApi.registerPaidCourse(courseId, payload);
      setMessage(res.message);
      setPaidProof('');
      setConfirmPassword('');
      await reload();
    } catch (error) {
      setMessage(error?.message || 'Cannot register paid course.');
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();

    try {
      const res = await learnerApi.saveFeedback(courseId, {
        rating: Number(feedbackForm.rating),
        comment: feedbackForm.comment
      });

      setMessage(res.message);
      setFeedbackForm({ rating: 5, comment: '' });
      await feedbacks.run();
    } catch (error) {
      setMessage(error?.message || 'Cannot submit feedback.');
    }
  };

  const react = async (reactionType) => {
    try {
      const res = await learnerApi.saveReaction(courseId, { reactionType });
      setMessage(res.message);
      await feedbacks.run();
    } catch (error) {
      setMessage(error?.message || 'Cannot save reaction.');
    }
  };

  const goToFinancialRequest = () => {
    navigate('/financial-requests', {
      state: { courseId }
    });
  };

  if (detail.loading && !detail.data) {
    return <LoadingState label="Loading course detail..." />;
  }

  if (!detail.data?.course) {
    return (
      <EmptyState
        title="Course not found"
        description="Please go back to course list."
      />
    );
  }

  const {
    course,
    isSubscribed,
    subscriptionStatus,
    effectiveFee,
    financialSupport,
    hasPendingRequest
  } = detail.data;

  const showFinancialRequestButton =
    !isSubscribed &&
    Number(effectiveFee) > 0 &&
    !hasPendingRequest;

  return (
    <div className="page-stack">
      <PageHeader
        title={course.Course_Name}
        subtitle={course.Course_Overview || 'Course detail'}
      />

      {message ? <div className="alert success">{message}</div> : null}
      {detail.error ? <div className="alert error">{detail.error}</div> : null}
      {feedbacks.error ? <div className="alert error">{feedbacks.error}</div> : null}

      <div className="stats-grid">
        <StatCard label="Field" value={course.Field_Name || 'General'} />
        <StatCard label="Instructor" value={course.Instructor_Full_Name || 'Updating'} />
        <StatCard
          label="Fee"
          value={Number(effectiveFee) > 0 ? formatCurrency(effectiveFee) : 'Free'}
          hint={financialSupport ? 'Applied from financial support' : 'Original/current fee'}
        />
        <StatCard
          label="Subscription"
          value={subscriptionStatus || 'Not enrolled'}
          hint={hasPendingRequest ? 'There is a pending financial request.' : ''}
        />
      </div>

      <section className="card">
        <h3>Objective</h3>
        <p>{course.Course_Objective || 'No objective yet.'}</p>
      </section>

      <section className="card">
        <h3>Registration</h3>

        {isSubscribed ? (
          <div className="alert success">
            You already registered this course with status: {subscriptionStatus}
          </div>
        ) : null}

        {!isSubscribed && Number(effectiveFee) <= 0 ? (
          <button className="primary-btn" type="button" onClick={registerFree}>
            Register free course
          </button>
        ) : null}

        {/* {!isSubscribed && Number(effectiveFee) > 0 ? (
          <>
            <div className="inline-form">
              <input
                placeholder="Payment proof path or note"
                value={paidProof}
                onChange={(e) => setPaidProof(e.target.value)}
              />
              <button className="primary-btn" type="button" onClick={registerPaid}>
                Register paid course
              </button>
            </div>

            <div className="actions-row">
              {showFinancialRequestButton ? (
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={goToFinancialRequest}
                >
                  Request financial support
                </button>
              ) : null}
            </div>
          </>
        ) : null} */}
        {!isSubscribed && Number(effectiveFee) > 0 ? (
        <>
          {financialSupport ? (
            <div className="inline-form">
              <input
                type="password"
                placeholder="Enter password to confirm registration"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="primary-btn" type="button" onClick={registerPaid}>
                Confirm registration
              </button>
            </div>
          ) : (
            <div className="inline-form">
              <input
                placeholder="Payment proof path or note"
                value={paidProof}
                onChange={(e) => setPaidProof(e.target.value)}
              />
              <button className="primary-btn" type="button" onClick={registerPaid}>
                Register paid course
              </button>
            </div>
          )}

          <div className="actions-row">
            {showFinancialRequestButton ? (
              <button
                className="ghost-btn"
                type="button"
                onClick={goToFinancialRequest}
              >
                Request financial support
              </button>
            ) : null}
          </div>
        </>
      ) : null}

        {hasPendingRequest ? (
          <div className="alert">
            You already have a pending financial request for this course.
          </div>
        ) : null}

        {financialSupport ? (
          <p className="muted">
            Financial support approved amount: {formatCurrency(financialSupport.Request_Amount)}
          </p>
        ) : null}
      </section>

      <section className="card">
        <h3>Ratings & reactions</h3>
        <div className="stats-grid compact">
          <StatCard label="Average rating" value={feedbacks.data?.summary?.avgRating || 0} />
          <StatCard label="Feedbacks" value={feedbacks.data?.summary?.totalFeedbacks || 0} />
          <StatCard label="Likes" value={feedbacks.data?.summary?.totalLikes || 0} />
          <StatCard label="Dislikes" value={feedbacks.data?.summary?.totalDislikes || 0} />
        </div>

        <div className="actions-row">
          <button className="ghost-btn" type="button" onClick={() => react('LIKE')}>
            Like
          </button>
          <button className="ghost-btn" type="button" onClick={() => react('DISLIKE')}>
            Dislike
          </button>
        </div>
      </section>

      <form className="card form-card" onSubmit={submitFeedback}>
        <h3>Write feedback</h3>

        <div className="two-col compact-grid">
          <label>
            Rating
            <select
              value={feedbackForm.rating}
              onChange={(e) =>
                setFeedbackForm((p) => ({ ...p, rating: e.target.value }))
              }
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <div className="muted small">
            Only enrolled learners can submit feedback and reaction.
          </div>
        </div>

        <label>
          Comment
          <textarea
            rows="4"
            value={feedbackForm.comment}
            onChange={(e) =>
              setFeedbackForm((p) => ({ ...p, comment: e.target.value }))
            }
          />
        </label>

        <button className="primary-btn" type="submit">
          Submit feedback
        </button>
      </form>

      <section className="card">
        <h3>All feedbacks</h3>

        {!feedbacks.data?.items?.length ? (
          <EmptyState
            title="No feedback yet"
            description="Be the first learner to leave a review."
          />
        ) : (
          <div className="list-stack">
            {feedbacks.data.items.map((item) => (
              <div key={item.Feedback_ID} className="list-item">
                <div className="list-head">
                  <strong>{item.Learner_Full_Name || 'Anonymous learner'}</strong>
                  <span>{item.Feedback_Rating} / 5</span>
                </div>

                <p>{item.Feedback_Comment || 'No comment.'}</p>
                <small className="muted">
                  {formatDateTime(item.Feedback_Created_At)}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}