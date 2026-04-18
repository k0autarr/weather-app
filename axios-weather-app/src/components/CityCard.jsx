import React from "react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

function CityCard({ cityData, onSelectCity }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    onSelectCity(cityData);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/city/${encodeURIComponent(cityData.city)}`, {
      state: { cityData },
    });
  };

  return (
    <div className="city-card" onClick={handleCardClick}>
      <img
        src={cityData?.image || FALLBACK_IMAGE}
        alt={cityData?.city || "City"}
        className="city-card-image"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />

      <div className="city-card-top">
        <div className="city-temp-badge">
          {Math.round(cityData?.temp ?? 0)}°
        </div>

        <div className="city-condition">
          {cityData?.condition || "Weather"}
        </div>
      </div>

      <div className="city-card-bottom">
        <div>
          <div className="city-name">{cityData?.city || "Unknown City"}</div>
          <div className="city-country">{cityData?.country || "--"}</div>
        </div>

        <div className="city-card-action" onClick={handleViewDetails}>
          View Details →
        </div>
      </div>
    </div>
  );
}

export default CityCard;