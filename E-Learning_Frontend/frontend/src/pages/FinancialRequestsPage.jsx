// import { useEffect, useState } from 'react';
// import { learnerApi } from '../api/learnerApi';
// import EmptyState from '../components/EmptyState';
// import LoadingState from '../components/LoadingState';
// import PageHeader from '../components/PageHeader';
// import { useAsync } from '../hooks/useAsync';

// import { formatCurrency } from '../utils/format';

// const initialForm = {
//   courseId: '',
//   supportPercent: 50,
//   reason: '',
//   educationalBackground: '',
//   employmentStatus: '',
//   proof: ''
// };

// export default function FinancialRequestsPage() {
//   const requests = useAsync(learnerApi.getFinancialRequests, []);
//   const [form, setForm] = useState(initialForm);
//   const [message, setMessage] = useState('');

//   useEffect(() => { requests.run(); }, []);

//   const submit = async (e) => {
//     e.preventDefault();
//     const res = await learnerApi.createFinancialRequest({ ...form, supportPercent: Number(form.supportPercent) });
//     setMessage(`${res.message} Requested amount: ${formatCurrency(res.requestAmount)}`);
//     setForm(initialForm);
//     requests.run();
//   };

//   return (
//     <div className="page-stack">
//       <PageHeader title="Financial Requests" subtitle="Ask for fee support before course registration." />
//       {message ? <div className="alert success">{message}</div> : null}
//       {requests.error ? <div className="alert error">{requests.error}</div> : null}

//       <form className="card form-card" onSubmit={submit}>
//         <h3>Create request</h3>
//         <div className="three-col">
//           <label>Course ID<input value={form.courseId} onChange={(e) => setForm((p) => ({ ...p, courseId: e.target.value }))} placeholder="CRS001" /></label>
//           <label>Support percent<input type="number" min="0" max="100" value={form.supportPercent} onChange={(e) => setForm((p) => ({ ...p, supportPercent: e.target.value }))} /></label>
//           <label>Employment status<input value={form.employmentStatus} onChange={(e) => setForm((p) => ({ ...p, employmentStatus: e.target.value }))} /></label>
//         </div>
//         <div className="two-col">
//           <label>Educational background<textarea rows="3" value={form.educationalBackground} onChange={(e) => setForm((p) => ({ ...p, educationalBackground: e.target.value }))} /></label>
//           <label>Reason<textarea rows="3" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} /></label>
//         </div>
//         <label>Proof path or note<input value={form.proof} onChange={(e) => setForm((p) => ({ ...p, proof: e.target.value }))} /></label>
//         <button className="primary-btn" type="submit">Submit request</button>
//       </form>

//       {requests.loading ? <LoadingState label="Loading requests..." /> : null}
//       {!requests.loading && !requests.data?.length ? <EmptyState title="No request yet" description="Create your first financial request above." /> : null}

//       <div className="table-card card">
//         <table>
//           <thead>
//             <tr>
//               <th>Request ID</th>
//               <th>Course</th>
//               <th>Amount</th>
//               <th>Status</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.data?.map((item) => (
//               <tr key={item.Request_ID}>
//                 <td>{item.Request_ID}</td>
//                 <td>{item.Course_Name}</td>
//                 <td>{formatCurrency(item.Request_Amount)}</td>
//                 <td>{item.Request_Status}</td>
//                 <td>{item.Request_Date}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { learnerApi } from '../api/learnerApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';
import { formatCurrency } from '../utils/format';

const initialForm = {
  courseId: '',
  supportPercent: 50,
  reason: '',
  educationalBackground: '',
  employmentStatus: '',
  proof: ''
};

export default function FinancialRequestsPage() {
  const location = useLocation();

  const requests = useAsync(learnerApi.getFinancialRequests, []);
  const courses = useAsync(() => learnerApi.getCourses({ status: 'AVAILABLE' }), []);

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  useEffect(() => {
    requests.run();
    courses.run();
  }, []);

  useEffect(() => {
    const preselectedCourseId = location.state?.courseId || '';
    if (preselectedCourseId) {
      setForm((prev) => ({
        ...prev,
        courseId: preselectedCourseId
      }));
    }
  }, [location.state]);

  const selectedCourse = useMemo(() => {
    return courses.data?.find((item) => item.Course_ID === form.courseId) || null;
  }, [courses.data, form.courseId]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await learnerApi.createFinancialRequest({
        ...form,
        supportPercent: Number(form.supportPercent)
      });

      setMessage(`${res.message} Requested amount: ${formatCurrency(res.requestAmount)}`);

      setForm((prev) => ({
        ...initialForm,
        courseId: prev.courseId
      }));

      await requests.run();
    } catch (error) {
      setMessage(error?.message || 'Cannot create financial request.');
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Financial Requests"
        subtitle="Ask for fee support before course registration."
      />

      {message ? <div className="alert success">{message}</div> : null}
      {requests.error ? <div className="alert error">{requests.error}</div> : null}
      {courses.error ? <div className="alert error">{courses.error}</div> : null}

      <form className="card form-card" onSubmit={submit}>
        <h3>Create request</h3>

        <div className="three-col">
          <label>
            Course
            <select
              value={form.courseId}
              onChange={(e) => setForm((p) => ({ ...p, courseId: e.target.value }))}
              required
            >
              <option value="">Select a course</option>
              {courses.data?.map((course) => (
                <option key={course.Course_ID} value={course.Course_ID}>
                  {course.Course_Name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Support percent
            <input
              type="number"
              min="0"
              max="100"
              value={form.supportPercent}
              onChange={(e) => setForm((p) => ({ ...p, supportPercent: e.target.value }))}
              required
            />
          </label>

          <label>
            Employment status
            <input
              value={form.employmentStatus}
              onChange={(e) => setForm((p) => ({ ...p, employmentStatus: e.target.value }))}
              placeholder="Student, Part-time, Unemployed..."
            />
          </label>
        </div>

        {selectedCourse ? (
          <div className="alert">
            Selected course: <strong>{selectedCourse.Course_Name}</strong>
            {selectedCourse.Course_Fee != null ? (
              <> — Fee: <strong>{formatCurrency(selectedCourse.Course_Fee)}</strong></>
            ) : null}
          </div>
        ) : null}

        <div className="two-col">
          <label>
            Educational background
            <textarea
              rows="3"
              value={form.educationalBackground}
              onChange={(e) => setForm((p) => ({ ...p, educationalBackground: e.target.value }))}
              placeholder="Example: High school graduate, 2nd year university..."
            />
          </label>

          <label>
            Reason
            <textarea
              rows="3"
              value={form.reason}
              onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
              placeholder="Tell us why you need financial support..."
            />
          </label>
        </div>

        <label>
          Proof path or note
          <input
            value={form.proof}
            onChange={(e) => setForm((p) => ({ ...p, proof: e.target.value }))}
            placeholder="Optional proof path or note"
          />
        </label>

        <button className="primary-btn" type="submit" disabled={!form.courseId}>
          Submit request
        </button>
      </form>

      {requests.loading ? <LoadingState label="Loading requests..." /> : null}

      {!requests.loading && !requests.data?.length ? (
        <EmptyState
          title="No request yet"
          description="Create your first financial request above."
        />
      ) : null}

      {!!requests.data?.length && (
        <div className="table-card card">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.data.map((item) => (
                <tr key={item.Request_ID}>
                  <td>{item.Request_ID}</td>
                  <td>{item.Course_Name}</td>
                  <td>{formatCurrency(item.Request_Amount)}</td>
                  <td>{item.Request_Status}</td>
                  <td>{item.Request_Date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}