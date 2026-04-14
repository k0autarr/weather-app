import React from "react";
import { useNavigate } from "react-router-dom";

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
        src={cityData.image}
        alt={cityData.city}
        className="city-card-image"
      />

      <div className="city-card-top">
        <div className="city-temp-badge">{Math.round(cityData.temp)}°</div>
        <div className="city-condition">{cityData.condition}</div>
      </div>

      <div className="city-card-bottom">
        <div>
          <div className="city-name">{cityData.city}</div>
          <div className="city-country">{cityData.country}</div>
        </div>

        <div className="city-card-action" onClick={handleViewDetails}>
          View Details →
        </div>
      </div>
    </div>
  );
}

export default CityCard;