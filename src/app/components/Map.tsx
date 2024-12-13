"use client";

import { useEffect, useRef } from "react";

interface MapProps {
  width?: string;
  height?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

export default function Map({
  width = "100%",
  height = "400px",
  initialCenter = { lat: 37.5666805, lng: 126.9784147 }, // 서울시청 좌표
  initialZoom = 15,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(
        initialCenter.lat,
        initialCenter.lng,
      ),
      zoom: initialZoom,
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
  }, [initialCenter, initialZoom]);

  return <div ref={mapRef} style={{ width, height }} />;
}
