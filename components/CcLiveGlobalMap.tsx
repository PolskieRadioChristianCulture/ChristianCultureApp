import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Globe,
  Radio,
  Book,
  Heart,
  Map as MapIcon,
  Maximize2,
  Zap,
  LayoutGrid,
  Clock,
  Activity,
  Target,
  ArrowLeft,
} from "lucide-react";
import {
  geoOrthographic,
  geoPath,
  geoMercator,
  geoGraticule,
  geoDistance,
} from "d3-geo";
import * as topojson from "topojson-client";
import worldData110 from "world-atlas/countries-110m.json";
import worldData10 from "world-atlas/countries-10m.json";

const world110 = topojson.feature(
  worldData110 as any,
  (worldData110 as any).objects.countries,
) as any;
const world10 = topojson.feature(
  worldData10 as any,
  (worldData10 as any).objects.countries,
) as any;
const polandFeature = world10.features.find((f: any) => f.id === "616");

interface PrayPoint {
  id?: string;
  x: number;
  y: number;
  lat: number;
  lon: number;
  city: string;
  activity: "bible" | "radio" | "prayer";
  timestamp: number;
  userName: string;
}

interface CcLiveGlobalMapProps {
  isOpen: boolean;
  onClose: () => void;
  uiLang: "pl" | "en";
}

export const CcLiveGlobalMap: React.FC<CcLiveGlobalMapProps> = ({
  isOpen,
  onClose,
  uiLang,
}) => {
  const [viewMode, setViewMode] = useState<"GLOBAL" | "POLAND">("GLOBAL");
  const [unifiedCount, setUnifiedCount] = useState(14502);
  const [checkInCity, setCheckInCity] = useState("");
  const [checkInActivity, setCheckInActivity] = useState<
    "bible" | "radio" | "prayer"
  >("prayer");
  const [isCheckInVisible, setIsCheckInVisible] = useState(true);
  const [points, setPoints] = useState<PrayPoint[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hudPositions, setHudPositions] = useState<
    Record<string, { x: number; y: number; scale?: number }>
  >(() => {
    try {
      const saved = localStorage.getItem("cc_global_hud_positions_v1");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleDragEnd = (id: string, info: any) => {
    setHudPositions((prev) => {
      const next = {
        ...prev,
        [id]: {
          x: (prev[id]?.x || 0) + info.offset.x,
          y: (prev[id]?.y || 0) + info.offset.y,
          scale: prev[id]?.scale || 1,
        },
      };
      localStorage.setItem("cc_global_hud_positions_v1", JSON.stringify(next));
      return next;
    });
  };

  const handleScaleDelta = (id: string, delta: number) => {
    setHudPositions((prev) => {
      const currentScale = prev[id]?.scale ?? 1;
      const newScale = Math.max(0.4, Math.min(3.0, currentScale + delta));
      const next = {
        ...prev,
        [id]: { ...(prev[id] || { x: 0, y: 0 }), scale: newScale },
      };
      localStorage.setItem("cc_global_hud_positions_v1", JSON.stringify(next));
      return next;
    });
  };

  const renderResizeHandle = (id: string) => (
    <div
      className="absolute -bottom-3 -right-3 w-8 h-8 cursor-nwse-resize flex items-center justify-center z-[100] touch-none opacity-50 hover:opacity-100 transition-opacity"
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const startY =
          e.clientY || (e.nativeEvent as any).touches?.[0]?.clientY || 0;
        let lastY = startY;

        const onMove = (moveEvt: PointerEvent | TouchEvent) => {
          const currentY =
            (moveEvt as PointerEvent).clientY ??
            (moveEvt as TouchEvent).touches?.[0]?.clientY ??
            lastY;
          const deltaY = currentY - lastY;
          lastY = currentY;
          handleScaleDelta(id, deltaY * 0.01);
        };

        const onUp = () => {
          window.removeEventListener("pointermove", onMove as any);
          window.removeEventListener("pointerup", onUp);
          window.removeEventListener("touchmove", onMove as any);
          window.removeEventListener("touchend", onUp);
        };

        window.addEventListener("pointermove", onMove as any);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("touchmove", onMove as any, { passive: false });
        window.addEventListener("touchend", onUp);
      }}
    >
      <div className="w-3 h-3 border-r-2 border-b-2 border-[#C5A059]" />
    </div>
  );

  const resetLayout = () => {
    setHudPositions({});
    localStorage.removeItem("cc_global_hud_positions_v1");
  };

  const [activeCityName, setActiveCityName] = useState<string | null>(null);
  const activeCityRef = useRef<PrayPoint | null>(null);

  useEffect(() => {
    if (points.length === 0) return;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * points.length);
      activeCityRef.current = points[idx];
      setActiveCityName(points[idx].city);
      setTimeout(() => {
        if (activeCityRef.current?.id === points[idx].id) {
          activeCityRef.current = null;
          setActiveCityName(null);
        }
      }, 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, [points]);

  useEffect(() => {
    const realPoints: PrayPoint[] = [
      {
        lat: 50.0647,
        lon: 19.945,
        city: "Kraków",
        activity: "radio",
        timestamp: Date.now(),
        userName: "46 sesji (149,16h)",
        x: 0,
        y: 0,
      },
      {
        lat: 52.4064,
        lon: 16.9252,
        city: "Poznań",
        activity: "radio",
        timestamp: Date.now() - 1000,
        userName: "641 sesji (147,55h)",
        x: 0,
        y: 0,
      },
      {
        lat: 50.0412,
        lon: 21.0067,
        city: "Rzeszów",
        activity: "radio",
        timestamp: Date.now() - 2000,
        userName: "97 sesji (115,57h)",
        x: 0,
        y: 0,
      },
      {
        lat: 50.8878,
        lon: 21.6669,
        city: "Ożarów",
        activity: "radio",
        timestamp: Date.now() - 3000,
        userName: "1701 sesji (113,11h)",
        x: 0,
        y: 0,
      },
      {
        lat: 52.2297,
        lon: 21.0122,
        city: "Warszawa",
        activity: "radio",
        timestamp: Date.now() - 4000,
        userName: "329 sesji (104,64h)",
        x: 0,
        y: 0,
      },
      {
        lat: 54.352,
        lon: 18.6466,
        city: "Gdańsk",
        activity: "radio",
        timestamp: Date.now() - 5000,
        userName: "56 sesji (30,72h)",
        x: 0,
        y: 0,
      },
      {
        lat: 52.7368,
        lon: 15.2288,
        city: "Gorzów Wlkp.",
        activity: "radio",
        timestamp: Date.now() - 6000,
        userName: "130 sesji (25,70h)",
        x: 0,
        y: 0,
      },
      {
        lat: 53.1235,
        lon: 18.0084,
        city: "Bydgoszcz",
        activity: "radio",
        timestamp: Date.now() - 7000,
        userName: "39 sesji (22,42h)",
        x: 0,
        y: 0,
      },
      {
        lat: 51.7592,
        lon: 19.456,
        city: "Łódź",
        activity: "radio",
        timestamp: Date.now() - 8000,
        userName: "48 sesji (19,21h)",
        x: 0,
        y: 0,
      },
      {
        lat: 51.1079,
        lon: 17.0385,
        city: "Wrocław",
        activity: "radio",
        timestamp: Date.now() - 9000,
        userName: "53 sesji (16,73h)",
        x: 0,
        y: 0,
      },
      {
        lat: 52.52,
        lon: 13.405,
        city: "Niemcy",
        activity: "radio",
        timestamp: Date.now() - 10000,
        userName: "222 sesje (148,42h)",
        x: 0,
        y: 0,
      },
      {
        lat: 40.7128,
        lon: -74.006,
        city: "Stany Zjednoczone",
        activity: "radio",
        timestamp: Date.now() - 11000,
        userName: "186 sesji (48,15h)",
        x: 0,
        y: 0,
      },
      {
        lat: 52.3676,
        lon: 4.9041,
        city: "Holandia",
        activity: "radio",
        timestamp: Date.now() - 12000,
        userName: "16 sesji (21,47h)",
        x: 0,
        y: 0,
      },
      {
        lat: 51.5074,
        lon: -0.1278,
        city: "Wielka Brytania",
        activity: "radio",
        timestamp: Date.now() - 13000,
        userName: "98 sesji (18,09h)",
        x: 0,
        y: 0,
      },
    ];
    setPoints(realPoints);
    setUnifiedCount(4313); // total sessions from the report

    const interval = setInterval(() => {
      setUnifiedCount((prev) => prev + Math.floor(Math.random() * 2));
      setCurrentTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInCity) return;

    // Simulate finding coordinates or just randomizing for display
    const newPoint: PrayPoint = {
      lat: 52.0 + (Math.random() - 0.5) * 5,
      lon: 20.0 + (Math.random() - 0.5) * 10,
      city: checkInCity,
      activity: checkInActivity,
      timestamp: Date.now(),
      userName: appUserEmail?.split("@")[0] || "Wojownik",
      x: 0,
      y: 0,
    };

    setPoints((prev) => [newPoint, ...prev].slice(0, 50));
    setCheckInCity("");
  };

  // Logic from GlobeModal for the 3D rotating globe
  useEffect(() => {
    if (!isOpen || viewMode !== "GLOBAL") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let rotation = 0;

    const stars = Array.from({ length: 300 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      alpha: Math.random(),
      speed: Math.random() * 0.4 + 0.1,
    }));

    const animate = () => {
      if (viewMode !== "GLOBAL") return;
      ctx.clearRect(0, 0, width, height);

      // NASA Atmosphere Depth
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width,
      );
      bgGrad.addColorStop(0, "#0a1020"); // deep space blue hue
      bgGrad.addColorStop(0.4, "#050a14");
      bgGrad.addColorStop(1, "#000000");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Starfield
      stars.forEach((star) => {
        star.x -= star.speed;
        if (star.x < 0) star.x = width;
        star.alpha += (Math.random() - 0.5) * 0.05;
        if (star.alpha > 1) star.alpha = 1;
        if (star.alpha < 0) star.alpha = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.4;
      rotation += 0.002;

      const currentRotLon = -rotation * (180 / Math.PI);
      const currentRotLat = -20;

      const projection = geoOrthographic()
        .translate([centerX, centerY])
        .scale(radius)
        .rotate([currentRotLon, currentRotLat]);

      const d3Path = geoPath(projection, ctx);

      // Atmosphere Glow
      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius - 20,
        centerX,
        centerY,
        radius + 140,
      );
      glow.addColorStop(0, "rgba(197, 160, 89, 0.3)"); // pure gold glow
      glow.addColorStop(0.4, "rgba(197, 160, 89, 0.1)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 140, 0, Math.PI * 2);
      ctx.fill();

      // Globe Sphere (Ocean)
      const oceanGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius,
      );
      oceanGrad.addColorStop(0, "#0a3055"); // Lighter vivid blue on top left
      oceanGrad.addColorStop(0.7, "#051830"); // Deeper navy
      oceanGrad.addColorStop(1, "#020a14"); // Almost black shadow at edge

      ctx.beginPath();
      d3Path({ type: "Sphere" } as any);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // We use clip for landmass to stay within the sphere
      ctx.save();
      ctx.beginPath();
      d3Path({ type: "Sphere" } as any);
      ctx.clip();

      // Landmass
      const landGrad = ctx.createLinearGradient(
        centerX - radius,
        centerY - radius,
        centerX + radius,
        centerY + radius,
      );
      landGrad.addColorStop(0, "#4a8f55"); // Vivid green
      landGrad.addColorStop(0.5, "#2B4A34"); // Earthy land green
      landGrad.addColorStop(1, "#112215"); // Deep shadow green

      ctx.beginPath();
      d3Path(world110 as any);
      ctx.fillStyle = landGrad;
      ctx.fill();
      ctx.strokeStyle = "#5ca268";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Inner shadow for spherical 3D effect
      const vignette = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.4,
        centerX,
        centerY,
        radius,
      );
      const timeSec = Date.now() * 0.002;
      const vignetteOpacity = 0.8 + Math.sin(timeSec) * 0.1; // Pulses between 0.7 and 0.9
      const edgeOpacity = 0.9 + Math.sin(timeSec * 0.5) * 0.1; // Pulses between 0.8 and 1.0

      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(0.8, `rgba(0, 0, 0, ${vignetteOpacity})`);
      vignette.addColorStop(1, `rgba(0, 0, 0, ${edgeOpacity})`);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = vignette;
      ctx.fill();

      ctx.restore(); // Restore clip

      // Globe Border
      ctx.beginPath();
      d3Path({ type: "Sphere" } as any);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
      ctx.stroke();

      // Grid
      const graticule = geoGraticule();
      ctx.beginPath();
      d3Path(graticule() as any);
      ctx.strokeStyle = "rgba(197, 160, 89, 0.08)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Drawing points
      points.forEach((p) => {
        const centerLon = -currentRotLon;
        const centerLat = -currentRotLat;
        const distance = geoDistance([p.lon, p.lat], [centerLon, centerLat]);

        if (distance < Math.PI / 2) {
          const coords = projection([p.lon, p.lat]);
          if (!coords) return;
          const [x, y] = coords;

          const pulse = (Math.sin(Date.now() * 0.003 + p.lat) + 1) / 2;

          // Outer Bloom
          ctx.beginPath();
          ctx.arc(x, y, 5 + pulse * 15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(197, 160, 89, ${0.1 * pulse})`;
          ctx.fill();

          // Gold Core
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#D4AF37";
          ctx.fill();

          // Label
          if (pulse > 0.5) {
            ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
            ctx.font = "8px Inter, sans-serif";
            ctx.fillText(`${p.city.toUpperCase()}`, x + 8, y + 3);
          }
        }
      });

      if (activeCityRef.current) {
        const act = activeCityRef.current;
        const centerLon = -currentRotLon;
        const centerLat = -currentRotLat;
        const distance = geoDistance(
          [act.lon, act.lat],
          [centerLon, centerLat],
        );

        if (distance < Math.PI / 2) {
          const coords = projection([act.lon, act.lat]);
          if (coords) {
            const [px, py] = coords;
            const timeStr = Date.now() * 0.005;
            const reticleRadius = 35 + Math.sin(timeStr) * 10;

            ctx.beginPath();
            ctx.arc(px, py, reticleRadius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.lineWidth = 2;
            ctx.setLineDash([15, 10]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.moveTo(px - 50, py);
            ctx.lineTo(px - 15, py);
            ctx.moveTo(px + 15, py);
            ctx.lineTo(px + 50, py);
            ctx.moveTo(px, py - 50);
            ctx.lineTo(px, py - 15);
            ctx.moveTo(px, py + 15);
            ctx.lineTo(px, py + 50);
            ctx.strokeStyle = "rgba(255, 0, 0, 0.6)";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = "red";
            ctx.fill();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isOpen, viewMode, points]);

  // Logic for Poland detail View
  useEffect(() => {
    if (!isOpen || viewMode !== "POLAND") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 300 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      alpha: Math.random(),
      speed: Math.random() * 0.4 + 0.1,
    }));

    const animate = () => {
      if (viewMode !== "POLAND") return;
      ctx.clearRect(0, 0, width, height);

      // Deep Space background with nebula
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width,
      );
      bgGrad.addColorStop(0, "#0a0a1a");
      bgGrad.addColorStop(0.5, "#050510");
      bgGrad.addColorStop(1, "#000000");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Starfield
      stars.forEach((star) => {
        star.x -= star.speed;
        if (star.x < 0) star.x = width;
        star.alpha += (Math.random() - 0.5) * 0.05;
        if (star.alpha > 1) star.alpha = 1;
        if (star.alpha < 0) star.alpha = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Grid Layer
      ctx.strokeStyle = "rgba(197, 160, 89, 0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // D3 Poland Projection
      const projection = geoMercator()
        .center([19.1, 52.0])
        .scale(Math.min(width, height) * 3)
        .translate([width / 2, height / 2]);

      const d3Path = geoPath(projection, ctx);

      // Europe/World background landmass (faint)
      ctx.beginPath();
      d3Path(world10 as any);
      ctx.fillStyle = "#05120a"; // Deeper dark earthy color
      ctx.fill();
      ctx.strokeStyle = "rgba(58, 90, 68, 0.4)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Poland
      if (polandFeature) {
        // Add outer glow for Poland
        ctx.shadowColor = "rgba(197, 160, 89, 0.5)";
        ctx.shadowBlur = 30;

        const polandGrad = ctx.createLinearGradient(
          width / 2 - 200,
          height / 2 - 200,
          width / 2 + 200,
          height / 2 + 200,
        );
        polandGrad.addColorStop(0, "#4a8f55"); // Vivid green
        polandGrad.addColorStop(0.5, "#2B4A34"); // Earthy land green
        polandGrad.addColorStop(1, "#112215"); // Deep shadow green

        ctx.beginPath();
        d3Path(polandFeature as any);
        ctx.fillStyle = polandGrad;
        ctx.fill();

        ctx.shadowBlur = 0; // reset shadow

        ctx.strokeStyle = "#D4AF37"; // Gold border for Poland
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // inner glow effect
        ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Flash points on Poland
      points.forEach((p) => {
        if (p.lat > 48 && p.lat < 55.5 && p.lon > 14 && p.lon < 24.5) {
          const coords = projection([p.lon, p.lat]);
          if (!coords) return;
          const [px, py] = coords;

          const pulse = (Math.sin(Date.now() * 0.005 + p.timestamp) + 1) / 2;

          // Scanline effect
          ctx.beginPath();
          ctx.arc(px, py, pulse * 40, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(197, 160, 89, ${0.1 * (1 - pulse)})`;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#D4AF37";
          ctx.fill();

          ctx.fillStyle = "white";
          ctx.font = "10px Inter, sans-serif";
          ctx.fillText(p.userName, px + 8, py - 4);
          ctx.fillStyle = "#D4AF37";
          ctx.fillText(p.city, px + 8, py + 8);
        }
      });

      if (activeCityRef.current) {
        const act = activeCityRef.current;
        if (act.lat > 48 && act.lat < 55.5 && act.lon > 14 && act.lon < 24.5) {
          const coords = projection([act.lon, act.lat]);
          if (coords) {
            const [px, py] = coords;
            const timeStr = Date.now() * 0.005;
            const reticleRadius = 45 + Math.sin(timeStr) * 15;

            ctx.beginPath();
            ctx.arc(px, py, reticleRadius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.lineWidth = 2;
            ctx.setLineDash([20, 10]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.moveTo(px - 70, py);
            ctx.lineTo(px - 20, py);
            ctx.moveTo(px + 20, py);
            ctx.lineTo(px + 70, py);
            ctx.moveTo(px, py - 70);
            ctx.lineTo(px, py - 20);
            ctx.moveTo(px, py + 20);
            ctx.lineTo(px, py + 70);
            ctx.strokeStyle = "rgba(255, 0, 0, 0.6)";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = "red";
            ctx.fill();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isOpen, viewMode, points]);

  const appUserEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("cc_user_email")
      : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[7000] bg-black overflow-hidden font-sans"
        >
          {/* BACKGROUND CANVAS */}
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* BIG WOW TEXT FOR ACTIVE CITY */}
          <AnimatePresence>
            {activeCityName && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateX: 45 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                transition={{ type: "spring", bounce: 0.4, duration: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center mix-blend-screen"
                style={{ perspective: 1000 }}
              >
                <h1 className="text-6xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#C5A059] to-transparent tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(197,160,89,0.8)]">
                  {activeCityName}
                </h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#C5A059] text-sm sm:text-2xl font-mono tracking-[0.5em] mt-2 sm:mt-4 uppercase font-bold text-shadow-glow"
                >
                  {uiLang === "pl" ? "NOWE POŁĄCZENIE" : "NEW CONNECTION"}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HUD - TOP LEFT: MISSION CLOCK & RETURN */}
          <motion.div
            drag
            dragMomentum={false}
            animate={{
              x: hudPositions["top-left"]?.x || 0,
              y: hudPositions["top-left"]?.y || 0,
              scale: hudPositions["top-left"]?.scale || 1,
            }}
            onDragEnd={(e, info) => handleDragEnd("top-left", info)}
            onWheel={(e) => {
              e.stopPropagation();
              handleScaleDelta("top-left", e.deltaY > 0 ? -0.05 : 0.05);
            }}
            className="absolute top-4 sm:top-8 left-4 sm:left-8 z-30 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-move"
            style={{ transformOrigin: "top left" }}
          >
            <button
              onClick={onClose}
              className="group flex items-center gap-3 bg-black/80 border border-[#C5A059]/30 hover:border-[#C5A059] p-2 pr-6 rounded-none relative backdrop-blur-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(197,160,89,0.1)] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#C5A059] cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-white/5 flex items-center justify-center text-[#C5A059] transition-colors">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">
                  {uiLang === "pl" ? "Wróć do Pulpitu" : "Return to Home"}
                </div>
                <div className="text-[7px] sm:text-[8px] text-[#C5A059] font-bold uppercase tracking-[0.2em] leading-none">
                  {uiLang === "pl" ? "Zakończ Sesję" : "End Session"}
                </div>
              </div>
            </button>

            <div className="hidden sm:block h-10 w-px bg-[#C5A059]/20" />

            <div className="flex items-center gap-3 sm:gap-4 relative">
              <div className="p-2 sm:p-3 bg-black/60 border border-[#C5A059]/30 backdrop-blur-md">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A059]" />
              </div>
              <div className="font-mono">
                <div className="text-[#C5A059] text-xl sm:text-2xl font-black tracking-tighter leading-none shadow-black drop-shadow-[0_0_5px_rgba(197,160,89,0.4)]">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
                <div className="text-zinc-500 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-bold mt-1">
                  SYS.TIME.SYNC
                </div>
              </div>
            </div>
            {renderResizeHandle("top-left")}
          </motion.div>

          {/* HUD - TOP RIGHT: TELEMETRY & CLOSE */}
          <motion.div
            drag
            dragMomentum={false}
            animate={{
              x: hudPositions["top-right"]?.x || 0,
              y: hudPositions["top-right"]?.y || 0,
              scale: hudPositions["top-right"]?.scale || 1,
            }}
            onDragEnd={(e, info) => handleDragEnd("top-right", info)}
            onWheel={(e) => {
              e.stopPropagation();
              handleScaleDelta("top-right", e.deltaY > 0 ? -0.05 : 0.05);
            }}
            className="absolute top-4 sm:top-8 right-4 sm:right-8 z-30 flex items-start gap-4 cursor-move"
            style={{ transformOrigin: "top right" }}
          >
            <div className="flex flex-col items-end gap-3 font-mono">
              <div className="flex items-center gap-3 sm:gap-4 bg-black/80 border border-[#C5A059]/30 p-2 sm:p-3 sm:pr-4 rounded-none backdrop-blur-md shadow-[0_0_15px_rgba(197,160,89,0.1)] relative after:absolute after:bottom-0 after:right-0 after:w-full after:h-[1px] after:bg-gradient-to-l after:from-[#C5A059] after:to-transparent">
                <div className="text-right">
                  <div className="text-white text-2xl sm:text-3xl font-black tracking-tighter tabular-nums leading-none">
                    {unifiedCount.toLocaleString()}
                  </div>
                  <div className="text-[#C5A059] text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] mt-1">
                    {uiLang === "pl" ? "GLOBALNY WĘZEŁ" : "GLOBAL NODE"}
                  </div>
                </div>
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-[#C5A059]/20 hidden sm:block">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5A059] animate-pulse" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("GLOBAL")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all border cursor-pointer ${viewMode === "GLOBAL" ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.3)]" : "bg-black/80 text-zinc-500 border-white/10 hover:border-[#C5A059]/50"}`}
                >
                  [ GLOBAL ]
                </button>
                <button
                  onClick={() => setViewMode("POLAND")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all border cursor-pointer ${viewMode === "POLAND" ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.3)]" : "bg-black/80 text-zinc-500 border-white/10 hover:border-[#C5A059]/50"}`}
                >
                  [ PL.SEC ]
                </button>
                <button
                  onClick={resetLayout}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all border cursor-pointer bg-black/80 text-zinc-500 border-white/10 hover:border-red-500/50 hover:text-red-500`}
                  title="Rozmieść kafelki domyślnie"
                >
                  [ RESET ]
                </button>
              </div>
            </div>

            <button
              aria-label="Zamknij"
              onClick={onClose}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-black border border-red-500/50 text-red-500 flex items-center justify-center hover:bg-red-500/20 hover:text-white transition-all active:scale-90 shadow-[0_0_10px_rgba(239,68,68,0.2)] shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            {renderResizeHandle("top-right")}
          </motion.div>

          {/* HUD - EXIT / HOME RETURN TILE */}
          <motion.div
            drag
            dragMomentum={false}
            animate={{
              x: hudPositions["bottom-center"]?.x || 0,
              y: hudPositions["bottom-center"]?.y || 0,
              scale: hudPositions["bottom-center"]?.scale || 1,
            }}
            onDragEnd={(e, info) => handleDragEnd("bottom-center", info)}
            onWheel={(e) => {
              e.stopPropagation();
              handleScaleDelta("bottom-center", e.deltaY > 0 ? -0.05 : 0.05);
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 cursor-move"
            style={{ transformOrigin: "bottom center" }}
          >
            <button
              onClick={onClose}
              className="flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#C5A059] to-[#997B43] text-black font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:from-white hover:to-white transition-all active:scale-95 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
              {uiLang === "pl" ? "POWRÓT DO STRONY GŁÓWNEJ" : "RETURN TO HOME"}
            </button>
            {renderResizeHandle("bottom-center")}
          </motion.div>

          {/* HUD - BOTTOM LEFT: FEED */}
          <motion.div
            drag
            dragMomentum={false}
            animate={{
              x: hudPositions["bottom-left"]?.x || 0,
              y: hudPositions["bottom-left"]?.y || 0,
              scale: hudPositions["bottom-left"]?.scale || 1,
            }}
            onDragEnd={(e, info) => handleDragEnd("bottom-left", info)}
            onWheel={(e) => {
              e.stopPropagation();
              handleScaleDelta("bottom-left", e.deltaY > 0 ? -0.05 : 0.05);
            }}
            className="hidden sm:block absolute bottom-8 left-8 z-20 w-72 pointer-events-auto cursor-move"
            style={{ transformOrigin: "bottom left" }}
          >
            <div className="space-y-3 relative before:absolute before:left-[-12px] before:top-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[#C5A059] before:via-[#C5A059]/30 before:to-transparent pointer-events-none">
              <div className="flex items-center gap-3 mb-4 px-2 bg-black/60 w-max pr-4 py-1 border border-[#C5A059]/30">
                <Activity className="w-4 h-4 text-[#C5A059] animate-pulse" />
                <span className="text-[9px] font-mono font-black text-white uppercase tracking-widest shadow-black drop-shadow-md">
                  LIVE.DATA.STREAM
                </span>
              </div>
              <AnimatePresence mode="popLayout">
                {points.slice(0, 3).map((p, i) => (
                  <motion.div
                    key={p.timestamp + i}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="p-3 bg-black/80 border-t border-r border-b border-[#C5A059]/20 border-l-[3px] border-l-[#C5A059] flex items-center gap-3 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[#C5A059]/10 to-transparent"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-white/5 flex items-center justify-center text-lg z-10 shrink-0">
                      {p.activity === "bible"
                        ? "📖"
                        : p.activity === "radio"
                          ? "📻"
                          : "🙏"}
                    </div>
                    <div className="overflow-hidden z-10 font-mono">
                      <div className="text-[10px] font-black text-white truncate uppercase tracking-wider">
                        {p.userName}
                      </div>
                      <div className="text-[8px] text-[#C5A059] font-medium truncate uppercase tracking-widest">
                        {p.city} •{" "}
                        {p.activity === "bible"
                          ? "SŁOWO"
                          : p.activity === "radio"
                            ? "AUDIO"
                            : "MODLITWA"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {renderResizeHandle("bottom-left")}
          </motion.div>

          {/* BUTTON TO RE-OPEN CHECK-IN */}
          <motion.div
            drag
            dragMomentum={false}
            animate={{
              x: hudPositions["bottom-right"]?.x || 0,
              y: hudPositions["bottom-right"]?.y || 0,
              scale: hudPositions["bottom-right"]?.scale || 1,
            }}
            onDragEnd={(e, info) => handleDragEnd("bottom-right", info)}
            onWheel={(e) => {
              e.stopPropagation();
              handleScaleDelta("bottom-right", e.deltaY > 0 ? -0.05 : 0.05);
            }}
            className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-20 cursor-move"
            style={{ transformOrigin: "bottom right" }}
          >
            {!isCheckInVisible && (
              <button
                onClick={() => setIsCheckInVisible(true)}
                className="w-12 h-12 bg-black/50 border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center hover:bg-[#C5A059]/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(197,160,89,0.2)] backdrop-blur-md cursor-pointer"
              >
                <MapIcon className="w-5 h-5" />
              </button>
            )}
            {!isCheckInVisible && renderResizeHandle("bottom-right")}
          </motion.div>

          {/* CHECK-IN FORM (CENTERED) */}
          <AnimatePresence>
            {isCheckInVisible && (
              <motion.div
                drag
                dragMomentum={false}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: hudPositions["center-checkin"]?.scale || 1,
                  x: hudPositions["center-checkin"]?.x || 0,
                  y: hudPositions["center-checkin"]?.y || 0,
                }}
                onDragEnd={(e, info) => handleDragEnd("center-checkin", info)}
                onWheel={(e) => {
                  e.stopPropagation();
                  handleScaleDelta(
                    "center-checkin",
                    e.deltaY > 0 ? -0.05 : 0.05,
                  );
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] sm:w-[400px] cursor-move"
                style={{ transformOrigin: "center" }}
              >
                <div className="p-5 sm:p-8 bg-black/40 border border-[#C5A059]/40 shadow-[0_0_40px_rgba(197,160,89,0.15)] relative before:absolute before:top-0 before:right-0 before:w-16 before:h-[2px] before:bg-[#C5A059] before:shadow-[0_0_10px_rgba(197,160,89,0.8)] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#C5A059] after:shadow-[0_0_10px_rgba(197,160,89,0.8)] backdrop-blur-md">
                  <button
                    aria-label="Zamknij"
                    onClick={() => setIsCheckInVisible(false)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-left mb-6 border-b border-white/10 pb-4 pr-8">
                    <h3 className="text-white text-[10px] sm:text-[12px] font-mono font-black uppercase tracking-widest mb-1.5">
                      REQ.CONNECTION_NODE
                    </h3>
                    <p className="text-[#C5A059] text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] animate-pulse">
                      Establishing link...
                    </p>
                  </div>

                  <form
                    onSubmit={handleCheckIn}
                    className="space-y-5 font-mono"
                  >
                    <div className="space-y-2">
                      <label className="text-[8px] sm:text-[10px] text-[#C5A059] uppercase tracking-widest font-black">
                        LOCAL.COORD (CITY)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={checkInCity}
                          onChange={(e) => setCheckInCity(e.target.value)}
                          placeholder="Enter location..."
                          className="w-full bg-black/60 border border-zinc-800 p-3 sm:p-4 pl-8 sm:pl-10 text-[11px] sm:text-xs text-white focus:outline-none focus:border-[#C5A059]/60 font-mono uppercase tracking-widest transition-colors shadow-inner cursor-text"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#C5A059]/50 animate-ping"></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {[
                        { id: "bible", icon: "📖", label: "TXT" },
                        { id: "radio", icon: "📻", label: "AUD" },
                        { id: "prayer", icon: "🙏", label: "PRY" },
                      ].map((act) => (
                        <button
                          key={act.id}
                          type="button"
                          aria-label={`Aktywność: ${act.label}`}
                          onClick={() => setCheckInActivity(act.id as any)}
                          className={`flex-1 p-3 border transition-all flex flex-col items-center gap-1.5 relative overflow-hidden cursor-pointer ${checkInActivity === act.id ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.3)] scale-105" : "bg-black/60 border-white/10 text-zinc-500 hover:border-white/30"}`}
                        >
                          {checkInActivity === act.id && (
                            <div className="absolute top-0 w-full h-[2px] bg-[#C5A059] left-0"></div>
                          )}
                          <span
                            aria-hidden="true"
                            className="text-base sm:text-lg opacity-90"
                          >
                            {act.icon}
                          </span>
                          <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em]">
                            {act.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={!checkInCity}
                      aria-label="Inicjuj połączenie"
                      className="w-full py-4 mt-4 bg-gradient-to-r from-[#C5A059] to-[#997B43] text-black font-black text-[10px] sm:text-[11px] uppercase tracking-[0.4em] hover:from-white hover:to-white transition-all shadow-[0_0_20px_rgba(197,160,89,0.4)] active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none cursor-pointer"
                    >
                      [ INITIALIZE UPLINK ]
                    </button>
                  </form>

                  <div className="mt-6 flex items-center justify-between bg-black/60 p-3 border border-white/5">
                    <div className="text-[8px] sm:text-[9px] text-[#C5A059] font-mono tracking-widest uppercase truncate max-w-[200px]">
                      ID: {appUserEmail || "GUEST_0XF0"}
                    </div>
                    <div className="w-1.5 h-1.5 bg-[#C5A059] shadow-[0_0_8px_#C5A059] animate-pulse" />
                  </div>
                  {renderResizeHandle("center-checkin")}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* JOSHUA OVERLAY NOTIFICATION */}
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              x: hudPositions["joshua"]?.x || 0,
              y: hudPositions["joshua"]?.y || 0,
              scale: hudPositions["joshua"]?.scale || 1,
            }}
            onDragEnd={(e, info) => handleDragEnd("joshua", info)}
            onWheel={(e) => {
              e.stopPropagation();
              handleScaleDelta("joshua", e.deltaY > 0 ? -0.05 : 0.05);
            }}
            transition={{ delay: 5 }}
            className="hidden sm:block absolute top-32 left-1/2 -translate-x-1/2 z-40 w-96 font-mono cursor-move"
            style={{ transformOrigin: "top center" }}
          >
            <div className="relative p-4 bg-black/80 border border-[#C5A059]/40 backdrop-blur-xl flex items-center gap-4 shadow-[0_0_20px_rgba(197,160,89,0.15)] before:absolute before:-top-[1px] before:-left-[1px] before:w-4 before:h-4 before:border-t-2 before:border-l-2 before:border-[#C5A059] after:absolute after:-bottom-[1px] after:-right-[1px] after:w-4 after:h-4 after:border-b-2 after:border-r-2 after:border-[#C5A059]">
              <div className="w-10 h-10 bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black shadow-[inset_0_1px_10px_rgba(255,255,255,0.05),_0_0_50px_rgba(0,0,0,0.8)] border border-[#C5A059]/30 flex items-center justify-center text-xl shrink-0">
                🛡️
              </div>
              <div className="flex-1">
                <div className="text-[#C5A059] text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#C5A059] animate-pulse"></span>
                  SYS.MSG // JOZUE
                </div>
                <div className="text-white text-[10px] font-medium leading-relaxed tracking-wide">
                  „Wojowniku Chrystusa!, w tej chwili w Twoim regionie 500 osób
                  czyta Ewangelię św. Jana. Dołącz do nich?”
                </div>
              </div>
              <button
                aria-label="Zamknij wiadomość"
                className="text-zinc-500 hover:text-[#C5A059] transition-colors cursor-pointer"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
              {renderResizeHandle("joshua")}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
