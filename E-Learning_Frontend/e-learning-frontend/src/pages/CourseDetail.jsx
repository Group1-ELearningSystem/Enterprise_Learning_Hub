import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import "./pages.css";

export default function CourseDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDetail();
  }, [id]);

  async function loadDetail() {
    try {
      const res = await api.get(`/learner/courses/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function registerFree() {
    try {
      await api.post(`/learner/courses/${id}/register-free`);
      alert("Registered successfully!");
      navigate("/my-learning");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  }

  if (!data) {
    return (
      <div className="page-shell">
        <div className="loading-card">Loading course detail...</div>
      </div>
    );
  }

  const { course, isSubscribed, subscriptionStatus, effectiveFee } = data;

  return (
    <div className="page-shell">
      <div className="detail-topbar">
        <button className="btn btn-outline" onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
      </div>

      <div className="course-detail-card">
        <div className="course-detail-hero">
          <div className="course-detail-left">
            <span className="detail-badge">
              {Number(effectiveFee) === 0 ? "Free Course" : "Paid Course"}
            </span>

            <h1>{course.courseName}</h1>
            <p>{course.courseOverview || "No overview available."}</p>

            <div className="detail-info-row">
              <div className="detail-info-box">
                <span className="detail-label">Price</span>
                <strong>
                  {Number(effectiveFee) === 0
                    ? "Free"
                    : `${Number(effectiveFee).toLocaleString("vi-VN")} VNĐ`}
                </strong>
              </div>

              <div className="detail-info-box">
                <span className="detail-label">Status</span>
                <strong>{subscriptionStatus || "Not enrolled"}</strong>
              </div>

              <div className="detail-info-box">
                <span className="detail-label">Enrollment</span>
                <strong>{isSubscribed ? "Subscribed" : "Not yet"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="course-detail-body">
          <div className="detail-section">
            <h2>About this course</h2>
            <p>
              {course.courseOverview ||
                "This course does not have a detailed overview yet."}
            </p>
          </div>

          <div className="detail-action-box">
            {isSubscribed ? (
              <button
                className="btn btn-primary full-btn"
                onClick={() => navigate("/my-learning")}
              >
                Go to My Learning
              </button>
            ) : Number(effectiveFee) === 0 ? (
              <button className="btn btn-primary full-btn" onClick={registerFree}>
                Enroll Free
              </button>
            ) : (
              <button className="btn btn-disabled full-btn" disabled>
                Paid Course
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}