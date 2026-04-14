import React from "react";

function Profile() {
  const favoriteCities = [
    { name: "Tokyo", temp: "20°", status: "Cloudy" },
    { name: "Paris", temp: "17°", status: "Clear" },
    { name: "New York", temp: "22°", status: "Windy" },
  ];

  const preferences = [
    { label: "Rain Alerts", value: "Enabled" },
    { label: "Heat Alerts", value: "Enabled" },
    { label: "Wind Alerts", value: "Enabled" },
    { label: "Daily Summary", value: "08:00 AM" },
  ];

  const activity = [
    "Checked Tokyo hourly forecast",
    "Added Paris to favorites",
    "Viewed rain probability details",
    "Opened New York weather metrics",
  ];

  return (
    <div className="advanced-profile-page">
      <div className="profile-page-header">
        <div>
          <div className="brand-label">User Space</div>
          <div className="brand-title">Personal Weather Hub</div>
        </div>

        <div className="profile-header-chip">Live Sync</div>
      </div>

      <div className="advanced-profile-grid">
        <div className="profile-hero-card">
          <div className="profile-hero-top">
            <div className="profile-avatar-xl">KOW</div>

            <div className="profile-hero-info">
              <h1>Kaoutar Omayma  Weather App</h1>
              <p>Forecast Explorer · Smart Weather Tracking</p>

              <div className="profile-tags">
                <span>Storm Watcher</span>
                <span>City Tracker</span>
                <span>Live Alerts On</span>
              </div>
            </div>
          </div>

          <div className="profile-hero-description">
            Your personal weather space is designed to keep every forecast,
            alert, and favorite city in one refined experience. Track changing
            conditions, stay prepared for the day, and explore weather insights
            tailored to your habits.
          </div>

          <div className="profile-hero-stats">
            <div className="profile-stat-pill">
              <strong>4</strong>
              <span>Cities tracked</span>
            </div>

            <div className="profile-stat-pill">
              <strong>24h</strong>
              <span>Forecast mode</span>
            </div>

            <div className="profile-stat-pill">
              <strong>3</strong>
              <span>Active alerts</span>
            </div>

            <div className="profile-stat-pill">
              <strong>98%</strong>
              <span>Sync accuracy</span>
            </div>
          </div>
        </div>

        <div className="profile-persona-card">
          <div className="profile-card-title">Weather Persona</div>

          <div className="persona-orb">☁️</div>

          <h3>Calm Forecast Mode</h3>

          <p>
            You prefer balanced conditions, light cloud cover, and early
            weather visibility with smooth alert timing.
          </p>

          <div className="persona-meter">
            <div className="persona-meter-fill"></div>
          </div>

          <div className="persona-scale">
            <span>Minimal</span>
            <span>Prepared</span>
            <span>Alert-heavy</span>
          </div>
        </div>

        <div className="profile-favorites-card">
          <div className="profile-card-title">Favorite Cities</div>

          <div className="favorites-list">
            {favoriteCities.map((city, index) => (
              <div className="favorite-city-row" key={index}>
                <div>
                  <strong>{city.name}</strong>
                  <span>{city.status}</span>
                </div>

                <div className="favorite-city-temp">{city.temp}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-preferences-card">
          <div className="profile-card-title">Alert Preferences</div>

          <div className="preferences-list">
            {preferences.map((item, index) => (
              <div className="preference-row" key={index}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-activity-card">
          <div className="profile-card-title">Recent Activity</div>

          <div className="activity-timeline">
            {activity.map((item, index) => (
              <div className="activity-item" key={index}>
                <div className="activity-dot"></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-actions-card">
          <div className="profile-card-title">Quick Actions</div>

          <div className="profile-actions-grid">
            <button className="profile-action-btn">Add City</button>
            <button className="profile-action-btn">Manage Alerts</button>
            <button className="profile-action-btn">View Forecasts</button>
            <button className="profile-action-btn">Export Summary</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;