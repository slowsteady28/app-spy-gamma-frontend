import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
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

  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => location.pathname === href;

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
        className={`bg-light text-dark p-3 flex-column position-fixed h-100 ${
          sidebarOpen ? "d-flex" : "d-none"
        } d-sm-flex`}
        style={{
          width: collapsed ? "64px" : "235px",
          zIndex: 1040,
          transition: "width 0.2s cubic-bezier(.4,0,.2,1)",
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.07)",
          overflowY: "auto", // <-- Add this line
        }}
      >
        {/* Collapse Button */}
        <button
          className="btn btn-outline-secondary btn-sm mb-3 d-none d-sm-block"
          style={{
            width: "32px",
            height: "32px",
            alignSelf: collapsed ? "center" : "flex-end",
            transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          }}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i
            className={`bi ${
              collapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"
            }`}
          ></i>
        </button>

        {/* Branding */}
        <div className={`mb-3 text-center ${collapsed ? "px-0" : ""}`}>
          <span
            className="fw-bold d-flex align-items-center justify-content-center"
            style={{
              fontSize: "1.35rem",
              color: "#212529",
              letterSpacing: "0.02em",
              display: "flex",
              lineHeight: 1.1,
              gap: "0.5rem",
            }}
          >
            <img
              src="/Logo.png"
              alt="Logo"
              style={{
                width: 32,
                height: 32,
                objectFit: "contain",
                marginRight: "0.25rem",
                verticalAlign: "middle",
              }}
            />
            SPY Gamma
          </span>
          {!collapsed && (
            <span
              className="text-secondary"
              style={{
                fontSize: "0.95rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
                display: "block",
                marginTop: "0.15rem",
              }}
            >
              Decode Market Structure
            </span>
          )}
        </div>

        <hr
          style={{
            borderTop: "1px solid #e9ecef",
            marginBottom: "1rem",
          }}
        />

        {/* Navigation with Section Headings */}
        <ul
          className="nav flex-column sidebar-nav"
          style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          {/* Navigation Section */}
          <li
            className={`nav-item text-uppercase text-secondary small mb-2 mt-3 ps-2 ${
              collapsed ? "d-none" : ""
            }`}
          >
            Navigation
          </li>
          <li className="nav-item">
            <a
              href="/commentary"
              className="nav-link ps-0"
              tabIndex={collapsed ? -1 : 0}
            >
              <div
                className={`d-flex align-items-center ${
                  collapsed ? "justify-content-center" : ""
                }`}
                style={{
                  cursor: "pointer",
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#212529",
                  borderRadius: "5px",
                  color: isActive("/commentary") ? "#0d6efd" : "#fff",
                }}
              >
                <i className="bi bi-journal-text me-2"></i>
                {!collapsed && (
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                    COMMENTARY
                  </span>
                )}
              </div>
            </a>
          </li>

          {/* Walls Section */}
          <li
            className={`nav-item text-uppercase text-secondary small mb-2 mt-4 ps-2 ${
              collapsed ? "d-none" : ""
            }`}
          >
            Walls
          </li>
          {/* CALL WALLS */}
          <li className="nav-item">
            <div
              style={{
                cursor: "pointer",
                padding: "0.5rem 1.5rem",
                backgroundColor: "#212529",
                borderRadius: "5px",
                color: "#fff",
              }}
              className={`d-flex align-items-center ${
                collapsed ? "justify-content-center" : ""
              }`}
              onClick={() => setShowCallWalls(!showCallWalls)}
            >
              <i className="bi bi-graph-up me-2"></i>
              {!collapsed && (
                <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  CALL WALLS
                </span>
              )}
            </div>
            {!collapsed && showCallWalls && (
              <ul
                className="nav flex-column"
                style={{ marginLeft: "1.5rem", paddingLeft: "0.5rem" }}
              >
                <li className="nav-item">
                  <a
                    className={`nav-link${
                      isActive("/cw-top-5") ? " active" : ""
                    }`}
                    href="/cw-top-5"
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/cw-top-5") ? "#0096b4" : "#212529", // <-- Updated color
                      backgroundColor: "transparent",
                      borderRadius: "5px",
                      padding: "0.5rem 1.5rem",
                    }}
                  >
                    Top 5
                  </a>
                </li>
                {[1, 2, 3, 4, 5].map((n) => {
                  const href = `/cw${n}`;
                  return (
                    <li key={n} className="nav-item">
                      <a
                        className={`nav-link${isActive(href) ? " active" : ""}`}
                        href={href}
                        style={{
                          fontSize: "0.85rem",
                          color: isActive(href)
                            ? "#0096b4" // <-- Active link color for Call Walls
                            : "#212529",
                          backgroundColor: "transparent",
                          borderRadius: "5px",
                          padding: "0.5rem 1.5rem",
                        }}
                      >
                        {n === 1
                          ? "Largest Wall"
                          : n === 2
                          ? "2nd Largest Wall"
                          : n === 3
                          ? "3rd Largest Wall"
                          : `${n}th Largest Wall`}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* PUT WALLS */}
          <li className="nav-item mt-3">
            <div
              style={{
                cursor: "pointer",
                padding: "0.5rem 1.5rem",
                backgroundColor: "#212529",
                borderRadius: "5px",
                color: "#fff",
              }}
              className={`d-flex align-items-center ${
                collapsed ? "justify-content-center" : ""
              }`}
              onClick={() => setShowPutWalls(!showPutWalls)}
            >
              <i className="bi bi-graph-down me-2"></i>
              {!collapsed && (
                <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  PUT WALLS
                </span>
              )}
            </div>
            {!collapsed && showPutWalls && (
              <ul
                className="nav flex-column"
                style={{ marginLeft: "1.5rem", paddingLeft: "0.5rem" }}
              >
                <li className="nav-item">
                  <a
                    className={`nav-link${
                      isActive("/pw-top-5") ? " active" : ""
                    }`}
                    href="/pw-top-5"
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/pw-top-5") ? "#6f42c1" : "#212529", // <-- Purple for active
                      backgroundColor: "transparent",
                      borderRadius: "5px",
                      padding: "0.5rem 1.5rem",
                    }}
                  >
                    Top 5
                  </a>
                </li>
                {[1, 2, 3, 4, 5].map((n) => {
                  const href = `/pw${n}`;
                  return (
                    <li key={n} className="nav-item">
                      <a
                        className={`nav-link${isActive(href) ? " active" : ""}`}
                        href={href}
                        style={{
                          fontSize: "0.85rem",
                          color: isActive(href) ? "#6f42c1" : "#212529", // <-- Purple for active
                          backgroundColor: "transparent",
                          borderRadius: "5px",
                          padding: "0.5rem 1.5rem",
                        }}
                      >
                        {n === 1
                          ? "Largest Wall"
                          : n === 2
                          ? "2nd Largest Wall"
                          : n === 3
                          ? "3rd Largest Wall"
                          : `${n}th Largest Wall`}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* ABS GAMMA */}
          <li className="nav-item mt-3">
            <div
              style={{
                cursor: "pointer",
                padding: "0.5rem 1.5rem",
                backgroundColor: "#212529",
                borderRadius: "5px",
                color: "#fff",
              }}
              className={`d-flex align-items-center ${
                collapsed ? "justify-content-center" : ""
              }`}
              onClick={() => setShowAbsGammaStrikes(!showAbsGammaStrikes)}
            >
              <i className="bi bi-bar-chart-steps me-2"></i>
              {!collapsed && (
                <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  ABS GAMMA
                </span>
              )}
            </div>
            {!collapsed && showAbsGammaStrikes && (
              <ul
                className="nav flex-column"
                style={{ marginLeft: "1.5rem", paddingLeft: "0.5rem" }}
              >
                <li className="nav-item">
                  <a
                    className={`nav-link${
                      isActive("/abs-gamma-top-3") ? " active" : ""
                    }`}
                    href="/abs-gamma-top-3"
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/abs-gamma-top-3")
                        ? "#8B0000"
                        : "#212529",
                      backgroundColor: "transparent",
                      borderRadius: "5px",
                      padding: "0.5rem 1.5rem",
                    }}
                  >
                    Top 3
                  </a>
                </li>
                {[1, 2, 3].map((n) => {
                  const href = `/absgamma${n}`;
                  return (
                    <li key={n} className="nav-item">
                      <a
                        className={`nav-link${isActive(href) ? " active" : ""}`}
                        href={href}
                        style={{
                          fontSize: "0.85rem",
                          color: isActive(href) ? "#8B0000" : "#212529",
                          backgroundColor: "transparent",
                          borderRadius: "5px",
                          padding: "0.5rem 1.5rem",
                        }}
                      >
                        {n === 1
                          ? "Largest Wall"
                          : n === 2
                          ? "2nd Largest Wall"
                          : n === 3
                          ? "3rd Largest Wall"
                          : `${n}th Largest Wall`}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* REGIME SHIFT */}
          <li className="nav-item mt-3">
            <div
              style={{
                cursor: "pointer",
                padding: "0.5rem 1.5rem",
                backgroundColor: "#212529",
                borderRadius: "5px",
                color: "#fff",
              }}
              className={`d-flex align-items-center ${
                collapsed ? "justify-content-center" : ""
              }`}
              onClick={() => {}} // No submenu, so no toggle needed
            >
              <i className="bi bi-lightning-charge me-2"></i>
              {!collapsed && (
                <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  REGIME SHIFT
                </span>
              )}
            </div>
            {!collapsed && (
              <ul
                className="nav flex-column"
                style={{ marginLeft: "1.5rem", paddingLeft: "0.5rem" }}
              >
                <li className="nav-item">
                  <a
                    className={`nav-link${
                      isActive("/gamma-flip") ? " active" : ""
                    }`}
                    href="/gamma-flip"
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/gamma-flip") ? "#0096b4" : "#212529",
                      backgroundColor: "transparent",
                      borderRadius: "5px",
                      padding: "0.5rem 1.5rem",
                    }}
                  >
                    Gamma Flip
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* Analytics Section */}
          <li
            className={`nav-item text-uppercase text-secondary small mb-2 mt-4 ps-2 ${
              collapsed ? "d-none" : ""
            }`}
          >
            Analytics
          </li>
          <li className="nav-item">
            <a
              href="/commentary"
              className="nav-link ps-0"
              tabIndex={collapsed ? -1 : 0}
            >
              <div
                className={`d-flex align-items-center ${
                  collapsed ? "justify-content-center" : ""
                }`}
                style={{
                  cursor: "pointer",
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#212529",
                  borderRadius: "5px",
                  color: isActive("/scribble") ? "#0d6efd" : "#fff",
                }}
              >
                <i className="bi bi-pencil-square me-2"></i>
                {!collapsed && (
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                    Coming Soon
                  </span>
                )}
              </div>
            </a>
          </li>

          {/* COMPANY Section */}
          <li
            className={`nav-item text-uppercase text-secondary small mb-2 mt-4 ps-2 ${
              collapsed ? "d-none" : ""
            }`}
          >
            Company
          </li>
          <li className="nav-item">
            <a
              className={`nav-link${isActive("/about") ? " active" : ""}`}
              href="/about"
              style={{
                fontSize: "0.9rem",
                color: isActive("/about") ? "#0096b4" : "#212529",
                backgroundColor: isActive("/about") ? "#e0f7fa" : "transparent",
                borderRadius: "5px",
                padding: "0.5rem 1.5rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
                marginBottom: "2px",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <i
                className="bi bi-info-circle me-2"
                style={{ color: isActive("/about") ? "#0096b4" : "#adb5bd" }}
              ></i>
              {!collapsed && "About"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link${isActive("/careers") ? " active" : ""}`}
              href="/careers"
              style={{
                fontSize: "0.9rem",
                color: isActive("/careers") ? "#0096b4" : "#212529",
                backgroundColor: isActive("/careers")
                  ? "#e0f7fa"
                  : "transparent",
                borderRadius: "5px",
                padding: "0.5rem 1.5rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
                marginBottom: "2px",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <i
                className="bi bi-briefcase me-2"
                style={{ color: isActive("/careers") ? "#0096b4" : "#adb5bd" }}
              ></i>
              {!collapsed && "Careers"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link${isActive("/contact") ? " active" : ""}`}
              href="/contact"
              style={{
                fontSize: "0.9rem",
                color: isActive("/contact") ? "#0096b4" : "#212529",
                backgroundColor: isActive("/contact")
                  ? "#e0f7fa"
                  : "transparent",
                borderRadius: "5px",
                padding: "0.5rem 1.5rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
                marginBottom: "2px",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <i
                className="bi bi-envelope me-2"
                style={{ color: isActive("/contact") ? "#0096b4" : "#adb5bd" }}
              ></i>
              {!collapsed && "Contact"}
            </a>
          </li>
          <li>
            <div
              style={{
                borderTop: "1px solid #e9ecef",
                marginTop: "1.5rem",
                paddingTop: "1rem",
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#adb5bd",
              }}
            >
              &copy; {new Date().getFullYear()} SPY GAMMA
            </div>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft:
            isDesktop || sidebarOpen ? (collapsed ? "64px" : "235px") : "0",
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
