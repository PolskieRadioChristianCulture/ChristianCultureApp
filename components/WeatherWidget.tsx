import React, { useState, useEffect } from "react";

interface WeatherWidgetProps {
  language?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  language = "PL",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const id = "tomorrow-sdk";
    if (document.getElementById(id)) {
      if (
        window.__tomorrow &&
        typeof window.__tomorrow.renderWidget === "function"
      ) {
        window.__tomorrow.renderWidget();
      }
      return;
    }

    const fjs = document.getElementsByTagName("script")[0];
    const js = document.createElement("script") as HTMLScriptElement;
    js.id = id;
    js.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";

    if (fjs && fjs.parentNode) {
      fjs.parentNode.insertBefore(js, fjs);
    } else {
      document.head.appendChild(js);
    }
  }, [language]);

  return (
    <div className="mt-6 rounded-[2rem] border border-white/5 bg-black/20 animate-fade-in p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
          Pogoda
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[9px] uppercase tracking-widest font-bold text-[#C5A059] hover:text-white transition-colors"
        >
          {isExpanded ? "Zwiń" : "Rozwiń"}
        </button>
      </div>
      <div
        className={`tomorrow flex justify-center transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[500px]" : "max-h-[270px]"} overflow-hidden`}
        data-widget-type="upcoming"
        data-location-id=""
        data-language={language.toUpperCase()}
        data-unit-system="METRIC"
        data-skin="dark"
        data-widget-id="weather-widget"
        style={{ position: "relative" }}
      ></div>
    </div>
  );
};

declare global {
  interface Window {
    __tomorrow?: {
      renderWidget: () => void;
    };
  }
}
