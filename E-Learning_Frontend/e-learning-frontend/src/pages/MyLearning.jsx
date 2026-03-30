import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./pages.css";

export default function MyLearning() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyCourses();
  }, []);

  async function loadMyCourses() {
    try {
      const res = await api.get("/learner/my-courses");
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>My Learning</h1>
          <p>Track all courses you have enrolled in and continue learning.</p>
        </div>

        <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>
          Back Dashboard
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="empty-card">
          <h3>No enrolled courses</h3>
          <p>You have not enrolled in any course yet.</p>
        </div>
      ) : (
        <div className="my-learning-grid">
          {courses.map((c) => (
            <div key={c.courseId} className="learning-card">
              <div className="learning-card-top">
                <span className="status-badge">{c.subscriptionStatus}</span>
              </div>

              <h3>{c.courseName}</h3>
              <p className="learning-desc">
                Continue your course and stay consistent with your study plan.
              </p>

              <div className="learning-footer">
                <div>
                  <span className="detail-label">Status</span>
                  <strong>{c.subscriptionStatus}</strong>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/courses/${c.courseId}`)}
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}