import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import CityDetails from "./pages/CityDetails";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="main-app-layout">
        <Sidebar />

        <div className="main-app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/city/:cityName" element={<CityDetails />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;