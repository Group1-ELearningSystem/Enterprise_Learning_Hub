import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>
      <aside
        style={{
          width: "250px",
          background: "#111827",
          color: "#fff",
          padding: "24px 18px",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ margin: 0 }}>E-Learning</h2>
        </div>

        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "14px" }}>
          Learner
        </p>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button onClick={() => navigate("/dashboard")} style={menuBtn(true)}>
            Dashboard
          </button>
          <button onClick={() => navigate("/courses")} style={menuBtn()}>
            Explore Courses
          </button>
          <button onClick={() => navigate("/my-learning")} style={menuBtn()}>
            My Learning
          </button>
          <button style={menuBtn()}>Sessions</button>
          <button style={menuBtn()}>Payments</button>
          <button style={menuBtn()}>Settings</button>
          <button onClick={handleLogout} style={logoutBtn()}>
            Logout
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "24px" }}>
        <div
          style={{
            background: "#fff",
            padding: "16px 20px",
            borderRadius: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <input
            type="text"
            placeholder="Search courses, instructors, lessons..."
            style={{
              width: "60%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={outlineBtn()}>Notifications</button>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#d1d5db",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <h2>Continue your learning journey today</h2>
            <p style={{ lineHeight: "1.6" }}>
              Track your progress, explore new courses, and stay on top of your
              upcoming lessons with a clean learner dashboard.
            </p>
            <button
              onClick={() => navigate("/my-learning")}
              style={{
                marginTop: "12px",
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #fff",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              View My Courses
            </button>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Your Weekly Progress</h3>
            <p style={{ marginBottom: "12px" }}>You completed 4 lessons this week.</p>

            <div
              style={{
                width: "100%",
                height: "10px",
                background: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "72%",
                  height: "100%",
                  background: "#2563eb",
                }}
              />
            </div>

            <small>72% learning goal completed</small>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <StatCard title="Enrolled Courses" value="08" />
          <StatCard title="Completed Lessons" value="24" />
          <StatCard title="Certificates" value="03" />
          <StatCard title="Study Hours" value="56h" />
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Continue Learning</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            <CourseProgressCard
              category="Programming"
              title="JavaScript Basics"
              meta1="8 lessons"
              meta2="Beginner"
              description="Build strong foundations in JavaScript syntax, DOM, and events."
              progress="65%"
            />

            <CourseProgressCard
              category="Design"
              title="UI/UX Design Fundamentals"
              meta1="12 lessons"
              meta2="Intermediate"
              description="Learn layout, spacing, color systems, and wireframing principles."
              progress="40%"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
      }}
    >
      <p style={{ color: "#6b7280", marginBottom: "8px" }}>{title}</p>
      <h3 style={{ margin: 0 }}>{value}</h3>
    </div>
  );
}

function CourseProgressCard({
  category,
  title,
  meta1,
  meta2,
  description,
  progress,
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "120px",
          background: "#dbeafe",
          padding: "14px",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {category}
        </span>
      </div>

      <div style={{ padding: "18px" }}>
        <h3>{title}</h3>

        <div
          style={{
            display: "flex",
            gap: "12px",
            color: "#6b7280",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          <span>{meta1}</span>
          <span>{meta2}</span>
        </div>

        <p style={{ color: "#4b5563", lineHeight: "1.6" }}>{description}</p>

        <div
          style={{
            width: "100%",
            height: "10px",
            background: "#e5e7eb",
            borderRadius: "999px",
            overflow: "hidden",
            margin: "14px 0",
          }}
        >
          <div
            style={{
              width: progress,
              height: "100%",
              background: "#2563eb",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#2563eb", fontWeight: "600" }}>
            {progress} completed
          </span>
          <button style={primaryBtn()}>Resume</button>
        </div>
      </div>
    </div>
  );
}

function menuBtn(active = false) {
  return {
    background: active ? "#2563eb" : "transparent",
    color: "#fff",
    border: "none",
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  };
}

function logoutBtn() {
  return {
    marginTop: "16px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  };
}

function outlineBtn() {
  return {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
  };
}

function primaryBtn() {
  return {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  };
}