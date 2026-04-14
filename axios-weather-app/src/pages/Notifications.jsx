import React from "react";
import { FaBell, FaCloudRain, FaSun, FaWind, FaBolt, FaCheckCircle } from "react-icons/fa";

function Notifications() {
  const featuredAlert = {
    title: "Rain expected tonight",
    message:
      "A high chance of rain is expected later this evening. Consider carrying an umbrella and checking the hourly forecast before heading out.",
    time: "Tonight · 10:00 PM",
    severity: "High Priority",
    icon: <FaCloudRain />,
  };

  const alerts = [
    {
      type: "Rain Alert",
      message: "Rain may arrive later this evening. Take an umbrella with you.",
      icon: <FaCloudRain />,
      level: "high",
      time: "10 min ago",
    },
    {
      type: "Heat Alert",
      message: "Temperatures could feel higher this afternoon. Stay hydrated.",
      icon: <FaSun />,
      level: "medium",
      time: "25 min ago",
    },
    {
      type: "Wind Alert",
      message: "Winds may become stronger during the night.",
      icon: <FaWind />,
      level: "medium",
      time: "1 hour ago",
    },
    {
      type: "Storm Watch",
      message: "Atmospheric pressure is dropping. Keep an eye on changing conditions.",
      icon: <FaBolt />,
      level: "high",
      time: "2 hours ago",
    },
    {
      type: "Stable Conditions",
      message: "No major weather disruptions expected for the early morning.",
      icon: <FaCheckCircle />,
      level: "low",
      time: "3 hours ago",
    },
  ];

  const summary = [
    { label: "Active Alerts", value: "04" },
    { label: "High Priority", value: "02" },
    { label: "Cities Covered", value: "03" },
    { label: "Next Update", value: "15m" },
  ];

  const getLevelClass = (level) => {
    if (level === "high") return "alert-high";
    if (level === "medium") return "alert-medium";
    return "alert-low";
  };

  return (
    <div className="alerts-page-premium">
      <div className="alerts-header">
        <div>
          <div className="brand-label">System Notifications</div>
          <div className="brand-title">Weather Alerts Center</div>
          <p className="alerts-subtitle">
            Smart weather monitoring designed to keep your day clear, prepared, and under control.
          </p>
        </div>

        <div className="alerts-header-chip">
          <FaBell />
          <span>Live Monitoring</span>
        </div>
      </div>

      <div className="alerts-summary-grid">
        {summary.map((item, index) => (
          <div className="alerts-summary-card" key={index}>
            <div className="alerts-summary-value">{item.value}</div>
            <div className="alerts-summary-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="alerts-main-grid">
        <div className="alerts-left-column">
          <div className="featured-alert-card">
            <div className="featured-alert-top">
              <div className="featured-alert-icon">{featuredAlert.icon}</div>

              <div className="featured-alert-meta">
                <div className="featured-alert-badge">{featuredAlert.severity}</div>
                <h2>{featuredAlert.title}</h2>
                <p>{featuredAlert.message}</p>
              </div>
            </div>

            <div className="featured-alert-footer">
              <span>{featuredAlert.time}</span>
              <button className="featured-alert-btn">View Forecast</button>
            </div>
          </div>

          <div className="alerts-feed-card">
            <div className="alerts-section-head">
              <h3>Alert Feed</h3>
              <span>Latest updates</span>
            </div>

            <div className="alerts-feed-list">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`alert-feed-item ${getLevelClass(alert.level)}`}
                >
                  <div className="alert-feed-glow"></div>

                  <div className="alert-feed-icon">{alert.icon}</div>

                  <div className="alert-feed-content">
                    <div className="alert-feed-topline">
                      <strong>{alert.type}</strong>
                      <span>{alert.time}</span>
                    </div>

                    <p>{alert.message}</p>
                  </div>

                  <div className="alert-feed-level">
                    {alert.level === "high"
                      ? "High"
                      : alert.level === "medium"
                      ? "Medium"
                      : "Low"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="alerts-right-column">
          <div className="alerts-assistant-card">
            <div className="alerts-section-head">
              <h3>Smart Assistant</h3>
              <span>Personal guidance</span>
            </div>

            <div className="assistant-orb">🌤️</div>

            <div className="assistant-text">
              Based on current conditions, tonight is the only period that may need extra attention.
              Carrying an umbrella and checking the hourly forecast before going out would be a smart move.
            </div>
          </div>

          <div className="alerts-timeline-card">
            <div className="alerts-section-head">
              <h3>Today Timeline</h3>
              <span>Weather flow</span>
            </div>

            <div className="alerts-timeline">
              <div className="timeline-item">
                <div className="timeline-dot high"></div>
                <div>
                  <strong>10:00 PM</strong>
                  <p>Rain probability rises sharply.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot medium"></div>
                <div>
                  <strong>03:00 PM</strong>
                  <p>Feels-like temperature reaches peak.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot medium"></div>
                <div>
                  <strong>01:00 AM</strong>
                  <p>Wind speed may increase overnight.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot low"></div>
                <div>
                  <strong>06:00 AM</strong>
                  <p>Conditions return to stable.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="alerts-settings-card">
            <div className="alerts-section-head">
              <h3>Alert Modes</h3>
              <span>Preferences</span>
            </div>

            <div className="alert-mode-row">
              <span>Rain warnings</span>
              <strong>Enabled</strong>
            </div>

            <div className="alert-mode-row">
              <span>Heat warnings</span>
              <strong>Enabled</strong>
            </div>

            <div className="alert-mode-row">
              <span>Wind warnings</span>
              <strong>Enabled</strong>
            </div>

            <div className="alert-mode-row">
              <span>Push summary</span>
              <strong>8:00 AM</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;