import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./pages.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const res = await api.get("/learner/courses");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Explore Courses</h1>
          <p>Discover free and premium courses to continue your learning journey.</p>
        </div>

        <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>
          Back Dashboard
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="empty-card">
          <h3>No courses found</h3>
          <p>There are no courses available at the moment.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((c) => (
            <div key={c.courseId} className="course-card">
              <div className="course-thumb">
                <span className="course-badge">
                  {Number(c.courseFee) === 0 ? "Free" : "Premium"}
                </span>
              </div>

              <div className="course-body">
                <h3>{c.courseName}</h3>

                <div className="course-meta">
                  <span>Course ID: {c.courseId}</span>
                  <span>{Number(c.courseFee) === 0 ? "Free" : "Paid"}</span>
                </div>

                <p className="course-desc">
                  {c.courseOverview || "No description available for this course yet."}
                </p>

                <div className="course-footer">
                  <span className="price">
                    {Number(c.courseFee) === 0
                      ? "Free"
                      : `${Number(c.courseFee).toLocaleString("vi-VN")} VNĐ`}
                  </span>

                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/courses/${c.courseId}`)}
                  >
                    View Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}