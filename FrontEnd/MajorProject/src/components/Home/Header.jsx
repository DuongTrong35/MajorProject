
// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Kiểm tra theme đã lưu trước đó
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setDarkMode(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const handleThemeChange = (e) => {
    const isDark = e.target.checked;

    setDarkMode(isDark);

    if (isDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      {/* header */}
      <header id="site-header" className="fixed-top">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light">

            <Link to="/home" className="navbar-brand">
              <i className="fas fa-utensils"></i>
              Konoha Trip
            </Link>

            <button
              className="navbar-toggler collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarScroll"
              aria-controls="navbarScroll"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon fa icon-expand fa-bars"></span>
              <span className="navbar-toggler-icon fa icon-close fa-times"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarScroll">
              <ul className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll">

                <li className="nav-item">
                  <Link
                    to="/home"
                    className="nav-link active"
                    aria-current="page"
                  >
                    Trang chủ
                  </Link>
                </li>

                {/* <li className="nav-item">
                  <Link to="/courses" className="nav-link">
                    Courses
                  </Link>
                </li> */}

                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Đăng nhập
                  </Link>
                </li>

              </ul>
            </div>

            {/* toggle switch for light and dark theme */}
            <div className="cont-ser-position">
              <nav className="navigation">
                <div className="theme-switch-wrapper">
                  <label className="theme-switch" htmlFor="checkbox">

                    <input
                      type="checkbox"
                      id="checkbox"
                      checked={darkMode}
                      onChange={handleThemeChange}
                    />

                    <div className="mode-container">
                      <i className="gg-sun"></i>
                      <i className="gg-moon"></i>
                    </div>

                  </label>
                </div>
              </nav>
            </div>
            {/* //toggle switch for light and dark theme */}

          </nav>
        </div>
      </header>
      {/* //header */}
    </>
  );
}

export default Header;