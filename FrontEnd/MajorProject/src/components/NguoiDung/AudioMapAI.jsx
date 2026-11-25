import "./AudioMapFreeUI.css";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Circle } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useMapEvents } from "react-leaflet";
import { useLocation } from "react-router-dom";

function MapClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]); // 👈 cập nhật vị trí marker xanh
    },
  });
  return null;
}
// Leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [map, position]);

  return null;
}

// TỪ ĐIỂN NGÔN NGỮ ĐỂ NGOÀI FUNCTION
const langCodeMap = {
  "Tiếng Việt": "vi",
  Vietnamese: "vi",
  English: "en",
  French: "fr",
  Spanish: "es",
  Portuguese: "pt",
  German: "de",
  Japanese: "ja",
  "Chinese (Simplified)": "zh-CN",
  Korean: "ko",
  Italian: "it",
  Russian: "ru",
  Thai: "th",
};
const EMPTY_STOPS = [];

function AudioMapAI() {
  const navigate = useNavigate();
  // const location = useLocation();
  const location = useLocation();

  const itineraryFromChat = useMemo(() => {
    if (location.state?.itinerary) {
      return location.state.itinerary;
    }

    try {
      return JSON.parse(localStorage.getItem("foodTourItinerary") || "null");
    } catch {
      return null;
    }
  }, [location.state]);
  const shopIdFromQR = location.state?.shopId;

  // const itineraryFromChat = location.state?.itinerary;

  const itineraryStops = itineraryFromChat?.stops ?? EMPTY_STOPS;

  const isFromItinerary = itineraryStops.length > 0;

  const [foodTourRoute, setFoodTourRoute] = useState([]);

  // Vẽ đường đi qua đúng các quán trong Food Tour
  useEffect(() => {
    setFoodTourRoute([]);

    if (itineraryStops.length < 2) return;

    const validStops = itineraryStops.filter((stop) => {
      const place = stop.foodPlace;

      return (
        place &&
        place.latitude != null &&
        place.longitude != null &&
        place.latitude !== "" &&
        place.longitude !== "" &&
        Number.isFinite(Number(place.latitude)) &&
        Number.isFinite(Number(place.longitude))
      );
    });

    if (validStops.length < 2) return;

    const coordinates = validStops
      .map((stop) => {
        const place = stop.foodPlace;

        return `${Number(place.longitude)},${Number(place.latitude)}`;
      })
      .join(";");

    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể lấy đường đi Food Tour");
        }

        return res.json();
      })
      .then((data) => {
        if (data.code !== "Ok" || !data.routes?.length) {
          throw new Error("OSRM không tìm thấy tuyến đường phù hợp");
        }

        const coords = data.routes[0].geometry.coordinates;

        setFoodTourRoute(coords.map(([lng, lat]) => [lat, lng]));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Lỗi đường đi Food Tour:", err);
        }
      });

    return () => controller.abort();
  }, [itineraryStops]);
  // TẤT CẢ CÁC STATE NẰM Ở ĐÂY
  // const [position, setPosition] = useState([10.761992635455506, 106.7022316837637]);
  const [position, setPosition] = useState([10.76, 106.7]);

  const [showLang, setShowLang] = useState(false);
  const [shops, setShops] = useState([]);
  const [route, setRoute] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [audioObj, setAudioObj] = useState(null);
  const [floatingLang, setFloatingLang] = useState({
    code: "VN",
    label: "Tiếng Việt",
  });
  const [isFromQR, setIsFromQR] = useState(false);
  // STATE CHO ĐA NGÔN NGỮ
  const [panelLang, setPanelLang] = useState("Tiếng Việt");
  const [displayTitle, setDisplayTitle] = useState("");
  const [displayDesc, setDisplayDesc] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  // 2. Khi nhận lịch trình, đưa bản đồ đến quán đầu tiên
  useEffect(() => {
    const firstValidStop = itineraryStops.find((stop) => {
      const place = stop.foodPlace;

      return (
        place &&
        place.latitude != null &&
        place.longitude != null &&
        place.latitude !== "" &&
        place.longitude !== "" &&
        Number.isFinite(Number(place.latitude)) &&
        Number.isFinite(Number(place.longitude))
      );
    });

    if (!firstValidStop) return;

    const place = firstValidStop.foodPlace;

    setPosition([Number(place.latitude), Number(place.longitude)]);

    setSelectedShop(null);
    setIsPanelOpen(false);
  }, [itineraryFromChat]);

  const moveStep = 0.0001;
  const moveUp = () => setPosition([position[0] + moveStep, position[1]]);
  const moveDown = () => setPosition([position[0] - moveStep, position[1]]);
  const moveLeft = () => setPosition([position[0], position[1] - moveStep]);
  const moveRight = () => setPosition([position[0], position[1] + moveStep]);

  const allShops = shops;

  const startSimulation = () => {
    if (!route.length) return;
    setIsMoving(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= route.length) {
        clearInterval(interval);
        setIsMoving(false);
        return;
      }
      setPosition(route[i]);
      i++;
    }, 500);
  };
  // lay vi trí dau tien khi vao map
  //   useEffect(() => {
  //   if (!navigator.geolocation) {
  //     alert("Trình duyệt không hỗ trợ GPS");
  //     return;
  //   }

  //   const watchId = navigator.geolocation.watchPosition(
  //     (pos) => {
  //       console.log("📍 GPS:", pos.coords);

  //       setPosition([
  //         pos.coords.latitude,
  //         pos.coords.longitude
  //       ]);
  //     },
  //     (err) => {
  //       console.error(err);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       maximumAge: 0,
  //       timeout: 10000
  //     }
  //   );

  //   return () => navigator.geolocation.clearWatch(watchId);
  // }, []);
  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () =>
      window.speechSynthesis.getVoices();
  }, []);

  // API TẢI QUÁN
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/cuahang")
      .then((res) => setShops(res.data))
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    if (isFromItinerary || !shopIdFromQR || shops.length === 0) return;
    console.log("QR ID:", shopIdFromQR);
    console.log("Shops:", shops);

    const foundShop = shops.find((s) => String(s.id) === String(shopIdFromQR));
    if (foundShop) {
      setIsFromQR(true);

      setPosition([Number(foundShop.lat), Number(foundShop.lng)]);

      setSelectedShop(foundShop);
      setIsPanelOpen(true);
    } else {
      console.log("❌ Không tìm thấy shop");
    }
  }, [shopIdFromQR, shops, isFromItinerary]); // LẤY ĐƯỜNG ĐI TỪ OSRM
  // useEffect(() => {
  //   if (!selectedShop || isFromQR) return;
  //   const url = `https://router.project-project-osrm.org/route/v1/driving/${position[1]},${position[0]};${selectedShop.lng},${selectedShop.lat}?overview=full&geometries=geojson`;
  //   fetch(url)
  //     .then((res) => {
  //       if (!res.ok) throw new Error("OSRM quá tải!");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       if (!data.routes?.length) return;
  //       const coords = data.routes[0].geometry.coordinates;
  //       setRoute(coords.map((c) => [c[1], c[0]]));
  //     })
  //     .catch((err) => console.error(err));
  // }, [selectedShop]);

  useEffect(() => {
    setRoute([]);

    if (!selectedShop || isFromQR || isFromItinerary) return;

    const lat = Number(selectedShop.lat);
    const lng = Number(selectedShop.lng);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      !Number.isFinite(position[0]) ||
      !Number.isFinite(position[1])
    ) {
      return;
    }

    const url = `https://router.project-osrm.org/route/v1/driving/${position[1]},${position[0]};${lng},${lat}?overview=full&geometries=geojson`;

    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("OSRM quá tải!");
        return res.json();
      })
      .then((data) => {
        if (!data.routes?.length) return;

        const coords = data.routes[0].geometry.coordinates;

        setRoute(coords.map(([lng, lat]) => [lat, lng]));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      });

    return () => controller.abort();
  }, [selectedShop, position, isFromQR, isFromItinerary]);
  // TÌM QUÁN GẦN NHẤT
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  const visibleShops = useMemo(() => {
    return shops.filter((s) => {
      const lat = Number(s.lat);
      const lng = Number(s.lng);
      const radius = Number(s.bankinh);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        !Number.isFinite(radius)
      ) {
        return false;
      }

      return getDistance(position[0], position[1], lat, lng) <= radius / 1000;
    });
  }, [shops, position]);
  // const visibleShops = shops.filter((s) => getDistance(position[0], position[1], s.lat, s.lng) <= s.bankinh / 1000);
  // const visibleShops = shops.filter(
  //   (s) =>
  //     getDistance(position[0], position[1], s.lat, s.lng) <= s.bankinh / 1000
  // );
  useEffect(() => {
    // if (isFromQR) return;
    if (isFromItinerary || isFromQR) return;

    if (!visibleShops.length) {
      setSelectedShop(null);
      return;
    }

    let nearest = visibleShops[0];
    let minDistance = Infinity;

    visibleShops.forEach((s) => {
      const d = getDistance(position[0], position[1], s.lat, s.lng);
      if (d < minDistance) {
        minDistance = d;
        nearest = s;
      }
    });

    // 👇 CHỈ mở panel nếu đổi shop
    if (!selectedShop || selectedShop.id !== nearest.id) {
      setSelectedShop(nearest);
      setIsPanelOpen(true); // 👈 chỉ mở khi shop mới
    }
  }, [position, visibleShops, isFromItinerary, isFromQR, selectedShop]);
  const distance =
    selectedShop &&
    getDistance(position[0], position[1], selectedShop.lat, selectedShop.lng);

  // Tự động bỏ khoảng trắng dư trong database
  const dbLanguages =
    selectedShop?.ngonngu
      ?.split(",")
      .map((l) => ({ code: l.trim(), label: l.trim() })) || [];

  // ==========================================
  // LOGIC DỊCH NGÔN NGỮ (CHỈ DỊCH MÔ TẢ, TÊN QUÁN GIỮ NGUYÊN)
  // ==========================================
  useEffect(() => {
    if (!selectedShop) {
      setDisplayTitle("Đang tải...");
      setDisplayDesc("Đang tải mô tả...");
      return;
    }

    // 1. LUÔN LUÔN GIỮ NGUYÊN TÊN QUÁN GỐC BẰNG TIẾNG VIỆT
    setDisplayTitle(selectedShop.ten);

    const targetLangCode = langCodeMap[panelLang] || "vi";

    if (targetLangCode === "vi") {
      setDisplayDesc(selectedShop.moTa);
    } else {
      setDisplayDesc(`Đang dịch sang ${panelLang}...`);

      const fetchTranslations = async () => {
        try {
          // 2. CHỈ GỌI API DỊCH ĐOẠN MÔ TẢ
          const resDesc = await fetch(
            `http://localhost:8080/api/translate?text=${encodeURIComponent(
              selectedShop.moTa
            )}&to=${targetLangCode}`
          );
          const dataDesc = await resDesc.json();

          setDisplayDesc(dataDesc.translatedText || "Lỗi khi dịch");
        } catch (error) {
          console.error("❌ Lỗi fetch dịch thuật:", error);
          setDisplayDesc("Lỗi dịch thuật, không kết nối được Backend");
        }
      };

      fetchTranslations();
    }
  }, [selectedShop, panelLang]);

  // ==========================================
  // LOGIC PHÁT ÂM THANH (CHỈ ĐỌC MÔ TẢ)
  // ==========================================
  const speakText = async () => {
    if (!displayDesc || displayDesc.includes("Đang dịch")) {
      console.log("Không có nội dung để đọc:", displayDesc);
      return;
    }

    try {
      // Dừng audio cũ nếu đang phát
      if (audioObj) {
        audioObj.pause();
        audioObj.currentTime = 0;
      }

      setIsSpeaking(true);

      const targetLangCode = langCodeMap[panelLang] || "vi";

      const audioRes = await fetch(
        `http://localhost:8080/api/tts?text=${encodeURIComponent(
          displayDesc
        )}&lang=${targetLangCode}`
      );

      if (!audioRes.ok) {
        throw new Error(`Backend TTS lỗi: ${audioRes.status}`);
      }

      const blob = await audioRes.blob();

      if (!blob.size) {
        throw new Error("File âm thanh trả về rỗng");
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      setAudioObj(audio);

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        console.error("Không thể phát file âm thanh");
      };

      await audio.play();
    } catch (err) {
      console.error("Lỗi phát âm thanh:", err);
      setIsSpeaking(false);
      alert("Không thể phát âm thanh! Kiểm tra API TTS và Backend.");
    }
  };

  const stopSpeak = () => {
    if (audioObj) {
      audioObj.pause();
      audioObj.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  // const handleLocateUser = () => {
  //   if (!navigator.geolocation) {
  //     alert("Trình duyệt không hỗ trợ GPS");
  //     return;
  //   }

  //   const watchId = navigator.geolocation.watchPosition(
  //     (pos) => {
  //       console.log("📍 GPS:", pos.coords);

  //       setPosition([pos.coords.latitude, pos.coords.longitude]);
  //     },
  //     (err) => {
  //       console.error(err);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       maximumAge: 0,
  //       timeout: 10000,
  //     }
  //   );
  // };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ GPS");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Lỗi GPS:", err);
        alert(
          "Không thể lấy vị trí hiện tại. Hãy kiểm tra quyền truy cập GPS."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  };

  const validShops = useMemo(() => {
    return shops.filter((s) => {
      return (
        s.lat != null &&
        s.lng != null &&
        s.lat !== "" &&
        s.lng !== "" &&
        Number.isFinite(Number(s.lat)) &&
        Number.isFinite(Number(s.lng))
      );
    });
  }, [shops]);
  return (
    <div className="amui-container">
      <div className="amui-map">
        {/* Bản đồ và các nút */}
        {/* <div className="amui-controller">
          <div></div>
          <button onClick={moveUp}>▲</button>
          <div></div>
          <button onClick={moveLeft}>◀</button>
          <div></div>
          <button onClick={moveRight}>▶</button>
          <div></div>
          <button onClick={moveDown}>▼</button>
          <div></div>
        </div> */}
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "100vh", width: "100%" }}
        >
          {" "}
          <RecenterMap position={position} />
          {/* 👇 THÊM DÒNG NÀY */}
          <MapClickHandler setPosition={setPosition} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* <Marker position={position} icon={blueIcon}>
            <Popup>Vị trí bạn chọn</Popup>
          </Marker> */}
          {!isFromItinerary && (
            <Marker position={position} icon={blueIcon}>
              <Popup>Vị trí bạn chọn</Popup>
            </Marker>
          )}
          {/* Nếu đang xem Food Tour thì chỉ hiển thị các quán trong lịch trình */}
          {/* Nếu đang xem Food Tour thì chỉ hiển thị các quán trong lịch trình */}
          {isFromItinerary ? (
            <>
              {itineraryStops
                .filter((stop) => {
                  const place = stop.foodPlace;

                  return (
                    place &&
                    place.latitude != null &&
                    place.longitude != null &&
                    Number.isFinite(Number(place.latitude)) &&
                    Number.isFinite(Number(place.longitude))
                  );
                })
                .map((stop, index) => {
                  const place = stop.foodPlace;

                  return (
                    <Marker
                      key={`${stop.sequence ?? index}-${place.id ?? index}`}
                      position={[
                        Number(place.latitude),
                        Number(place.longitude),
                      ]}
                      icon={redIcon}
                      eventHandlers={{
                        click: () => {
                          // Tìm thông tin quán đầy đủ từ API /api/cuahang
                          const fullShop = shops.find(
                            (s) => String(s.id) === String(place.id)
                          );

                          console.log("Quán trong lịch trình:", place);
                          console.log("Thông tin quán từ database:", fullShop);

                          if (fullShop) {
                            // Ưu tiên lấy dữ liệu đầy đủ từ database
                            setSelectedShop(fullShop);
                          } else {
                            // Dữ liệu dự phòng nếu chưa tìm thấy quán
                            setSelectedShop({
                              id: place.id,
                              ten: place.name,
                              moTa: place.moTa ?? place.description ?? "",
                              lat: place.latitude,
                              lng: place.longitude,
                              imageBanner: place.imageBanner,
                              ngonngu: place.ngonngu ?? "Tiếng Việt",
                            });
                          }

                          setIsPanelOpen(true);
                          setIsSpeaking(false);
                        },
                      }}
                    />
                  );
                })}
            </>
          ) : (
            validShops.map((s) => (
              <React.Fragment key={s.id}>
                <Marker
                  position={[Number(s.lat), Number(s.lng)]}
                  icon={redIcon}
                >
                  <Popup>{s.ten}</Popup>
                </Marker>

                <Circle
                  center={[s.lat, s.lng]}
                  radius={s.bankinh}
                  pathOptions={{ color: "red" }}
                />
              </React.Fragment>
            ))
          )}
          {/* {isFromItinerary && foodTourRoute.length > 0 && (
            <Polyline positions={foodTourRoute} color="#2563eb" weight={5} />
          )}

          {!isFromItinerary && route.length > 0 && (
            <Polyline positions={route} color="blue" />
          )}{" "} */}
          {/* Đường đi Food Tour */}
          {isFromItinerary && foodTourRoute.length > 0 && (
            <Polyline positions={foodTourRoute} color="#2563eb" weight={5} />
          )}
          {/* Đường đi GPS thông thường */}
          {!isFromItinerary && route.length > 0 && (
            <Polyline positions={route} color="blue" />
          )}
        </MapContainer>
        <div className="amui-map-overlay">GPS đang bật</div>
        <div className="amui-bottom-right-controls" style={{ zIndex: 2000 }}>
          <button className="amui-btn-icon" onClick={handleLocateUser}>
            🎯
          </button>

          <button
            className="amui-btn-icon active"
            onClick={() => navigate("/scan")}
          >
            🔳
          </button>
        </div>
        <button
          className="amui-back-floating"
          onClick={() => navigate("/mhuser")}
        >
          QUAY LẠI
        </button>

        {/* Nút chọn ngôn ngữ góc phải trên */}
        <div
          className="amui-lang-floating"
          onClick={() => setShowLang(!showLang)}
        >
          <span>{floatingLang.code}</span>
          <strong>{floatingLang.label}</strong>
          {showLang && (
            <div className="amui-lang-dropdown">
              {dbLanguages.map((lang, i) => (
                <div
                  key={i}
                  className="amui-lang-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFloatingLang(lang);
                    setShowLang(false);
                  }}
                >
                  {lang.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedShop && isPanelOpen && (
        <div className="amui-panel">
          <button
            className="amui-close-btn"
            onClick={() => {
              setIsPanelOpen(false);
            }}
          >
            ✖
          </button>
          <div className="amui-panel-header">
            <h2>{displayTitle}</h2>
            <p>
              {/* {distance
                ? `${distance.toFixed(2)} km từ vị trí của bạn`
                : "Đang tính..."} */}
              {distance != null
                ? `${distance.toFixed(2)} km từ vị trí của bạn`
                : "Đang tính..."}
            </p>
          </div>
          {selectedShop.imageBanner && (
            <img
              src={`http://localhost:8080/uploads/${selectedShop.imageBanner}`}
              alt="banner"
              className="amui-banner"
              style={{ width: "100%" }}
            />
          )}
          {/* NÚT CHỌN NGÔN NGỮ ĐỂ DỊCH VÀ ĐỌC */}
          <div className="amui-languages">
            {dbLanguages.map((lang, i) => (
              <button
                key={i}
                className={lang.label === panelLang ? "amui-active" : ""}
                onClick={() => setPanelLang(lang.label)}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* CHỖ IN MÔ TẢ ĐÃ DỊCH */}
          <p className="amui-description">{displayDesc}</p>

          <div className="amui-player">
            <div className="amui-status">
              {isSpeaking ? "Đang phát..." : "Đã phát xong"}
            </div>
            <div>
              <button className="amui-replay" onClick={speakText}>
                Phát lại
              </button>
              <button
                className="amui-replay"
                onClick={stopSpeak}
                style={{ marginLeft: 10 }}
              >
                Dừng
              </button>
            </div>
          </div>

          <div className="amui-playing">
            <span>ĐANG PHÁT</span>
            <strong>{displayDesc}</strong>
          </div>
          {/* <button className="amui-start-btn" onClick={startSimulation}>▶ Bắt đầu</button> */}
        </div>
      )}

      <div className="amui-bottom-nav">
        <div className="amui-nav-item">
          <span>🗺️</span>
          <p>BẢN ĐỒ</p>
        </div>

        {/* <div className="amui-nav-item">
          <span>📍</span>
          <p>LỘ TRÌNH</p>
        </div> */}

        <div
          className="amui-nav-item active"
          onClick={() => navigate("/settings")}
        >
          <span>👤</span>
          <p>TÔI</p>
        </div>
      </div>
    </div>
  );
}

export default AudioMapAI;
