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
    <div className="d-flex ">
      {/* Sidebar - position: fixed */}
      <div
        className={`bg-light text-dark p-3 flex-column position-fixed h-100 ${
          sidebarOpen ? "d-flex" : "d-none"
        } d-sm-flex`}
        style={{
          width: collapsed ? "85px" : "235px",
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
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {n === 1 ? (
                          <>
                            Largest Wall
                            <span
                              style={{
                                background: "#e6f4ea",
                                color: "#34a853",
                                borderRadius: 6,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                padding: "2px 8px",
                                marginLeft: 4,
                                lineHeight: 1,
                                letterSpacing: "0.02em",
                                display: "inline-block",
                              }}
                            >
                              FREE
                            </span>
                          </>
                        ) : n === 2 ? (
                          "2nd Largest Wall"
                        ) : n === 3 ? (
                          "3rd Largest Wall"
                        ) : (
                          `${n}th Largest Wall`
                        )}
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
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {n === 1 ? (
                          <>
                            Largest Wall
                            <span
                              style={{
                                background: "#e6f4ea",
                                color: "#34a853",
                                borderRadius: 6,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                padding: "2px 8px",
                                marginLeft: 4,
                                lineHeight: 1,
                                letterSpacing: "0.02em",
                                display: "inline-block",
                              }}
                            >
                              FREE
                            </span>
                          </>
                        ) : n === 2 ? (
                          "2nd Largest Wall"
                        ) : n === 3 ? (
                          "3rd Largest Wall"
                        ) : (
                          `${n}th Largest Wall`
                        )}
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
                        {n === 1 ? (
                          <>
                            Largest Wall
                            <span
                              style={{
                                background: "#e6f4ea",
                                color: "#34a853",
                                borderRadius: 6,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                padding: "2px 8px",
                                marginLeft: 4,
                                lineHeight: 1,
                                letterSpacing: "0.02em",
                                display: "inline-block",
                              }}
                            >
                              FREE
                            </span>
                          </>
                        ) : n === 2 ? (
                          "2nd Largest Wall"
                        ) : n === 3 ? (
                          "3rd Largest Wall"
                        ) : (
                          `${n}th Largest Wall`
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* DURATION Section */}
          <li
            className={`nav-item text-uppercase text-secondary small mb-2 mt-4 ps-2 ${
              collapsed ? "d-none" : ""
            }`}
          >
            TOP EXPIRATIONS
          </li>
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
            >
              <i className="bi bi-clock-history me-2"></i>
              {!collapsed && (
                <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  CALL GAMMA
                </span>
              )}
            </div>
            {/* Subsection for Call Gamma */}
            {!collapsed && (
              <ul
                className="nav flex-column"
                style={{ marginLeft: "1.5rem", paddingLeft: "0.5rem" }}
              >
                <li className="nav-item">
                  <a
                    className={`nav-link${
                      isActive("/cw1-top-3-expirations") ? " active" : ""
                    }`}
                    href="/cw1-top-3-expirations"
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/cw1-top-3-expirations")
                        ? "#0096b4"
                        : "#212529",
                      backgroundColor: "transparent",
                      borderRadius: "5px",
                      padding: "0.5rem 1.5rem",
                    }}
                  >
                    Largest Wall
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* 
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
              className={`nav-link${
                isActive("/privacy-policy") ? " active" : ""
              }`}
              href="/privacy-policy"
              style={{
                fontSize: "0.9rem",
                color: isActive("/privacy-policy") ? "#0096b4" : "#212529",
                backgroundColor: isActive("/privacy-policy")
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
                className="bi bi-shield-lock me-2"
                style={{
                  color: isActive("/privacy-policy") ? "#0096b4" : "#adb5bd",
                }}
              ></i>
              {!collapsed && "Privacy Policy"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link${
                isActive("/terms-of-service") ? " active" : ""
              }`}
              href="/terms-of-service"
              style={{
                fontSize: "0.9rem",
                color: isActive("/terms-of-service") ? "#0096b4" : "#212529",
                backgroundColor: isActive("/terms-of-service")
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
                className="bi bi-file-text me-2"
                style={{
                  color: isActive("/terms-of-service") ? "#0096b4" : "#adb5bd",
                }}
              ></i>
              {!collapsed && "Terms of Service"}
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
          */}
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft:
            isDesktop || sidebarOpen ? (collapsed ? "64px" : "235px") : "0",
          background:
            "linear-gradient(to right, #f8f9fa 60%, #f1f3f5 90%, #e9ecef 100%)",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
          boxShadow: "inset -20px 0 30px -10px rgba(0,0,0,0.03)", // smooth fade on right edge
          borderTopRightRadius: "1rem", // optional: softens upper right corner
          borderBottomRightRadius: "1rem", // optional: softens lower right corner
          overflowX: "hidden", // prevents sidebar/content overflow
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
