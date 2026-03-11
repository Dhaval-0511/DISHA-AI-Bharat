import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { districts, predictions, needIndices, getDistrictAllocations } from "@/data/mockData";
import type { AllocationStatus } from "@/types";
import { formatCrores } from "@/components/shared/DataWidgets";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function getDistrictStatus(districtId: string): { aes: number; status: AllocationStatus } {
  const pred = predictions.find(p => p.districtId === districtId);
  if (!pred) return { aes: 1, status: "OPTIMAL" };
  return { aes: pred.aes_score, status: pred.allocation_status };
}

function statusColor(status: AllocationStatus): string {
  if (status === "UNDER") return "#ef4444";
  if (status === "OVER") return "#3b82f6";
  return "#22c55e";
}

interface DistrictPanelData {
  id: string;
  name: string;
  region: string;
  population: number;
  niScore: number;
  currentAlloc: number;
  predictedNeed: number;
  gap: number;
  aes: number;
  status: AllocationStatus;
}

export function GujaratMap({ onDistrictClick }: { onDistrictClick?: (id: string) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [panel, setPanel] = useState<DistrictPanelData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [22.2587, 71.1924],
      zoom: 7,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      maxZoom: 10,
    }).addTo(map);

    districts.forEach((d) => {
      const { aes, status } = getDistrictStatus(d.id);
      const color = statusColor(status);
      const ni = needIndices.find(n => n.districtId === d.id);
      const pred = predictions.find(p => p.districtId === d.id);
      const allocs = getDistrictAllocations(d.id);
      const latestAlloc = allocs[allocs.length - 1];

      const circle = L.circleMarker([d.lat, d.lng], {
        radius: Math.max(8, Math.min(16, d.population / 600000)),
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7,
      }).addTo(map);

      circle.bindTooltip(
        `<strong>${d.name}</strong><br/>AES: ${aes.toFixed(3)}<br/>Status: ${status === "UNDER" ? "Under-Allocated" : status === "OVER" ? "Over-Allocated" : "Optimal"}`,
        { className: "text-xs", direction: "top" }
      );

      circle.on("click", () => {
        setPanel({
          id: d.id,
          name: d.name,
          region: d.region,
          population: d.population,
          niScore: ni?.need_index_score ?? 0,
          currentAlloc: latestAlloc?.allocated_amount ?? 0,
          predictedNeed: pred?.predicted_need ?? 0,
          gap: pred?.gap ?? 0,
          aes,
          status,
        });
        if (onDistrictClick) onDistrictClick(d.id);
      });
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  const statusBadge = (status: AllocationStatus) => {
    const cls = status === "UNDER" ? "status-under" : status === "OVER" ? "status-over" : "status-optimal";
    return <span className={`govt-badge ${cls}`}>{status === "UNDER" ? "Under-Allocated" : status === "OVER" ? "Over-Allocated" : "Optimal"}</span>;
  };

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[450px] rounded-lg border" />

      {/* Side panel */}
      {panel && (
        <div className="absolute top-0 right-0 w-72 h-full bg-card/95 backdrop-blur-sm border-l rounded-r-lg p-4 overflow-y-auto shadow-xl animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-bold text-sm">{panel.name}</h3>
            <button onClick={() => setPanel(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex gap-2">
              <span className="govt-badge bg-primary/10 text-primary">Gujarat</span>
              <span className="govt-badge bg-muted text-muted-foreground">{panel.region}</span>
              {statusBadge(panel.status)}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-muted-foreground text-[10px]">Population</p>
                <p className="font-semibold">{(panel.population / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-muted-foreground text-[10px]">Need Index</p>
                <p className="font-semibold font-mono">{panel.niScore.toFixed(3)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-muted-foreground text-[10px]">Current Alloc</p>
                <p className="font-semibold">{formatCrores(panel.currentAlloc)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-muted-foreground text-[10px]">Predicted Need</p>
                <p className="font-semibold">{formatCrores(panel.predictedNeed)}</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-muted-foreground text-[10px]">Allocation Gap</p>
              <p className={`font-semibold ${panel.gap > 0 ? "text-destructive" : panel.gap < 0 ? "text-info" : ""}`}>
                {panel.gap > 0 ? "+" : ""}{formatCrores(panel.gap)}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-muted-foreground text-[10px]">AES Score</p>
              <p className="font-semibold font-mono text-base">{panel.aes.toFixed(3)}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5">1.0 = Perfect Allocation</p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => navigate(`/districts/${panel.id}`)}>
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
