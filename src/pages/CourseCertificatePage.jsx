import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios.js";

function CourseCertificatePage() {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCertificate();
    // eslint-disable-next-line
  }, []);

  const loadCertificate = async () => {
    try {
      const res = await apiClient.get(
        `/courses/${courseId}/certificate`
      );
      setData(res.data);
    } catch (err) {
      alert("Certificate not available yet");
    }
  };

  if (!data) return <h2 style={{ padding: 40 }}>Loading certificate...</h2>;

  return (
    <div style={page} className="certificate-print">
      <div style={certificate}>
        {/* WATERMARK */}
        <div style={watermark}>
          LearnSphere
        </div>

        <h1 style={title}>Certificate of Completion</h1>

        <p>This certifies that</p>
        <h2 style={name}>{data.studentName}</h2>

        <p>has successfully completed the course</p>
        <h3 style={course}>{data.courseTitle}</h3>

        <p>Instructor: {data.instructorName}</p>

        <p style={date}>
          Completed on {new Date(data.completedAt).toLocaleDateString()}
        </p>

        <button
  onClick={() => window.print()}
  style={btn}
  className="no-print"
>

          Download / Print Certificate
        </button>
      </div>
      {/* OFFICIAL SEAL */}
      <div style={seal}>
        <div style={sealInner}>
          <span style={sealTop}>LearnSphere</span>
          <span style={sealMid}>Official</span>
          <span style={sealBottom}>Certificate</span>
        </div>
      </div>

    </div>
  );
}

/* styles */
const page = {
  minHeight: "100vh",
  background: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
};

const certificate = {
  position: "relative",
  background: "white",
  color: "#111827",

  /* 🔥 BIGGER & A4 FEEL */
  width: "100%",
  maxWidth: "1100px",
  minHeight: "750px",

  padding: "90px 100px",
  margin: "40px auto",

  borderRadius: 24,

  /* ✨ STRONGER GOLD BORDER */
  border: "10px solid #d4af37",
  boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
};



const title = {
  fontSize: 48,
  color: "#2563eb",
  fontWeight: 800,
  letterSpacing: "1px",
  marginBottom: 40,
  textTransform: "uppercase",
};

const name = {
  fontSize: 42,
  fontWeight: 800,
  color: "#2563eb",
  margin: "20px 0",
};

const course = {
  fontSize: 28,
  color: "#111827",
  fontWeight: 600,
  margin: "14px 0",
};

const date = {
  marginTop: 40,
  fontSize: 16,
  color: "#475569",
};


const btn = {
  marginTop: 30,
  padding: "12px 24px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const watermark = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) rotate(-30deg)",
  fontSize: 160,
  fontWeight: 900,
  color: "#000",
  opacity: 0.035,
  pointerEvents: "none",
  whiteSpace: "nowrap",
};


const seal = {
  position: "absolute",
  bottom: 40,
  right: 40,
  width: 150,
  height: 150,
  borderRadius: "50%",
  background: "radial-gradient(circle, #facc15, #d4af37)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 12px 35px rgba(0,0,0,0.35)",
};


const sealInner = {
  width: "85%",
  height: "85%",
  borderRadius: "50%",
  background: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

const sealTop = {
  fontSize: 12,
  fontWeight: 700,
};

const sealMid = {
  fontSize: 16,
  fontWeight: 800,
  color: "#d4af37",
};

const sealBottom = {
  fontSize: 11,
  fontWeight: 600,
};


export default CourseCertificatePage;
