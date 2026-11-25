import "./Login.css";
import logo from "../../assets/images/LogoVK.jpg";
import mhdn from "../../assets/images/BG_Login.png";
import Header from "./Header";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // State đăng nhập
  const [taikhoan, setTaikhoan] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // State đăng ký
  const [regTaikhoan, setRegTaikhoan] = useState("");
  const [regMatkhau, setRegMatkhau] = useState("");
  const [regRole, setRegRole] = useState("USER");

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login/xulydn", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ taikhoan, matkhau }),
      });

      const text = await response.text();

      if (response.status === 401) {
        return alert("Sai tài khoản hoặc mật khẩu");
      }

      if (!response.ok) {
        return alert("Đăng nhập thất bại");
      }

      const data = JSON.parse(text);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          username: data.username,
          role: data.role,
          goiDichVu: data.goiDichVu,
        })
      );

      if (data.role === "STORE") {
        navigate("/store/home");
      } else if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/homechoose");
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();

    const requestData = {
      taikhoan: regTaikhoan,
      matkhau: regMatkhau,
      role: regRole,
    };

    try {
      const response = await fetch("http://localhost:8080/login/dangky", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(requestData),
      });

      if (response.ok) {
        alert(
          regRole === "STORE"
            ? "Đăng ký thành công! Vui lòng đăng nhập và vào quản lý để cập nhật thông tin quán."
            : "Đăng ký thành công! Bạn có thể đăng nhập ngay."
        );

        setIsRegister(false);
        setRegTaikhoan("");
        setRegMatkhau("");
      } else {
        alert("Đăng ký thất bại, tài khoản đã tồn tại hoặc lỗi dữ liệu!");
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <div className="ft-login-page">
      {/* <Header /> */}

      <main className="ft-login-main">
        <div
          className="ft-login-background"
          style={{ backgroundImage: `url(${mhdn})` }}
        />

        <div className="ft-login-overlay" />

        <div className="ft-login-container">
          {/* KHU VỰC GIỚI THIỆU */}
          <section className="ft-login-intro">
            <div className="ft-intro-content">
              <div className="ft-intro-badge">
                <span className="ft-badge-dot" />
                KHÁM PHÁ ẨM THỰC SÀI GÒN
              </div>

              <h1>
                Sài Gòn
                <br />
                <span>Ăn gì hôm nay?</span>
              </h1>

              <p className="ft-intro-description">
                Cùng khám phá những con phố ẩm thực nổi tiếng, thưởng thức hương
                vị đặc sản và trải nghiệm văn hóa ẩm thực độc đáo của Sài Gòn.
              </p>

              <div className="ft-intro-features">
                <div className="ft-feature-item">
                  <span className="ft-feature-icon">🍜</span>
                  <div>
                    <strong>Món ngon địa phương</strong>
                    <small>Khám phá hương vị Sài Gòn</small>
                  </div>
                </div>

                <div className="ft-feature-item">
                  <span className="ft-feature-icon">📍</span>
                  <div>
                    <strong>Địa điểm hấp dẫn</strong>
                    <small>Tìm kiếm quán ăn quanh bạn</small>
                  </div>
                </div>

                <div className="ft-feature-item">
                  <span className="ft-feature-icon">🎧</span>
                  <div>
                    <strong>Food Tour thông minh</strong>
                    <small>Trải nghiệm thuyết minh tự động</small>
                  </div>
                </div>
              </div>

              <div className="ft-intro-footer">
                <span>🍽</span>
                Khám phá Sài Gòn qua từng hương vị
              </div>
            </div>
          </section>

          {/* KHU VỰC FORM */}
          <section className="ft-login-form-section">
            <div className="ft-login-card">
              <div className="ft-card-logo">
                <img src={logo} alt="Food Tour Logo" />
              </div>

              <div className="ft-card-heading">
                <span className="ft-card-eyebrow">
                  {isRegister ? "JOIN OUR JOURNEY" : "WELCOME TO FOOD TOUR"}
                </span>

                <h2>{isRegister ? "Tạo tài khoản" : "Chào mừng trở lại!"}</h2>

                <p>
                  {isRegister
                    ? "Đăng ký để bắt đầu hành trình khám phá."
                    : "Đăng nhập để khám phá thế giới ẩm thực Sài Gòn."}
                </p>
              </div>

              {!isRegister ? (
                /* FORM ĐĂNG NHẬP */
                <form className="ft-login-form" onSubmit={handleLogin}>
                  <div className="ft-form-group">
                    <label>Tên tài khoản</label>

                    <div className="ft-input-wrapper">
                      <span className="ft-input-icon">👤</span>

                      <input
                        type="text"
                        placeholder="Nhập tên tài khoản"
                        value={taikhoan}
                        onChange={(e) => setTaikhoan(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="ft-form-group">
                    <label>Mật khẩu</label>

                    <div className="ft-input-wrapper">
                      <span className="ft-input-icon">🔒</span>

                      <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={matkhau}
                        onChange={(e) => setMatkhau(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="ft-btn-primary">
                    ĐĂNG NHẬP
                    <span>→</span>
                  </button>

                  <div className="ft-form-divider">
                    <span>CHƯA CÓ TÀI KHOẢN?</span>
                  </div>

                  <button
                    type="button"
                    className="ft-btn-outline"
                    onClick={() => setIsRegister(true)}
                  >
                    TẠO TÀI KHOẢN MỚI
                  </button>

                  <button
                    type="button"
                    className="ft-btn-home"
                    onClick={() => setIsHome(true)}
                  >
                    <span className="ft-home-icon">⌂</span>

                    <span className="ft-home-text">Về trang chủ</span>

                    <span className="ft-home-arrow">←</span>
                  </button>
                </form>
              ) : (
                /* FORM ĐĂNG KÝ */
                <form className="ft-login-form" onSubmit={handleRegister}>
                  <div className="ft-form-group">
                    <label>Bạn muốn tham gia với vai trò?</label>

                    <div className="ft-input-wrapper">
                      <span className="ft-input-icon">🎭</span>

                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                      >
                        <option value="USER">Người dùng (Khách hàng)</option>

                        <option value="STORE">Quán ăn (Cửa hàng)</option>
                      </select>
                    </div>
                  </div>

                  <div className="ft-form-group">
                    <label>Tên tài khoản</label>

                    <div className="ft-input-wrapper">
                      <span className="ft-input-icon">👤</span>

                      <input
                        type="text"
                        placeholder="Tạo tên tài khoản"
                        value={regTaikhoan}
                        onChange={(e) => setRegTaikhoan(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="ft-form-group">
                    <label>Mật khẩu</label>

                    <div className="ft-input-wrapper">
                      <span className="ft-input-icon">🔒</span>

                      <input
                        type="password"
                        placeholder="Tạo mật khẩu"
                        value={regMatkhau}
                        onChange={(e) => setRegMatkhau(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="ft-btn-primary">
                    TẠO TÀI KHOẢN
                    <span>→</span>
                  </button>

                  {/* <div className="ft-form-divider">
                    <span>ĐÃ CÓ TÀI KHOẢN?</span>
                  </div> */}

                  <button
                    type="button"
                    className="ft-btn-outline"
                    onClick={() => setIsRegister(false)}
                  >
                    QUAY LẠI ĐĂNG NHẬP
                  </button>
                </form>
              )}

              {/* <div className="ft-card-bottom">
                <span>🍽</span>
                Made with love in Saigon
              </div> */}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;
