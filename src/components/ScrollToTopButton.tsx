import { useEffect, useState } from "react";

const buttonStyle: React.CSSProperties = {
  position: "fixed",
  right: "2rem",
  bottom: "2rem",
  zIndex: 9999,
  background: "rgb(191, 23, 45)",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  cursor: "pointer",
  transition: "opacity 0.2s",
};

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      aria-label="Scroll to top"
      style={buttonStyle}
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
}
