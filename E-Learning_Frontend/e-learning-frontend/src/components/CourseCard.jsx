import { useNavigate } from "react-router-dom";
import "./CourseCard.css";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  if (!course) return null;

  const {
    courseId = course.Course_ID,
    courseName = course.Course_Name || course.title,
    courseOverview = course.Course_Overview || course.overview,
    courseFee = course.Course_Fee ?? course.fee ?? 0,
    courseStatus = course.Course_Status || course.status,
    fieldName = course.Field_Name || course.fieldName,
  } = course;

  const handleViewDetail = () => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="course-card">
      <div className="course-card-header">
        <span className="course-badge">{fieldName || "General"}</span>
        <span
          className={`course-status ${
            courseStatus === "Active" ? "active" : "inactive"
          }`}
        >
          {courseStatus || "Unknown"}
        </span>
      </div>

      <div className="course-card-body">
        <h3 className="course-title">{courseName}</h3>
        <p className="course-overview">
          {courseOverview || "No overview available"}
        </p>
      </div>

      <div className="course-card-footer">
        <div className="course-price">
          {Number(courseFee) === 0
            ? "Miễn phí"
            : `${Number(courseFee).toLocaleString("vi-VN")} VNĐ`}
        </div>

        <button className="course-btn" onClick={handleViewDetail}>
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}