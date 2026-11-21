// client/frontend/src/App.jsx
import "./App.css";

import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Authenticator/Login";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import MHuser from "./components/NguoiDung/AudioMapUI";
import MHuserfree from "./components/NguoiDung/AudioMapFreeUI";
import SettingsUI from "./components/NguoiDung/SettingsUI";
import FoodPlanner from "./components/Trip Planner/FoodPlanner";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			 <Route path="/mhuser" element={<MHuser />} />
          <Route path="/mhuserfree" element={<MHuserfree />} />
		    <Route path="/settings" element={<SettingsUI />} />
		    <Route path="/foodplanner" element={<FoodPlanner />} />

		</Routes>
	);
}