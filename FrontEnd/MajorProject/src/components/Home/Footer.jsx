
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="ld-footer">
      <div className="ld-footer-container">

        {/* ================= THƯƠNG HIỆU ================= */}
        <div className="ld-footer-brand">
          <div className="ld-footer-logo">
            <div className="ld-footer-logo-icon">KT</div>
            <span>Konoha Trip</span>
          </div>

          <p className="ld-footer-description">
            Đồng hành cùng bạn trên mọi hành trình. Tìm kiếm chuyến đi
            chóng, an toàn và tiện lợi.
          </p>

          {/* Mạng xã hội */}
          <div className="ld-footer-social">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#" aria-label="Youtube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* ================= LIÊN KẾT NHANH ================= */}
        {/* <div className="ld-footer-column">
          <h3>Liên kết nhanh</h3>

          <Link to="/">Trang chủ</Link>
          <Link to="/bus-route">Lịch trình</Link>
          <Link to="/trips">Tra cứu vé</Link>
          <Link to="/news">Tin tức</Link>
          <Link to="/invoices">Hóa đơn</Link>
        </div> */}

        {/* ================= HỖ TRỢ ================= */}
        <div className="ld-footer-column">
          <h3>Hỗ trợ</h3>

          <Link to="/guide">Hướng dẫn đặt hành trình</Link>
          <Link to="/faq">Câu hỏi thường gặp</Link>
          <Link to="/contact">Liên hệ</Link>
          <Link to="/terms">Điều khoản sử dụng</Link>
          <Link to="/privacy">Chính sách bảo mật</Link>
        </div>

        {/* ================= THÔNG TIN LIÊN HỆ ================= */}
        <div className="ld-footer-column ld-footer-contact">
          <h3>Thông tin liên hệ</h3>

          <p>
            <span className="ld-contact-icon">☎</span>
            <span>1900 1234</span>
          </p>

          <p>
            <span className="ld-contact-icon">✉</span>
            <span>support@konohatrip.vn</span>
          </p>

          <p>
            <span className="ld-contact-icon">●</span>
            <span>TP. Hồ Chí Minh, Việt Nam</span>
          </p>

          <p>
            <span className="ld-contact-icon">◷</span>
            <span>Hỗ trợ khách hàng 24/7</span>
          </p>
        </div>

      </div>

      {/* ================= FOOTER BOTTOM ================= */}
      <div className="ld-footer-bottom">
        <p>
          © 2026 <strong>Konoha Bus</strong>. All rights reserved.
        </p>

        <div className="ld-footer-bottom-links">
          <Link to="/terms">Điều khoản</Link>

          <span>•</span>

          <Link to="/privacy">Bảo mật</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
