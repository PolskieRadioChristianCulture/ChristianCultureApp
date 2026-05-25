import React, { useEffect, useRef, useState } from "react";

// Globe component enhanced for NASA-style aesthetics
export const GlobeModal = ({ onClose }: { onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [totalListeners, setTotalListeners] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let rotation = 0;

    // Starfield
    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      alpha: Math.random(),
    }));

    // Mock Stations with simulated real-time data
    const stations = [
      { name: "Warszawa", lat: 52.2, lon: 21.0, baseListeners: 1200 },
      { name: "Londyn", lat: 51.5, lon: -0.1, baseListeners: 850 },
      { name: "Nowy Jork", lat: 40.7, lon: -74.0, baseListeners: 420 },
      { name: "Chicago", lat: 41.8, lon: -87.6, baseListeners: 310 },
      { name: "Sydney", lat: -33.8, lon: 151.2, baseListeners: 180 },
      { name: "Kraków", lat: 50.0, lon: 19.9, baseListeners: 640 },
      { name: "Berlin", lat: 52.5, lon: 13.4, baseListeners: 220 },
      { name: "Paryż", lat: 48.8, lon: 2.3, baseListeners: 150 },
      { name: "Oslo", lat: 59.9, lon: 10.7, baseListeners: 90 },
      { name: "Rzym", lat: 41.9, lon: 12.4, baseListeners: 110 },
    ].map((s) => ({ ...s, currentListeners: s.baseListeners }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Starfield
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha += (Math.random() - 0.5) * 0.1;
        if (star.alpha > 1) star.alpha = 1;
        if (star.alpha < 0) star.alpha = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const centerX = width / 2;
      const centerY = height / 2 + 20;
      const radius = Math.min(width, height) * 0.35;

      // 1. Atmosphere Glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius - 20,
        centerX,
        centerY,
        radius + 60,
      );
      gradient.addColorStop(0, "rgba(197, 160, 89, 0.2)");
      gradient.addColorStop(0.5, "rgba(197, 160, 89, 0.05)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 60, 0, Math.PI * 2);
      ctx.fill();

      // 2. Globe Sphere (Dark)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#030303";
      ctx.fill();
      ctx.strokeStyle = "#221c10";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Grid Lines (Lat/Lon)
      ctx.strokeStyle = "rgba(197, 160, 89, 0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          radius,
          radius * Math.cos((i * Math.PI) / 12),
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }

      // 4. Rotation effect
      rotation += 0.002; // Slower, more majestic rotation

      let currentTotal = 0;

      // 5. Stations
      stations.forEach((s) => {
        // Simulate minor fluctuations in listeners
        if (Math.random() > 0.95) {
          s.currentListeners += Math.floor((Math.random() - 0.5) * 5);
          if (s.currentListeners < s.baseListeners * 0.8)
            s.currentListeners = Math.floor(s.baseListeners * 0.8);
        }
        currentTotal += s.currentListeners;

        const lonRad = (s.lon * Math.PI) / 180 + rotation;
        const latRad = (s.lat * Math.PI) / 180;

        const x = centerX + radius * Math.cos(latRad) * Math.sin(lonRad);
        const y = centerY - radius * Math.sin(latRad);
        const z = Math.cos(latRad) * Math.cos(lonRad);

        // Only draw if on front side
        if (z > 0) {
          const intensity = Math.min(1, s.currentListeners / 1000);
          const pulse = (Math.sin(Date.now() * 0.003 + s.lat) + 1) / 2;

          // Halo Rings
          ctx.beginPath();
          ctx.arc(x, y, 4 + pulse * 12 * intensity, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(197, 160, 89, ${0.2 * pulse})`;
          ctx.fill();

          // Core Point
          ctx.beginPath();
          ctx.arc(x, y, 2 + intensity * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + pulse * 0.2})`;
          ctx.fill();

          // Shadow for text
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.font = "10px Inter, sans-serif";
          const text = `${s.name} ${s.currentListeners}`;
          const metrics = ctx.measureText(text);
          ctx.fillRect(x + 8, y - 10, metrics.width + 4, 14);

          // Label
          ctx.fillStyle = "#E2B859";
          ctx.fillText(text, x + 10, y + 1);
        }
      });

      setTotalListeners(currentTotal);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[7000] bg-black flex flex-col items-center justify-center animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-[#C5A059] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] z-50 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10"
      >
        WYJDŹ ✕
      </button>
      <div className="absolute top-12 text-center z-50 pointer-events-none">
        <h1 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">
          Live Global<span className="text-[#C5A059]">.</span>
        </h1>
        <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 border border-[#C5A059]/30 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <p className="text-[#C5A059] text-[9px] font-bold uppercase tracking-[0.2em]">
            Live Listeners: {totalListeners.toLocaleString()}
          </p>
        </div>
      </div>
      <canvas ref={canvasRef} className="z-10 w-full h-full" />

      <div className="absolute bottom-12 text-center z-50 pointer-events-none">
        <p className="text-zinc-600 text-[8px] font-mono tracking-[0.3em] uppercase">
          Christian Culture Telemetry • SECURE CONNECTION
        </p>
      </div>
    </div>
  );
};
