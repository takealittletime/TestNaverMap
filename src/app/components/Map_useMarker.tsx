/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    naver: typeof naver;
  }
}

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const [latInput, setLatInput] = useState("37.3595704");
  const [lngInput, setLngInput] = useState("127.105399");
  const [zoomInput, setZoomInput] = useState("10");

  const [lastMarker, setLastMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.naver) return;

      const initialCenter = new window.naver.maps.LatLng(
        37.3595704,
        127.105399,
      );

      const mapOptions = {
        center: initialCenter,
        zoom: 10,
        mapTypeControl: true,
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // 지도 중심 변경 이벤트
      window.naver.maps.Event.addListener(map, "center_changed", () => {
        const center = map.getCenter() as {
          lat(): number;
          lng(): number;
        };
        setLatInput(center.lat().toFixed(6));
        setLngInput(center.lng().toFixed(6));
      });

      // 줌 레벨 변경 이벤트
      window.naver.maps.Event.addListener(map, "zoom_changed", () => {
        const zoom = map.getZoom();
        setZoomInput(zoom.toString());
      });

      // 클릭 이벤트로 마커 생성
      window.naver.maps.Event.addListener(map, "click", (e: any) => {
        const position = e.coord;
        const marker = new window.naver.maps.Marker({
          position: position,
          map: map,
        });

        setLastMarker({
          lat: position.lat(),
          lng: position.lng(),
        });
      });

      // 검색 기능 구현
      const searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.placeholder = "장소를 입력하세요";
      searchInput.style.position = "absolute";
      searchInput.style.top = "10px";
      searchInput.style.left = "10px";
      searchInput.style.padding = "10px";
      searchInput.style.zIndex = "5";
      searchInput.style.width = "600px";
      mapRef.current.appendChild(searchInput);

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = searchInput.value;
          window.naver.maps.Service.geocode(
            {
              query: query,
            },
            (status: any, response: any) => {
              if (status === window.naver.maps.Service.Status.ERROR) {
                return alert("검색 결과가 없습니다!");
              }
              if (response.v2.meta.totalCount > 0) {
                const item = response.v2.addresses[0];
                const point = new window.naver.maps.Point(item.x, item.y);

                map.setCenter(point);
                map.setZoom(15);

                const marker = new window.naver.maps.Marker({
                  position: point,
                  map: map,
                });

                setLastMarker({
                  lat: Number(item.y),
                  lng: Number(item.x),
                });
              }
            },
          );
        }
      });
    };

    const script = document.createElement("script");
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_KEY}&submodules=geocoder`;
    script.onload = initializeMap;
    document.head.appendChild(script);
  }, []);

  const handleConfirm = () => {
    if (mapInstanceRef.current) {
      const lat = parseFloat(latInput);
      const lng = parseFloat(lngInput);
      const zoom = parseInt(zoomInput, 10);

      if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
        const newCenter = new window.naver.maps.LatLng(lat, lng);
        mapInstanceRef.current.setCenter(newCenter);
        mapInstanceRef.current.setZoom(zoom);

        setLastMarker({ lat, lng });
      } else {
        alert("올바른 위도, 경도, 확대배율을 입력해주세요.");
      }
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: "50px",
          right: "10px",
          zIndex: 10,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 0 5px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ marginBottom: "5px" }}>
          <label>
            위도:{" "}
            <input
              type="text"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              style={{ width: "100px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <label>
            경도:{" "}
            <input
              type="text"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              style={{ width: "100px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <label>
            확대 비율:{" "}
            <input
              type="text"
              value={zoomInput}
              onChange={(e) => setZoomInput(e.target.value)}
              style={{ width: "50px" }}
            />
          </label>
        </div>
        <button onClick={handleConfirm}>확인</button>
      </div>

      {lastMarker && (
        <div
          style={{
            position: "absolute",
            bottom: "250px",
            left: "10px",
            zIndex: 10,
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(0,0,0,0.3)",
          }}
        >
          <strong>마지막 마커:</strong>
          <p>위도: {lastMarker.lat.toFixed(6)}</p>
          <p>경도: {lastMarker.lng.toFixed(6)}</p>
        </div>
      )}

      <div
        ref={mapRef}
        style={{ width: "100%", height: "80%", position: "relative" }}
      />
    </div>
  );
};

export default MapComponent;
