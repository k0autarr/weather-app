import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaHome, FaBell, FaUser } from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: FaHome },
    { path: "/notifications", label: "Alerts", icon: FaBell },
    { path: "/profile", label: "Profile", icon: FaUser },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🌤️</div>

      <div className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon; // 👈 VERY IMPORTANT

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="sidebar-icon">
                <Icon /> {/* 👈 correct rendering */}
              </span>

              <span className="sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="sidebar-user-mini">
        <div className="sidebar-user-avatar">
          <FaUserCircle />
        </div>
        <div className="sidebar-user-status">Online</div>
      </div>
    </aside>
  );
}

export default Sidebar;