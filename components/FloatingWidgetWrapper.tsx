import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { X, RefreshCw } from "lucide-react";
import { useWidgetSync, WidgetId } from "../hooks/useWidgetSync";

interface Props {
  id: WidgetId;
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number | string;
  defaultHeight?: number | string;
  transparent?: boolean;
  isStatic?: boolean;
  lockHorizontal?: boolean;
  closable?: boolean;
  children: React.ReactNode;
}

export const FloatingWidgetWrapper: React.FC<Props> = ({
  id,
  defaultX = 40,
  defaultY = 140,
  defaultWidth = 320,
  defaultHeight = "auto",
  transparent = false,
  isStatic = false,
  lockHorizontal = false,
  closable = true,
  children,
}) => {
  const VIEWPORT_MARGIN = 20;

  const {
    position,
    size,
    onDragStop: syncOnDragStop,
    onResizeStop: syncOnResizeStop,
  } = useWidgetSync(
    id,
    { x: defaultX, y: defaultY },
    { width: defaultWidth, height: defaultHeight },
  );

  const [localSize, setLocalSize] = useState<{
    width: number | string;
    height: number | string;
  } | null>(null);
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [startSize, setStartSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && id === "daily_verse") {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setTouchStartDist(dist);

      const el = e.currentTarget as HTMLElement;
      setStartSize({ width: el.offsetWidth, height: el.offsetHeight });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (
      e.touches.length === 2 &&
      touchStartDist !== null &&
      startSize !== null &&
      id === "daily_verse"
    ) {
      e.stopPropagation();
      // Calculate pinch ratio
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const ratio = dist / touchStartDist;

      const newWidth = Math.max(
        280,
        Math.min(window.innerWidth - 40, startSize.width * ratio),
      );
      setLocalSize({ width: newWidth, height: "auto" });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartDist !== null) {
      setTouchStartDist(null);
      if (localSize) {
        // Trigger resize stop artificially to save the size
        syncOnResizeStop(
          e,
          "bottomRight",
          {
            style: {
              width:
                typeof localSize.width === "number"
                  ? `${localSize.width}px`
                  : localSize.width,
              height: "auto",
            },
          } as any,
          {},
          { x: position?.x || 0, y: position?.y || 0 },
        );
      }
    }
  };

  const [parentWidth, setParentWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  const measurerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: ResizeObserver | null = null;
    if (measurerRef.current && measurerRef.current.parentElement) {
      const parent = measurerRef.current.parentElement;
      observer = new ResizeObserver(() => {
        if (measurerRef.current && measurerRef.current.parentElement) {
          setParentWidth(
            measurerRef.current.parentElement.getBoundingClientRect().width,
          );
        }
      });
      observer.observe(parent);
      setParentWidth(parent.getBoundingClientRect().width);
    } else {
      const handleResize = () => setParentWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  const currentSize = localSize || size;

  const getCenteredX = () => {
    let widthPx = 320;
    const cw = currentSize.width;
    if (typeof cw === "number") {
      widthPx = cw;
    } else if (typeof cw === "string") {
      if (cw.endsWith("%")) {
        widthPx = (parseFloat(cw) / 100) * parentWidth;
      } else if (cw.endsWith("px")) {
        widthPx = parseFloat(cw);
      } else {
        widthPx = parseFloat(cw) || 320;
      }
    }
    return Math.max(0, (parentWidth - widthPx) / 2);
  };

  const finalX = lockHorizontal ? getCenteredX() : position?.x || defaultX;

  const [isForcedVisible, setIsForcedVisible] = useState(() => {
    const val = localStorage.getItem(`cc_widget_${id}_visible`);
    if (val === null) {
      // Default to true ONLY for daily_verse and radio_player.
      // Other widgets will be hidden by default.
      return (
        id === "daily_verse" ||
        id === "radio_player" ||
        id === "top_header" ||
        id === "search_bar"
      );
    }
    return val === "true";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const val = localStorage.getItem(`cc_widget_${id}_visible`);
      if (val === null) {
        setIsForcedVisible(
          id === "daily_verse" ||
            id === "radio_player" ||
            id === "top_header" ||
            id === "search_bar",
        );
      } else {
        setIsForcedVisible(val === "true");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cc_widgets_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cc_widgets_updated", handleStorageChange);
    };
  }, [id]);

  if (!isForcedVisible || !position) return null;

  const closeWidget = () => {
    localStorage.setItem(`cc_widget_${id}_visible`, "false");
    setIsForcedVisible(false);
    window.dispatchEvent(new Event("cc_widgets_updated"));
  };

  const handleDragStop = (e: any, d: any) => {
    let newX = d.x;
    let newY = d.y;

    let minTop = VIEWPORT_MARGIN + 64;
    let maxBottom = window.innerHeight - 90;

    const tickerEl = document.getElementById("top-news-ticker");
    if (tickerEl) {
      minTop = tickerEl.getBoundingClientRect().bottom;
    }

    if (id === "daily_verse") {
      const searchContainer = document.getElementById(
        "global-search-container",
      );
      const radioPlayer = document.getElementById("cc-widget-radio_player");

      if (searchContainer) {
        minTop = searchContainer.getBoundingClientRect().bottom + 10;
      }
      if (radioPlayer) {
        maxBottom = radioPlayer.getBoundingClientRect().top - 10;
      }
    }

    const widgetEl = document.getElementById(`cc-widget-${id}`);
    const widgetHeight = widgetEl
      ? widgetEl.getBoundingClientRect().height
      : 200;

    if (newX < VIEWPORT_MARGIN) newX = VIEWPORT_MARGIN;
    if (newY < minTop) newY = minTop;

    if (newY + widgetHeight > maxBottom) {
      newY = Math.max(minTop, maxBottom - widgetHeight);
    }

    syncOnDragStop(e, { ...d, x: newX, y: newY });
  };

  if (isStatic) {
    return (
      <div
        className={`w-full max-w-2xl mx-auto rounded-2xl flex flex-col group relative pointer-events-auto z-[50] ${transparent ? "bg-transparent overflow-visible" : "bg-zinc-950/90 backdrop-blur-xl border-2 border-[#C5A059]/30 shadow-[0_0_30px_rgba(197,160,89,0.15)] overflow-hidden"}`}
      >
        <div
          className={`w-full h-full relative z-10 pointer-events-auto ${transparent ? "bg-transparent overflow-visible" : "overflow-y-auto scrollbar-thin scrollbar-thumb-[#C5A059]/20 bg-black/40"}`}
        >
          {children}
        </div>
      </div>
    );
  }

  let safeY = position?.y || defaultY;
  if (typeof window !== "undefined") {
    let minTop = VIEWPORT_MARGIN + 64;
    let maxBottom = window.innerHeight - 90;

    const tickerEl = document.getElementById("top-news-ticker");
    if (tickerEl) {
      minTop = tickerEl.getBoundingClientRect().bottom;
    }

    if (id === "daily_verse") {
      const searchContainer = document.getElementById(
        "global-search-container",
      );
      const radioPlayer = document.getElementById("cc-widget-radio_player");

      if (searchContainer) {
        minTop = searchContainer.getBoundingClientRect().bottom + 10;
      }
      if (radioPlayer) {
        maxBottom = radioPlayer.getBoundingClientRect().top - 10;
      }
    }

    // Evaluate widget bounding rect assuming it persists accurately across renders
    const widgetEl = document.getElementById(`cc-widget-${id}`);
    const widgetHeight = widgetEl
      ? widgetEl.getBoundingClientRect().height
      : 100;

    if (safeY + widgetHeight > maxBottom) {
      safeY = Math.max(minTop, maxBottom - widgetHeight);
    }
    if (safeY < minTop) {
      safeY = minTop;
    }
  }

  return (
    <>
      <div ref={measurerRef} className="hidden" aria-hidden="true" />
      <Rnd
        size={{
          width: currentSize.width,
          height: currentSize.height === "auto" ? "auto" : currentSize.height,
        }}
        position={{ x: finalX, y: safeY }}
        dragAxis={lockHorizontal ? "y" : "both"}
        onDragStop={handleDragStop}
        onResizeStop={(e, dir, ref, delta, pos) => {
          setLocalSize(null);
          syncOnResizeStop(e, dir, ref, delta, pos);
        }}
        minWidth={280}
        minHeight={200}
        bounds="parent"
        dragHandleClassName="drag-handle"
        className={`absolute left-0 top-0 z-[50] ${transparent ? "drop-shadow-2xl" : "drop-shadow-2xl"}`}
      >
        <div
          id={`cc-widget-${id}`}
          className={`w-full h-full rounded-2xl flex flex-col group relative pointer-events-auto ${transparent ? "bg-transparent overflow-visible" : "bg-zinc-950/90 backdrop-blur-xl border-2 border-[#C5A059]/30 shadow-[0_0_30px_rgba(197,160,89,0.15)] overflow-hidden"}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-8 flex items-center justify-center cursor-move drag-handle transition-all z-[100] ${transparent ? "opacity-0" : "bg-zinc-900 border-b border-[#C5A059]/20 hover:bg-zinc-800"}`}
          >
            {closable && (
              <button
                aria-label="Zamknij"
                onClick={closeWidget}
                className="absolute right-2 text-zinc-300 hover:text-white hover:bg-red-500/80 rounded-full p-1 transition-all drag-cancel z-[110]"
                onTouchStart={(e) => {
                  e.stopPropagation();
                  closeWidget();
                }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div
            className={`flex-1 w-full relative z-10 pointer-events-auto ${transparent ? "h-full bg-transparent overflow-visible" : "h-[calc(100%-32px)] mt-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#C5A059]/20 bg-black/40"}`}
          >
            {children}
          </div>
        </div>
      </Rnd>
    </>
  );
};
