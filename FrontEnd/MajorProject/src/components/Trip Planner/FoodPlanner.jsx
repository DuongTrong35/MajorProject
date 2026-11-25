import { useState, useRef, useEffect } from "react";
import "./FoodPlannerTest.css";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:8080/api/chat/send";

// Định dạng tiền VNĐ
const formatCurrency = (value) => {
  if (value == null || value === "" || !Number.isFinite(Number(value))) {
    return "Chưa xác định";
  }

  return `${Number(value).toLocaleString("vi-VN")} VNĐ`;
};

// Định dạng thời lượng
const formatDuration = (minutes) => {
  if (
    minutes == null ||
    minutes === "" ||
    !Number.isFinite(Number(minutes)) ||
    Number(minutes) < 0
  ) {
    return "Chưa xác định";
  }

  const value = Number(minutes);
  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;

  if (hours === 0) return `${remainingMinutes} phút`;
  if (remainingMinutes === 0) return `${hours} giờ`;

  return `${hours} giờ ${remainingMinutes} phút`;
};

export default function FoodPlanner() {
  const navigate = useNavigate();
  // navigate("/audio-map", {
  //   state: {
  //     itinerary: item.itinerary,
  //   },
  // });
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Xin chào 👋\nHôm nay bạn muốn ăn gì? Bạn cũng có thể yêu cầu mình lập một lịch trình Food Tour Sài Gòn theo ngân sách của bạn.",
      time: new Date(),
      foodPlaces: [],
      itinerary: null,
    },
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const conversationEndRef = useRef(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // Gửi tin nhắn đến Spring Boot
  const handleSendMessage = async (e) => {
    e?.preventDefault();

    const content = message.trim();

    if (!content || loading) return;

    // Hiển thị tin nhắn người dùng
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: content,
      time: new Date(),
      foodPlaces: [],
      itinerary: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Lỗi HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Nhận câu trả lời, danh sách quán ăn và lịch trình từ Backend
      const aiMessage = {
        id: Date.now() + 1,
        role: "ai",
        text: data.reply || "Mình chưa tìm được câu trả lời phù hợp.",
        time: new Date(),
        foodPlaces: Array.isArray(data.foodPlaces) ? data.foodPlaces : [],
        itinerary: data.itinerary || null,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Lỗi gọi Chat API:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Xin lỗi, hiện tại mình chưa thể kết nối đến máy chủ. Bạn hãy kiểm tra Spring Boot và thử lại nhé!",
          time: new Date(),
          foodPlaces: [],
          itinerary: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Định dạng thời gian gửi tin nhắn
  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Gửi khi nhấn Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasValidMapStops = (itinerary) =>
    Array.isArray(itinerary?.stops) &&
    itinerary.stops.some((stop) => {
      const place = stop.foodPlace;

      return (
        place &&
        place.latitude != null &&
        place.longitude != null &&
        place.latitude !== "" &&
        place.longitude !== "" &&
        Number.isFinite(Number(place.latitude)) &&
        Number.isFinite(Number(place.longitude)) &&
        Number(place.latitude) >= -90 &&
        Number(place.latitude) <= 90 &&
        Number(place.longitude) >= -180 &&
        Number(place.longitude) <= 180
      );
    });

  const formatPrice = (value) => {
    if (value == null || value === "" || !Number.isFinite(Number(value))) {
      return "?";
    }

    return Number(value).toLocaleString("vi-VN");
  };
  return (
    <div className="food-ai-page">
      {/* Tiêu đề */}
      <div className="food-ai-title">
        <p>
          Hỏi bằng lời của bạn, trợ lý sẽ chọn tour hợp khu vực, giờ giấc, ngân
          sách và khẩu vị.
        </p>
      </div>

      {/* Nội dung */}
      <div className="food-ai-layout">
        {/* Chat */}
        <section className="food-ai-chat">
          <div className="food-ai-chatbox">
            <div className="food-ai-conversation">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={`food-ai-row ${
                    item.role === "ai"
                      ? "food-ai-row-left"
                      : "food-ai-row-right"
                  }`}
                >
                  {item.role === "ai" && (
                    <div className="food-ai-avatar">AI</div>
                  )}

                  <div
                    className={`food-ai-bubble ${
                      item.role === "ai"
                        ? "food-ai-bubble-ai"
                        : "food-ai-bubble-user"
                    }`}
                  >
                    {/* Nội dung tin nhắn */}
                    <p style={{ whiteSpace: "pre-line" }}>{item.text}</p>

                    {/* LỊCH TRÌNH FOOD TOUR TỪ BACKEND */}
                    {item.itinerary &&
                      Array.isArray(item.itinerary.stops) &&
                      item.itinerary.stops.length > 0 && (
                        <div className="food-ai-itinerary">
                          <div className="food-ai-itinerary-header">
                            <h3>
                              🗺️{" "}
                              {item.itinerary.title || "Lịch trình Food Tour"}
                            </h3>

                            <p>
                              Lịch trình được sắp xếp theo ngân sách và dữ liệu
                              địa điểm trong hệ thống.
                            </p>
                          </div>

                          {/* Thông tin tổng quan */}
                          <div className="food-ai-itinerary-summary">
                            <div className="food-ai-summary-item">
                              <span>💰 Ngân sách</span>
                              <strong>
                                {formatCurrency(item.itinerary.budget)}
                              </strong>
                            </div>

                            <div className="food-ai-summary-item">
                              <span>🍽️ Số địa điểm</span>
                              <strong>
                                {item.itinerary.totalStops ??
                                  item.itinerary.stops.length}
                              </strong>
                            </div>

                            <div className="food-ai-summary-item">
                              <span>💵 Chi phí dự kiến</span>
                              <strong>
                                {formatCurrency(
                                  item.itinerary.totalEstimatedCost
                                )}
                              </strong>
                            </div>

                            <div className="food-ai-summary-item">
                              <span>💚 Ngân sách còn lại</span>
                              <strong>
                                {formatCurrency(item.itinerary.remainingBudget)}
                              </strong>
                            </div>
                          </div>

                          {/* Thời gian toàn hành trình */}
                          {(item.itinerary.startTime ||
                            item.itinerary.endTime) && (
                            <div className="food-ai-itinerary-time">
                              🕒 Thời gian:{" "}
                              {item.itinerary.startTime || "Chưa xác định"}
                              {" - "}
                              {item.itinerary.endTime || "Chưa xác định"}
                            </div>
                          )}

                          {/* Các chặng trong lịch trình */}
                          <div className="food-ai-stop-list">
                            {item.itinerary.stops.map((stop, index) => {
                              const place = stop.foodPlace;

                              return (
                                <div
                                  className="food-ai-stop-item"
                                  key={`${stop.sequence ?? index}-${
                                    place?.id ?? index
                                  }`}
                                >
                                  <div className="food-ai-stop-number">
                                    {stop.sequence ?? index + 1}
                                  </div>

                                  <div className="food-ai-stop-content">
                                    <div className="food-ai-stop-heading">
                                      <strong>
                                        {stop.activity || "Địa điểm tham quan"}
                                      </strong>

                                      {stop.visitTime && (
                                        <span className="food-ai-stop-time">
                                          🕒 {stop.visitTime}
                                        </span>
                                      )}
                                    </div>

                                    {place ? (
                                      <>
                                        <h4>🍽️ {place.name}</h4>

                                        {place.address && (
                                          <p>📍 {place.address}</p>
                                        )}

                                        {place.district && (
                                          <p>🏙️ Khu vực: {place.district}</p>
                                        )}

                                        {(place.priceMin != null ||
                                          place.priceMax != null) && (
                                          <p>
                                            💰 Giá tham khảo:{" "}
                                            {formatPrice(place.priceMin)}
                                            {" - "}
                                            {formatPrice(place.priceMax)}
                                            {" VNĐ"}
                                          </p>
                                        )}

                                        {place.googleMapsUrl && (
                                          <a
                                            href={place.googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            📍 Xem địa điểm trên Google Maps
                                          </a>
                                        )}
                                      </>
                                    ) : (
                                      <p>Chưa có thông tin địa điểm.</p>
                                    )}

                                    <div className="food-ai-stop-details">
                                      <span>
                                        ⏱️ Thời lượng:{" "}
                                        {formatDuration(stop.durationMinutes)}
                                      </span>

                                      <span>
                                        💵 Chi phí dự kiến:{" "}
                                        {formatCurrency(stop.estimatedCost)}
                                      </span>

                                      {stop.distanceFromPrevious != null &&
                                        stop.distanceFromPrevious !== "" &&
                                        Number.isFinite(
                                          Number(stop.distanceFromPrevious)
                                        ) && (
                                          <span>
                                            🚗 Khoảng cách từ điểm trước:{" "}
                                            {Number(
                                              stop.distanceFromPrevious
                                            ).toLocaleString("vi-VN")}{" "}
                                            km
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="food-ai-itinerary-footer">
                            <strong>
                              🎉 Chúc bạn có một chuyến Food Tour thật vui!
                            </strong>
                            <p>
                              Chi phí và khoảng cách là thông tin ước tính theo
                              dữ liệu hiện có trong hệ thống.
                            </p>
                          </div>
                          {hasValidMapStops(item.itinerary) && (
                            <button
                              type="button"
                              className="food-ai-map-button"
                              onClick={() => {
                                localStorage.setItem(
                                  "foodTourItinerary",
                                  JSON.stringify(item.itinerary)
                                );

                                window.open("/audio-map", "_blank");
                              }}
                            >
                              🗺️ Xem lịch trình trên bản đồ
                            </button>
                          )}
                        </div>
                      )}

                    {/* Danh sách địa điểm cũ: chỉ hiển thị khi không có lịch trình */}
                    {!(
                      item.itinerary &&
                      Array.isArray(item.itinerary.stops) &&
                      item.itinerary.stops.length > 0
                    ) &&
                      item.foodPlaces?.length > 0 && (
                        <div className="food-ai-place-list">
                          {item.foodPlaces.map((place, index) => (
                            <div
                              className="food-ai-place-item"
                              key={place.id ?? index}
                            >
                              <strong>🍽️ {place.name}</strong>

                              {place.address && <p>📍 {place.address}</p>}

                              {place.district && (
                                <p>Khu vực: {place.district}</p>
                              )}

                              {(place.priceMin != null ||
                                place.priceMax != null) && (
                                <p>
                                  💰 Giá:{" "}
                                  {place.priceMin != null
                                    ? Number(place.priceMin).toLocaleString(
                                        "vi-VN"
                                      )
                                    : "?"}
                                  {" - "}
                                  {place.priceMax != null
                                    ? Number(place.priceMax).toLocaleString(
                                        "vi-VN"
                                      )
                                    : "?"}
                                  {" VNĐ"}
                                </p>
                              )}

                              {place.googleMapsUrl && (
                                <a
                                  href={place.googleMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Xem trên Google Maps
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    <span>{formatTime(item.time)}</span>
                  </div>
                </div>
              ))}

              {/* Trạng thái đang xử lý */}
              {loading && (
                <div className="food-ai-row food-ai-row-left">
                  <div className="food-ai-avatar">AI</div>

                  <div className="food-ai-bubble food-ai-bubble-ai">
                    <p>
                      Đang tìm kiếm địa điểm và sắp xếp lịch trình phù hợp...
                    </p>
                  </div>
                </div>
              )}

              <div ref={conversationEndRef} />
            </div>
          </div>

          {/* Input */}
          <form className="food-ai-message" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ví dụ: Lập Food Tour Sài Gòn với ngân sách 500.000 VNĐ"
              disabled={loading}
            />

            <button type="submit" disabled={loading || !message.trim()}>
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
          </form>

          <p className="food-ai-note">
            Gợi ý và lịch trình được xử lý dựa trên dữ liệu có sẵn trong hệ
            thống. Hãy kiểm tra giờ mở cửa trước khi đi.
          </p>
        </section>

        {/* Sidebar */}
        <aside className="food-ai-filter">
          <h3>▼ Tạo lộ trình nhanh</h3>

          <div className="food-ai-option">
            <label>Khu vực</label>
            <select>
              <option>Bất kỳ</option>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index}>Quận {index + 1}</option>
              ))}
            </select>
          </div>

          <div className="food-ai-option">
            <label>Thời điểm</label>
            <select>
              <option>Bất kỳ</option>
              <option>Buổi sáng</option>
              <option>Buổi trưa</option>
              <option>Buổi chiều</option>
              <option>Buổi tối</option>
            </select>
          </div>

          <div className="food-ai-option">
            <label>Ngân sách</label>
            <select>
              <option>Bất kỳ</option>
              <option>Dưới 100.000 VNĐ</option>
              <option>100.000 - 200.000 VNĐ</option>
              <option>200.000 - 500.000 VNĐ</option>
              <option>Trên 500.000 VNĐ</option>
            </select>
          </div>

          <div className="food-ai-option">
            <label>Khẩu vị</label>

            <div className="food-ai-tags">
              <button type="button">Món nước</button>
              <button type="button">Ăn vặt</button>
              <button type="button">Hải sản</button>
              <button type="button">Món chay</button>
              <button type="button">Bánh ngọt</button>
              <button type="button">Cà phê</button>
            </div>
          </div>

          <p className="food-ai-note">
            Bạn có thể mô tả khu vực, món ăn và ngân sách trực tiếp trong khung
            chat.
          </p>
        </aside>
      </div>
    </div>
  );
}
