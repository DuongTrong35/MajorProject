
import React from "react";
import { useNavigate } from "react-router-dom";
import "./FoodTourHome.css";

function FoodTourHome() {
  const navigate = useNavigate();

  return (
    <div className="food-home">

      {/* HEADER */}
      {/* <header className="food-header">
        <div className="food-logo">
          <span className="logo-icon">🍜</span>
          <div>
            <h2>FOOD TOUR</h2>
            <span>SAI GON EXPERIENCE</span>
          </div>
        </div>

        <nav className="food-nav">
          <a href="#home">Trang chủ</a>
          <a href="#features">Chức năng</a>
          <a href="#about">Giới thiệu</a>
        </nav>

        <button
          className="header-btn"
          onClick={() => navigate("/audio-map")}
        >
          Khám phá ngay
          <span>→</span>
        </button>
      </header> */}

      {/* HERO */}
      {/* <section className="food-hero" id="home">
        <div className="hero-content">

          <div className="hero-label">
            <span>✦</span> KHÁM PHÁ ẨM THỰC THÔNG MINH
          </div>

          <h1>
            HÀNH TRÌNH
            <span> VỊ NGON </span>
            SÀI GÒN
          </h1>

          <p className="hero-description">
            Khám phá những hương vị đặc sắc của Sài Gòn
            cùng công nghệ định vị GPS và trợ lý Chatbot AI.
            Mỗi hành trình là một trải nghiệm ẩm thực
            đáng nhớ!
          </p>

          <div className="hero-statistics">
            <div>
              <strong>GPS</strong>
              <span>Định vị thông minh</span>
            </div>
            <div>
              <strong>AI</strong>
              <span>Lịch trình cá nhân hóa</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Đồng hành mọi lúc</span>
            </div>
          </div>

        </div>

        <div className="hero-image">
          <div className="hero-food-circle">
            <img
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900"
              alt="Ẩm thực đường phố"
            />
          </div>

          <div className="floating-card floating-top">
            <span>📍</span>
            <div>
              <strong>GPS Navigation</strong>
              <small>Khám phá mọi địa điểm</small>
            </div>
          </div>

          <div className="floating-card floating-bottom">
            <span>🤖</span>
            <div>
              <strong>AI Food Planner</strong>
              <small>Lịch trình theo sở thích</small>
            </div>
          </div>
        </div>
      </section> */}

      {/* FUNCTION SECTION */}
      <section className="food-functions" id="features">

        <div className="section-heading">
          <span className="section-subtitle">
            YOUR JOURNEY STARTS HERE
          </span>

          <h2>
            BẠN MUỐN KHÁM PHÁ
            <span> THEO CÁCH NÀO?</span>
          </h2>

          <p>
            Lựa chọn phương thức trải nghiệm phù hợp
            với hành trình ẩm thực của bạn.
          </p>
        </div>

        <div className="function-grid">

          <div className="function-card gps-card">

            <div className="function-image gps-image">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900"
                alt="Không gian ẩm thực"
              />
              <span className="function-number">01</span>
              <span className="function-tag">
                GPS EXPERIENCE
              </span>
            </div>

            <div className="function-content">

              <div className="function-icon gps-icon">
                📍
              </div>

              <h3>ĐỊNH VỊ GPS FOOD TOUR</h3>

              <p>
                Khám phá các địa điểm ăn uống xung quanh
                bạn thông qua công nghệ GPS. Tự do trải nghiệm
                hoặc tham gia những hành trình ẩm thực được
                thiết kế sẵn.
              </p>

              <div className="function-options">
                <div>
                  <span>🗺️</span>
                  <div>
                    <strong>Tour theo lịch trình</strong>
                    <small>Khám phá theo tuyến đường gợi ý</small>
                  </div>
                </div>

                <div>
                  <span>🧭</span>
                  <div>
                    <strong>Khám phá tự do</strong>
                    <small>Tự chọn địa điểm theo sở thích</small>
                  </div>
                </div>
              </div>

              <button
                className="function-btn gps-btn"
                onClick={() => navigate("/mhuser")}
              >
                BẮT ĐẦU KHÁM PHÁ
                <span>→</span>
              </button>

            </div>
          </div>

          <div className="function-card ai-card">

            <div className="function-image ai-image">
              <img
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900"
                alt="Nhà hàng và ẩm thực"
              />
              <span className="function-number">02</span>
              <span className="function-tag">
                AI SMART PLANNER
              </span>
            </div>

            <div className="function-content">

              <div className="function-icon ai-icon">
                🤖
              </div>

              <h3>CHATBOT AI FOOD PLANNER</h3>

              <p>
                Trò chuyện với trợ lý AI để xây dựng
                lịch trình khám phá ẩm thực cá nhân hóa
                dựa trên ngân sách, sở thích và thời gian
                trải nghiệm của bạn.
              </p>

              <div className="function-options">
                <div>
                  <span>💬</span>
                  <div>
                    <strong>Tư vấn thông minh</strong>
                    <small>Gợi ý món ăn và địa điểm phù hợp</small>
                  </div>
                </div>

                <div>
                  <span>📝</span>
                  <div>
                    <strong>Xây dựng lịch trình</strong>
                    <small>Tạo hành trình theo ngân sách</small>
                  </div>
                </div>
              </div>

              <button
                className="function-btn ai-btn"
                onClick={() => navigate("/foodplanner")}
              >
                TRÒ CHUYỆN VỚI AI
                <span>→</span>
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* BOTTOM BANNER */}
      {/* <section className="food-bottom" id="about">
        <div>
          <span>SAIGON FOOD CULTURE</span>
          <h2>Mỗi món ăn, một câu chuyện.</h2>
          <p>
            Cùng Food Tour Sài Gòn khám phá nét đẹp
            văn hóa ẩm thực thành phố.
          </p>
        </div>

        <div className="bottom-emoji">
          🍜 🍲 🥢
        </div>
      </section> */}

      {/* FOOTER */}
      <footer className="food-footer">
        <div className="food-logo">
          <span className="logo-icon">🍜</span>
          <div>
            <h2>FOOD TOUR</h2>
            <span>SAI GON EXPERIENCE</span>
          </div>
        </div>

        <p>
          © 2026 Food Tour Sài Gòn.
          Khám phá ẩm thực theo cách thông minh hơn.
        </p>
      </footer>

    </div>
  );
}

export default FoodTourHome;