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
import Chatbotmap from "./components/NguoiDung/AudioMapAI";
import FoodTourHome from "./components/Home/FoodTourHome";



import CuaHang from "./components/CuaHang/CuaHang";
import TCCuaHang from "./components/CuaHang/TrangChuCH";
import QLCuaHang from "./components/QuanTri/CuaHang/QuanLyCH";
import DanhSachBanDich from "./components/BanDich/DanhSachBanDich";
import DanhSachGiongDoc from "./components/CuaHang/DanhSachGiongDoc";
import XemchitietCH from "./components/QuanTri/CuaHang/XemChiTietCH";
import DuyetCuaHang from './components/QuanTri/CuaHang/DuyetCuaHang';
import QuanLyTour from './components/QuanTri/Tour/QuanLyTour';
import AddTour from './components/QuanTri/Tour/AddTour';
import EditTour from './components/QuanTri/Tour/EditTour';
import AddCuaHang from "./components/QuanTri/CuaHang/AddCuaHang";
import EditCuaHang from "./components/QuanTri/CuaHang/EditCuaHang";
import TCadmin from "./components/QuanTri/TrangChuQT";
import Mhad from "./components/QuanTri/Dashboard";
import POIForm from "./components/QuanTri/POIForm";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			 <Route path="/mhuser" element={<MHuser />} />
          <Route path="/mhuserfree" element={<MHuserfree />} />
		    <Route path="/settings" element={<SettingsUI />} />
		    <Route path="/foodplanner" element={<FoodPlanner />} />
		    <Route path="/audio-map" element={<Chatbotmap />} />
		    <Route path="/homechoose" element={<FoodTourHome />} />

{/* -------------------------------------------------------------------------------- */}
      <Route path="/store" element={<CuaHang />} />
   <Route path="/store/home" element={<TCCuaHang />} />
      <Route path="/store/bandich" element={<DanhSachBanDich />} />
      <Route path="/admin" element={<TCadmin />} />
      <Route path="/admin/qlch" element={<QLCuaHang />} />
      <Route path="/voice" element={<DanhSachGiongDoc />} />
      <Route path="/admin/qlch/:id" element={<XemchitietCH />} />
  <Route path="/admin/qlch/add" element={<AddCuaHang />} />
      <Route path="/admin/qlch/edit/:id" element={<EditCuaHang />} />
	   <Route path="/admin/tours/edit/:id" element={<EditTour />} />
      <Route path="/admin/hopdong" element={<DuyetCuaHang />} />
    <Route path="/admin/qlch/add" element={<AddCuaHang />} />
    <Route path="/admin/qlch/edit/:id" element={<EditCuaHang />} />
 <Route path="/admin/tours" element={<QuanLyTour />} />
      <Route path="/admin/tours/add" element={<AddTour />} />


	        <Route path="/mhad" element={<Mhad />} />

		</Routes>	
	);
}