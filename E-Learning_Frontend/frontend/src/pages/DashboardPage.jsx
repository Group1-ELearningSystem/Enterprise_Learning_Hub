export default function Dashboard() {
  const goToGeneralLogin = () => {
    window.location.href =
      "http://127.0.0.1:5500/E-Learning_Frontend/General/pages/login.html";
  };

  const goToLearnerLogin = () => {
    window.location.href = "http://localhost:5173/login";
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>E-Learning Dashboard</h1>
        <p style={styles.subtitle}>Chọn loại đăng nhập phù hợp với bạn</p>

        <div style={styles.group}>
          <div style={styles.box}>
            <h2 style={styles.boxTitle}>Instructor / Employee</h2>
            <p style={styles.text}>
              Đăng nhập cho Instructor, Employee và Register ở hệ thống General.
            </p>
            <button style={styles.generalBtn} onClick={goToGeneralLogin}>
              Đi đến General Login
            </button>
          </div>

          <div style={styles.box}>
            <h2 style={styles.boxTitle}>Learner</h2>
            <p style={styles.text}>
              Đăng nhập dành riêng cho Learner ở hệ thống React frontend.
            </p>
            <button style={styles.learnerBtn} onClick={goToLearnerLogin}>
              Đi đến Learner Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "24px",
    padding: "50px 30px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  },
  title: {
    fontSize: "40px",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#cbd5e1",
    marginBottom: "40px",
  },
  group: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  box: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "30px 20px",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  boxTitle: {
    fontSize: "24px",
    marginBottom: "12px",
  },
  text: {
    fontSize: "15px",
    color: "#dbeafe",
    marginBottom: "22px",
    minHeight: "48px",
  },
  generalBtn: {
    width: "100%",
    padding: "14px 18px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    background: "#38bdf8",
    color: "#0f172a",
  },
  learnerBtn: {
    width: "100%",
    padding: "14px 18px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    background: "#a78bfa",
    color: "white",
  },
};