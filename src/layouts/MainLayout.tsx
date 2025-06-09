import React, { useState, useEffect } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [showCallWalls, setShowCallWalls] = useState(true);
  const [showPutWalls, setShowPutWalls] = useState(true);
  const [showAbsGammaStrikes, setShowAbsGammaStrikes] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 576);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 576);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex">
      {/* Mobile Toggle Button */}
      <button
        className="btn btn-dark d-sm-none position-fixed top-0 start-0 m-3 zindex-tooltip"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ zIndex: 1050 }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 flex-column position-fixed h-100 ${
          sidebarOpen ? "d-flex" : "d-none"
        } d-sm-flex`}
        style={{ width: "235px", zIndex: 1040 }}
      >
        {/* Branding */}
        <div className="mb-3">
          <h3 className="text-white">SPY Gamma</h3>
        </div>

        <hr
          style={{
            borderTop: "1px solid rgb(255, 255, 255)",
            marginBottom: "1rem",
          }}
        />

        {/* Navigation */}
        <ul className="nav flex-column">
          {/* COMMENTARY */}
          <li className="nav-item mt-3">
            <a href="/commentary">
              <div
                className="d-flex align-items-center text-white"
                style={{
                  cursor: "pointer",
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#212529",
                  borderRadius: "5px",
                }}
              >
                <i className="bi bi-journal-text me-2"></i>
                <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  COMMENTARY
                </span>
              </div>
            </a>
          </li>

          {/* CALL WALLS */}
          <li className="nav-item">
            <div
              onClick={() => setShowCallWalls(!showCallWalls)}
              style={{
                cursor: "pointer",
                padding: "0.5rem 1.5rem",
                backgroundColor: "#212529",
                borderRadius: "5px",
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center text-white">
                <i className="bi bi-graph-up me-2"></i>
                <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  CALL WALLS
                </span>
              </div>
              <span>{showCallWalls ? "▼" : "►"}</span>
            </div>

            {showCallWalls && (
              <ul
                className="nav flex-column"
                style={{ marginLeft: "1.5rem", paddingLeft: "0.5rem" }}
              >
                <li className="nav-item">
                  <a
                    className="nav-link text-white"
                    href="/cw-top-5"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Top 5
                  </a>
                </li>
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="nav-item">
                    <a
                      className="nav-link text-white"
                      href={`/cw${n}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {n === 1 ? "Largest Wall" : `${n}th Largest Wall`}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* PUT WALLS */}
          <li className="nav-item mt-3">
            <div
              onClick={() => setShowPutWalls(!showPutWalls)}
              style={{
                cursor: "pointer",
                padding: "0.5rem 1.5rem",
                backgroundColor: "#212529",
                borderRadius: "5px",
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center text-white">
                <i className="bi bi-graph-down me-2"></i>
                <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  PUT WALLS
                </span>
              </div>
              <span>{showPutWalls ? "▼" : "►"}</span>
            </div>

            {showPutWalls && (
              <ul
                className="nav flex-column"
                style={{ marginLeft: "1.5rem", paddingLeft: "0.5rem" }}
              >
                <li className="nav-item">
                  <a
                    className="nav-link text-white"
                    href="/pw-top-5"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Top 5
                  </a>
                </li>
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="nav-item">
                    <a
                      className="nav-link text-white"
                      href={`/pw${n}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {n === 1 ? "Largest Wall" : `${n}th Largest Wall`}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* ABS GAMMA */}
          <li className="nav-item mt-3">
            <div
              onClick={() => setShowAbsGammaStrikes(!showAbsGammaStrikes)}
              style={{
                cursor: "pointer",
                padding: "0.5rem 1.5rem",
                backgroundColor: "#212529",
                borderRadius: "5px",
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center text-white">
                <i className="bi bi-bar-chart-steps me-2"></i>
                <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  ABS GAMMA
                </span>
              </div>
              <span>{showAbsGammaStrikes ? "▼" : "►"}</span>
            </div>

            {showAbsGammaStrikes && (
              <ul
                className="nav flex-column"
                style={{ marginLeft: "1.5rem", paddingLeft: "0.5rem" }}
              >
                <li className="nav-item">
                  <a
                    className="nav-link text-white"
                    href="/abs-gamma-top-3"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Top 3
                  </a>
                </li>
                {[1, 2, 3].map((n) => (
                  <li key={n} className="nav-item">
                    <a
                      className="nav-link text-white"
                      href={`/absgamma${n}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {n === 1 ? "Largest Wall" : `${n}th Largest Wall`}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isDesktop || sidebarOpen ? "235px" : "0",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
