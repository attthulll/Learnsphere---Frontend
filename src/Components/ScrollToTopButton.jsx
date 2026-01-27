import { useEffect, useState } from "react";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      style={btn}
    >
      ↑
    </button>
  );
}

const btn = {
  position: "fixed",
  bottom: 30,
  right: 30,
  width: 46,
  height: 46,
  borderRadius: "50%",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontSize: 22,
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  zIndex: 1000,
};

export default ScrollToTopButton;
