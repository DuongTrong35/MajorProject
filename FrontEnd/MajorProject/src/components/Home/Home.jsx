
import React, { useEffect } from "react";
import "./Home.css";
import Header from "./Header";
import Footer from "./Footer";
import banner from "../../assets/images/m10andcr7.png";
import img1 from "../../assets/images/borutonauan.png";
import icon1 from "../../assets/images/icon-1.png";
import icon2 from "../../assets/images/icon-2.png";
import icon3 from "../../assets/images/icon-3.png";
import icon4 from "../../assets/images/icon-4.png";
import testi1 from "../../assets/images/testi1.jpg";
import testi2 from "../../assets/images/testi2.jpg";
import testi3 from "../../assets/images/testi3.jpg";
import c1 from "../../assets/images/a1.png";
import c2 from "../../assets/images/a2.png";
import c3 from "../../assets/images/a3.png";
export default function Home() {
  useEffect(() => {
    // =========================================================
    // MOVE TO TOP BUTTON
    // =========================================================

    const moveTopButton = document.getElementById("movetop");

    const scrollFunction = () => {
      if (!moveTopButton) return;

      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        moveTopButton.style.display = "block";
      } else {
        moveTopButton.style.display = "none";
      }
    };

    window.addEventListener("scroll", scrollFunction);

    // =========================================================
    // MENU - NAV FIXED
    // =========================================================

    const handleHeaderScroll = () => {
      const header = document.getElementById("site-header");

      if (!header) return;

      const scroll = window.scrollY;

      if (scroll >= 80) {
        header.classList.add("nav-fixed");
      } else {
        header.classList.remove("nav-fixed");
      }
    };

    window.addEventListener("scroll", handleHeaderScroll);

    // =========================================================
    // NAVBAR TOGGLER
    // =========================================================

    const navbarToggler = document.querySelector(".navbar-toggler");
    const header = document.querySelector("header");

    const handleNavbarToggle = () => {
      if (header) {
        header.classList.toggle("active");
      }

      document.body.classList.toggle("noscroll");
    };

    if (navbarToggler) {
      navbarToggler.addEventListener("click", handleNavbarToggle);
    }

    // =========================================================
    // INITIAL HEADER STATE
    // =========================================================

    const handleResize = () => {
      if (window.innerWidth > 991) {
        if (header) {
          header.classList.remove("active");
        }

        document.body.classList.remove("noscroll");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {
      window.removeEventListener("scroll", scrollFunction);
      window.removeEventListener("scroll", handleHeaderScroll);
      window.removeEventListener("resize", handleResize);

      if (navbarToggler) {
        navbarToggler.removeEventListener("click", handleNavbarToggle);
      }
    };
  }, []);

  // =========================================================
  // MOVE TO TOP
  // =========================================================

  const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <>
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div>
        <Header />

        {/* 
          Nếu bạn đã có Header.jsx thì thay phần này bằng:

          <Header />

          Hiện tại để giữ nguyên cấu trúc Home.html,
          mình để div placeholder.
        */}
      </div>

      {/* =========================================================
          BANNER SECTION
      ========================================================= */}

      <section id="home" className="w3l-banner py-5">
        <div className="banner-content">
          <div className="container py-4">
            <div className="row align-items-center pt-sm-5 pt-4">
              <div className="col-md-6">
                <h3 className="mb-lg-4 mb-3">
                  Ăn Ngon <br></br>
                  Khám Phá Sài Gòn <br></br>
                  Theo Cách Của Bạn
                  <span className="d-block">AI - GPS</span>
                </h3>

                <p className="banner-sub">
                  Khám phá ẩm thực đường phố, tìm quán ăn gần bạn và trải nghiệm
                  những món ngon đặc sắc của Sài Gòn với công nghệ GPS và AI.
                </p>

                <div
                  className="d-flex align-items-center buttons-banner"
                  style={{ marginLeft: "210px" }}
                >
                  <a href="/contact" className="btn btn-style mt-lg-5 mt-4">
                    Bắt đầu khám phá
                  </a>
                </div>
              </div>

              <div className="col-md-6 right-banner-2 text-end position-relative mt-md-0 mt-5">
                <div className="sub-banner-image mx-auto">
                  <img
                    src={banner}
                    className="img-fluid position-relative"
                    alt=" "
                  />
                </div>

                {/* <div className="banner-style-1 position-absolute">
                  <div className="banner-style-2 position-relative">
                    <h4>Khám Phá Món Ngon Sài Gòn</h4>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOME 4 GRIDS BLOCK
      ========================================================= */}

      <section className="services-w3l-block py-5" id="features">
        <div className="container py-md-5 py-4">
          <div
            className="title-main text-center mx-auto mb-md-5 mb-4"
            style={{ maxWidth: "500px" }}
          >
            <p className="text-uppercase">Tính năng nổi bật</p>

            <h3 className="title-style">
              Trải Nghiệm Food Tour Theo Cách Của Bạn
            </h3>
          </div>

          <div className="row">
            <div className="col-md-6 col-lg-3 d-flex align-items-stretch">
              <div className="icon-box icon-box-clr-1">
                <div className="icon">
                  <i className="fas fa-location-dot"></i>
                </div>

                <h4 className="title">
                  <a href="#">Định Vị Dẫn Đường</a>
                </h4>

                <p>
                  Xác định vị trí hiện tại và hỗ trợ du khách tìm kiếm, di
                  chuyển đến những địa điểm ẩm thực gần nhất bằng GPS.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 d-flex align-items-stretch mt-md-0 mt-4">
              <div className="icon-box icon-box-clr-2">
                <div className="icon">
                  <i className="fas fa-robot"></i>
                </div>

                <h4 className="title">
                  <a href="#">Trợ Lý Ẩm Thực AI</a>
                </h4>

                <p>
                  AI hỗ trợ tư vấn món ăn, gợi ý quán ăn và đề xuất trải nghiệm
                  phù hợp với nhu cầu, sở thích của từng người dùng.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 d-flex align-items-stretch mt-lg-0 mt-4">
              <div className="icon-box icon-box-clr-3">
                <div className="icon">
                  <i className="fas fa-utensils"></i>
                </div>

                <h4 className="title">
                  <a href="#">Khám Phá Ẩm Thực Sài Gòn</a>
                </h4>

                <p>
                  Khám phá những món ăn đặc trưng, quán ăn địa phương và các
                  địa điểm ẩm thực hấp dẫn trong lòng thành phố Sài Gòn.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 d-flex align-items-stretch mt-lg-0 mt-4">
              <div className="icon-box icon-box-clr-4">
                <div className="icon">
                  <i className="fas fa-route"></i>
                </div>

                <h4 className="title">
                  <a href="#">Lộ Trình Food Tour Thông Minh</a>
                </h4>

                <p>
                  Hỗ trợ xây dựng hành trình khám phá ẩm thực dựa trên vị trí,
                  sở thích và các địa điểm mà người dùng muốn trải nghiệm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOME IMAGE WITH CONTENT BLOCK
      ========================================================= */}

      <section
        className="w3l-servicesblock pt-lg-5 pt-4 pb-5 mb-lg-5"
        id="about"
      >
        <div className="container pb-md-5 pb-4">
          <div className="row pb-xl-5 align-items-center">
            <div className="col-lg-6 position-relative home-block-3-left pb-lg-0 pb-5">
              <div className="position-relative">
                <img src={img1} alt="" className="img-fluid radius-image" />
              </div>

              <div className="imginfo__box">
                <h6 className="imginfo__title">Sẵn Sàng Khám Phá?</h6>

                <p>
                  Bắt đầu hành trình ẩm thực của bạn
                  <br />
                  và tìm kiếm những món ngon quanh mình.
                </p>

                <a href="/contact">
                  <i className="fas fa-utensils"></i> Khám phá ngay
                </a>
              </div>
            </div>

            <div className="col-xl-5 col-lg-6 offset-xl-1 mt-lg-0 mt-5 pt-lg-0 pt-5">
              <h3 className="title-style">
                Khám Phá Tinh Hoa Ẩm Thực Sài Gòn
              </h3>

              <p className="mt-4">
                Food Tour Sài Gòn là nền tảng hỗ trợ khám phá ẩm thực bằng công
                nghệ GPS và trí tuệ nhân tạo AI. Người dùng có thể tìm kiếm
                quán ăn, khám phá món ngon địa phương và nhận gợi ý hành trình
                phù hợp với vị trí cũng như sở thích của mình.
              </p>

              <ul className="mt-4 list-style-lis pt-lg-1">
                <li>
                  <i className="fas fa-check-circle"></i>
                  Tìm kiếm địa điểm ăn uống gần bạn bằng GPS
                </li>

                <li>
                  <i className="fas fa-check-circle"></i>
                  Nhận gợi ý món ngon từ trợ lý AI
                </li>

                <li>
                  <i className="fas fa-check-circle"></i>
                  Khám phá hành trình ẩm thực phù hợp với sở thích
                </li>
              </ul>

              <a href="/about" className="btn btn-style mt-5">
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY CHOOSE BLOCK
      ========================================================= */}

      <section className="w3l-service-1 py-6">
        <div className="container py-md-5 py-4">
          <div
            className="title-main text-center mx-auto mb-md-5 mb-4"
            style={{ maxWidth: "500px" }}
          >
            <p className="text-uppercase">Vì Sao Chọn Chúng Tôi?</p>

            <h3 className="title-style">
              Khám Phá Ẩm Thực Dễ Dàng Với GPS Và AI
            </h3>
          </div>

          <div className="row content23-col-2 text-center">
            <div className="col-md-6">
              <div className="content23-grid content23-grid1">
                <h4>
                  <a href="/about">Gợi Ý Ẩm Thực Thông Minh</a>
                </h4>
              </div>
            </div>

            <div className="col-md-6 mt-md-0 mt-4">
              <div className="content23-grid content23-grid2">
                <h4>
                  <a href="/about">Tìm Quán Ăn Theo Vị Trí</a>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS BLOCK
      ========================================================= */}

      <section className="w3-stats pt-4 pb-5" id="stats">
        <div className="container pb-md-5 pb-4">
          <div
            className="title-main text-center mx-auto mb-md-5 mb-4"
            style={{ maxWidth: "500px" }}
          >
            <p className="text-uppercase">Khám Phá Ẩm Thực</p>

            <h3 className="title-style">
              Những Trải Nghiệm Đang Chờ Bạn
            </h3>
          </div>

          <div className="row text-center pt-4">
            <div className="col-md-3 col-6">
              <div className="counter">
                <img src={icon1} alt="" className="img-fluid" />

                <div
                  className="timer count-title count-number mt-sm-1"
                  data-to="2458"
                  data-speed="1500"
                >
                  2458
                </div>

                <p className="count-text">Món Ngon Được Khám Phá</p>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="counter">
                <img src={icon2} alt="" className="img-fluid" />

                <div
                  className="timer count-title count-number mt-3"
                  data-to="12"
                  data-speed="1500"
                >
                  12
                </div>

                <p className="count-text">Khu Vực Ẩm Thực</p>
              </div>
            </div>

            <div className="col-md-3 col-6 mt-md-0 mt-5">
              <div className="counter">
                <img src={icon3} alt="" className="img-fluid" />

                <div
                  className="timer count-title count-number mt-3"
                  data-to="128"
                  data-speed="1500"
                >
                  128
                </div>

                <p className="count-text">Địa Điểm Ăn Uống</p>
              </div>
            </div>

            <div className="col-md-3 col-6 mt-md-0 mt-5">
              <div className="counter">
                <img src={icon4} alt="" className="img-fluid" />

                <div
                  className="timer count-title count-number mt-3"
                  data-to="543"
                  data-speed="1500"
                >
                  543
                </div>

                <p className="count-text">Hành Trình Khám Phá</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS BLOCK
      ========================================================= */}

      <section className="w3l-index4 py-5" id="testimonials">
        <div className="container py-md-5 py-4">
          <div className="content-slider text-center">
            <div className="clients-slider">
              <div className="mask">
                <ul>
                  <li className="anim1">
                    <img
                      src={testi1}
                      className="img-fluid rounded-circle"
                      alt="client image"
                    />

                    <blockquote className="quote">
                      <q>
                        Tôi có thể dễ dàng khám phá những món ăn đặc trưng của
                        Sài Gòn và tìm kiếm các địa điểm ăn uống phù hợp với
                        hành trình của mình.
                      </q>
                    </blockquote>

                    <div className="source">- Minh Anh</div>
                  </li>

                  <li className="anim2">
                    <img
                      src={testi2}
                      className="img-fluid rounded-circle"
                      alt="client image"
                    />

                    <blockquote className="quote">
                      <q>
                        Tính năng định vị GPS giúp tôi tìm những quán ăn gần
                        vị trí hiện tại, tiết kiệm thời gian tìm kiếm khi khám
                        phá thành phố.
                      </q>
                    </blockquote>

                    <div className="source">- Hoàng Nam</div>
                  </li>

                  <li className="anim3">
                    <img
                      src={testi3}
                      className="img-fluid rounded-circle"
                      alt="client image"
                    />

                    <blockquote className="quote">
                      <q>
                        Tôi thích tính năng gợi ý ẩm thực bằng AI vì có thể
                        tham khảo những món ăn và địa điểm mới phù hợp với sở
                        thích của mình.
                      </q>
                    </blockquote>

                    <div className="source">- Thu Hà</div>
                  </li>

                  <li className="anim4">
                    <img
                      src={testi1}
                      className="img-fluid rounded-circle"
                      alt="client image"
                    />

                    <blockquote className="quote">
                      <q>
                        Food Tour Sài Gòn giúp việc lên kế hoạch khám phá ẩm
                        thực trở nên thuận tiện hơn nhờ các gợi ý địa điểm và
                        hành trình.
                      </q>
                    </blockquote>

                    <div className="source">- Quốc Bảo</div>
                  </li>

                  <li className="anim5">
                    <img
                      src={testi2}
                      className="img-fluid rounded-circle"
                      alt="client image"
                    />

                    <blockquote className="quote">
                      <q>
                        Đây là một cách thú vị để tìm hiểu văn hóa ẩm thực địa
                        phương, từ những món ăn đường phố quen thuộc đến các
                        quán ăn đặc sắc tại Sài Gòn.
                      </q>
                    </blockquote>

                    <div className="source">- Ngọc Trâm</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COURSES SECTION
      ========================================================= */}

      <div className="w3l-grids-block-5 home-course-bg py-5" id="courses">
        <div className="container py-md-5 py-4">
          <div
            className="title-main text-center mx-auto mb-md-5 mb-4"
            style={{ maxWidth: "500px" }}
          >
            <p className="text-uppercase">Khám Phá Ẩm Thực</p>

            <h3 className="title-style">
              Những Trải Nghiệm Ẩm Thực Không Thể Bỏ Lỡ
            </h3>
          </div>

          <div className="row justify-content-center">
            {/* COURSE 1 */}

            <div className="col-lg-4 col-md-6">
              <div className="coursecard-single">
                <div className="grids5-info position-relative">
                  <img src={c1} alt="" className="img-fluid" />

                  <div className="meta-list">
                    <a href="#">Ẩm Thực Đường Phố</a>
                  </div>
                </div>

                <div className="content-main-top">
                  <div className="content-top mb-4 mt-3">
                    <ul className="list-unstyled d-flex align-items-center justify-content-between">
                      <li>
                        <i className="fas fa-utensils"></i> Món ăn đặc trưng
                      </li>

                      <li>
                        <i className="fas fa-star"></i> 4.9
                      </li>
                    </ul>
                  </div>

                  <h4>
                    <a href="#">Hương Vị Ẩm Thực Đường Phố</a>
                  </h4>

                  <p>
                    Khám phá các món ăn đường phố hấp dẫn, những hương vị dân
                    dã và nét văn hóa ẩm thực đặc trưng của người Sài Gòn.
                  </p>
                </div>
              </div>
            </div>

            {/* COURSE 2 */}

            <div className="col-lg-4 col-md-6 mt-md-0 mt-4">
              <div className="coursecard-single">
                <div className="grids5-info position-relative">
                  <img src={c2} alt="" className="img-fluid" />

                  <div className="meta-list">
                    <a href="#" className="sec-2">
                      Đặc Sản Sài Gòn
                    </a>
                  </div>
                </div>

                <div className="content-main-top">
                  <div className="content-top mb-4 mt-3">
                    <ul className="list-unstyled d-flex align-items-center justify-content-between">
                      <li>
                        <i className="fas fa-utensils"></i> Món ngon địa phương
                      </li>

                      <li>
                        <i className="fas fa-star"></i> 4.6
                      </li>
                    </ul>
                  </div>

                  <h4>
                    <a href="#">Khám Phá Đặc Sản Địa Phương</a>
                  </h4>

                  <p>
                    Tìm hiểu và thưởng thức những món ăn nổi bật, các món đặc
                    sản và hương vị giao thoa của nhiều vùng miền tại Sài Gòn.
                  </p>
                </div>
              </div>
            </div>

            {/* COURSE 3 */}

            <div className="col-lg-4 col-md-6 mt-lg-0 mt-4">
              <div className="coursecard-single">
                <div className="grids5-info position-relative">
                  <img src={c3} alt="" className="img-fluid" />

                  <div className="meta-list">
                    <a href="#" className="sec-3">
                      Food Tour Thông Minh
                    </a>
                  </div>
                </div>

                <div className="content-main-top">
                  <div className="content-top mb-4 mt-3">
                    <ul className="list-unstyled d-flex align-items-center justify-content-between">
                      <li>
                        <i className="fas fa-route"></i> Hành trình khám phá
                      </li>

                      <li>
                        <i className="fas fa-star"></i> 5.0
                      </li>
                    </ul>
                  </div>

                  <h4>
                    <a href="#">Lên Lộ Trình Ẩm Thực Với AI</a>
                  </h4>

                  <p>
                    Tham khảo các gợi ý địa điểm ăn uống và xây dựng hành trình
                    khám phá phù hợp với vị trí, thời gian và sở thích cá nhân.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="text-center mt-sm-5 mt-4 pt-sm-0 pt-1">
            <a
              href="/courses"
              className="btn btn-style btn-style-secondary mt-sm-3"
            >
              Khám Phá Thêm
            </a>
          </div> */}
        </div>
      </div>

      {/* =========================================================
          CALL BLOCK
      ========================================================= */}

      {/* <section className="w3l-call-to-action-6">
        <div className="container py-md-5 py-sm-4 py-5">
          <div className="d-lg-flex align-items-center justify-content-between">
            <div className="left-content-call">
              <h3 className="title-big">
                Bắt Đầu Hành Trình Food Tour Của Bạn
              </h3>

              <p className="text-white mt-1">
                Tìm quán ăn gần bạn, khám phá món ngon cùng GPS và AI!
              </p>
            </div>

            <div className="right-content-call mt-lg-0 mt-4">
              <ul className="buttons">
                <li className="phone-sec me-lg-4">
                  <i className="fas fa-phone-volume"></i>

                  <a className="call-style-w3" href="/contact">
                    Liên hệ với chúng tôi
                  </a>
                </li>

                <li>
                  <a
                    href="/contact"
                    className="btn btn-style btn-style-2 mt-lg-0 mt-3"
                  >
                    Khám Phá Ngay
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <div>
        <Footer />

        {/*
          Nếu bạn đã có Footer.jsx thì thay phần này bằng:

          <Footer />
        */}
      </div>

      {/* =========================================================
          MOVE TOP BUTTON
      ========================================================= */}

      <button
        onClick={topFunction}
        id="movetop"
        title="Lên đầu trang"
        style={{ display: "none" }}
      >
        <span className="fas fa-level-up-alt" aria-hidden="true"></span>
      </button>
    </>
  );
}
