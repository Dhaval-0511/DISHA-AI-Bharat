import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { districts } from "@/data/mockData";
import { predictions } from "@/data/mockData";
import type { AllocationStatus } from "@/types";

function getDistrictAvgAES(districtId: string): { aes: number; status: AllocationStatus } {
  const dp = predictions.filter(p => p.districtId === districtId);
  if (!dp.length) return { aes: 1, status: "OPTIMAL" };
  const avg = dp.reduce((s, p) => s + p.aes_score, 0) / dp.length;
  const status: AllocationStatus = avg < 0.9 ? "UNDER" : avg > 1.1 ? "OVER" : "OPTIMAL";
  return { aes: Math.round(avg * 100) / 100, status };
}

function statusColor(status: AllocationStatus): string {
  if (status === "UNDER") return "#ef4444";
  if (status === "OVER") return "#3b82f6";
  return "#22c55e";
}

export function IndiaMap({ onDistrictClick }: { onDistrictClick?: (id: string) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [22.5, 78.5],
      zoom: 5,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      maxZoom: 8,
    }).addTo(map);

    districts.forEach((d) => {
      const { aes, status } = getDistrictAvgAES(d.id);
      const color = statusColor(status);
      const circle = L.circleMarker([d.lat, d.lng], {
        radius: Math.max(6, Math.min(14, d.population / 800000)),
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.55,
      }).addTo(map);

      circle.bindTooltip(
        `<strong>${d.name}</strong><br/>AES: ${aes}<br/>Status: ${status}`,
        { className: "text-xs" }
      );

      if (onDistrictClick) {
        circle.on("click", () => onDistrictClick(d.id));
      }
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [onDistrictClick]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg border" />;
}
