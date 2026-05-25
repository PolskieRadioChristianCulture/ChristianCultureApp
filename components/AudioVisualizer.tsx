import React, { useEffect, useRef } from "react";
import { SpatialMode, EqualizerSettings } from "../types";

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  visualizerEnabled?: boolean;
  spatialMode?: SpatialMode;
  equalizer?: EqualizerSettings;
  isFullScreen?: boolean;
}

// Global registry to prevent multiple MediaElementSourceNode creation for the same element
const audioSourceRegistry = new WeakMap<
  HTMLAudioElement,
  MediaElementAudioSourceNode
>();

// Global AudioContext to prevent "different audio context" errors
let globalAudioContext: AudioContext | null = null;

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioRef,
  isPlaying,
  visualizerEnabled = true,
  spatialMode = "none",
  equalizer,
  isFullScreen = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const convolverRef = useRef<ConvolverNode | null>(null);
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const currentSpatialModeRef = useRef<SpatialMode>("none");
  const eqFiltersRef = useRef<
    { [key in keyof EqualizerSettings]: BiquadFilterNode } | null
  >(null);

  const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/cc_logo_transparent.png";
    img.onload = () => {
      logoRef.current = img;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const initAudio = async () => {
      // Only initialize if we need it (visualizer or spatial mode)
      if (!visualizerEnabled && spatialMode === "none" && !contextRef.current) {
        return;
      }

      try {
        const audio = audioRef.current;
        if (!audio) return;

        // 1. Initialize Context and basic nodes if not exists
        if (!contextRef.current) {
          if (!globalAudioContext) {
            const AudioContextClass =
              window.AudioContext || (window as any).webkitAudioContext;
            globalAudioContext = new AudioContextClass();
          }
          const ctx = globalAudioContext;
          contextRef.current = ctx;

          // EQ Filters (Series)
          const createFilter = (freq: number) => {
            const f = ctx.createBiquadFilter();
            f.type = "peaking";
            f.frequency.value = freq;
            f.Q.value = 1;
            f.gain.value = 0;
            return f;
          };

          const f1 = createFilter(60);
          const f2 = createFilter(250);
          const f3 = createFilter(1000);
          const f4 = createFilter(4000);
          const f5 = createFilter(12000);

          eqFiltersRef.current = {
            low: f1,
            midLow: f2,
            mid: f3,
            midHigh: f4,
            high: f5,
          };

          // Spatial Nodes (Parallel path inside the chain)
          const dryGain = ctx.createGain();
          const wetGain = ctx.createGain();
          const convolver = ctx.createConvolver();
          const masterGain = ctx.createGain();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;

          dryGainRef.current = dryGain;
          wetGainRef.current = wetGain;
          convolverRef.current = convolver;
          masterGainRef.current = masterGain;
          analyserRef.current = analyser;

          // Initial "Bypass" Buffer for Convolver (1-sample impulse)
          const sampleRate = ctx.sampleRate;
          const impulse = ctx.createBuffer(2, 1, sampleRate);
          impulse.getChannelData(0)[0] = 1;
          impulse.getChannelData(1)[0] = 1;
          convolver.buffer = impulse;

          // STATIC CONNECTIONS (Never disconnected)
          // source -> f1 -> f2 -> f3 -> f4 -> f5 -> [dryGain, convolver]
          // dryGain -> masterGain
          // convolver -> wetGain -> masterGain
          // masterGain -> analyser -> destination

          f1.connect(f2);
          f2.connect(f3);
          f3.connect(f4);
          f4.connect(f5);

          f5.connect(dryGain);
          f5.connect(convolver);

          convolver.connect(wetGain);

          dryGain.connect(masterGain);
          wetGain.connect(masterGain);

          masterGain.connect(analyser);
          analyser.connect(ctx.destination);
        }

        const ctx = contextRef.current;
        const now = ctx.currentTime;

        // 2. Update EQ Gains (Directly for zero delay)
        if (eqFiltersRef.current && equalizer) {
          eqFiltersRef.current.low.gain.value = equalizer.low;
          eqFiltersRef.current.midLow.gain.value = equalizer.midLow;
          eqFiltersRef.current.mid.gain.value = equalizer.mid;
          eqFiltersRef.current.midHigh.gain.value = equalizer.midHigh;
          eqFiltersRef.current.high.gain.value = equalizer.high;
        }

        // 3. Initialize Source if not exists or element changed
        if (
          !sourceRef.current ||
          (sourceRef.current as any)._element !== audio
        ) {
          if (audioSourceRegistry.has(audio)) {
            sourceRef.current = audioSourceRegistry.get(audio)!;
          } else {
            sourceRef.current = ctx.createMediaElementSource(audio);
            audioSourceRegistry.set(audio, sourceRef.current);
          }
          (sourceRef.current as any)._element = audio;

          // Ensure we disconnect from previous nodes if any (though registry should handle it)
          try {
            sourceRef.current.disconnect();
          } catch (e) {}
          sourceRef.current.connect(eqFiltersRef.current!.low);
        }

        // 4. Handle Spatial Mode (Update Buffer & Gains only)
        if (spatialMode !== currentSpatialModeRef.current) {
          const sampleRate = ctx.sampleRate;
          let duration = 0.1;
          let decay = 1.0;
          let dryLevel = 1.0;
          let wetLevel = 0.0;

          if (spatialMode === "room") {
            duration = 0.5;
            decay = 1.5;
            dryLevel = 0.85;
            wetLevel = 0.4;
          } else if (spatialMode === "studio") {
            duration = 0.2;
            decay = 0.8;
            dryLevel = 0.95;
            wetLevel = 0.2;
          } else if (spatialMode === "cathedral") {
            duration = 4.5;
            decay = 3.5;
            dryLevel = 0.4;
            wetLevel = 1.0;
          } else if (spatialMode === "chapel") {
            duration = 2.0;
            decay = 2.5;
            dryLevel = 0.6;
            wetLevel = 0.7;
          } else if (spatialMode === "concert") {
            duration = 2.5;
            decay = 2.0;
            dryLevel = 0.7;
            wetLevel = 0.7;
          }

          // Generate new impulse response
          const length = Math.floor(sampleRate * duration);
          const impulse = ctx.createBuffer(2, length, sampleRate);
          for (let i = 0; i < 2; i++) {
            const channel = impulse.getChannelData(i);
            for (let j = 0; j < length; j++) {
              channel[j] =
                (Math.random() * 2 - 1) * Math.pow(1 - j / length, decay);
            }
          }
          convolverRef.current!.buffer = impulse;

          dryGainRef.current!.gain.setTargetAtTime(dryLevel, now, 0.1);
          wetGainRef.current!.gain.setTargetAtTime(wetLevel, now, 0.1);

          currentSpatialModeRef.current = spatialMode;
        } else if (spatialMode === "none") {
          dryGainRef.current!.gain.setTargetAtTime(1.0, now, 0.1);
          wetGainRef.current!.gain.setTargetAtTime(0.0, now, 0.1);
        }

        if (isPlaying && ctx.state === "suspended") {
          await ctx.resume();
        }

        // Add a one-time click listener to resume context if it's still suspended
        const resumeOnInteraction = () => {
          if (ctx.state === "suspended") {
            ctx.resume();
          }
          window.removeEventListener("click", resumeOnInteraction);
          window.removeEventListener("touchstart", resumeOnInteraction);
        };
        window.addEventListener("click", resumeOnInteraction);
        window.addEventListener("touchstart", resumeOnInteraction);
      } catch (err) {
        console.error("[Visualizer] Audio init error:", err);
      }
    };

    initAudio();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const fallbackDataArray = new Uint8Array(256);
    const analyserDataArrayRef = { current: null as Uint8Array | null };

    const draw = () => {
      if (!isPlaying) return;
      animationRef.current = requestAnimationFrame(draw);

      let dataArray: Uint8Array;
      let bufferLength: number;

      if (analyserRef.current && visualizerEnabled) {
        if (
          !analyserDataArrayRef.current ||
          analyserDataArrayRef.current.length !==
            analyserRef.current.frequencyBinCount
        ) {
          analyserDataArrayRef.current = new Uint8Array(
            analyserRef.current.frequencyBinCount,
          );
        }
        dataArray = analyserDataArrayRef.current;
        bufferLength = analyserRef.current.frequencyBinCount;
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Fake visualizer fallback when CORS/AudioContext is not available yet
        bufferLength = 128;
        dataArray = fallbackDataArray;
        const time = Date.now() / 1000;
        for (let i = 0; i < bufferLength; i++) {
          const fakeValue =
            Math.sin(time * 2 + i * 0.1) * 30 +
            Math.sin(time * 5 - i * 0.2) * 20 +
            50;
          dataArray[i] = Math.max(
            0,
            Math.min(255, fakeValue + Math.random() * 20),
          );
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;

      // Draw sophisticated circular visualizer
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(226, 184, 89, 0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Christian Culture Logo in center
      if (logoRef.current) {
        ctx.save();
        ctx.shadowBlur = 0;

        let bass = 0;
        const bassCount = Math.floor(bufferLength * 0.1); // lower 10%
        for (let i = 0; i < bassCount; i++) bass += dataArray[i];
        bass /= bassCount || 1;

        const scale = 1 + (bass / 255) * 0.15;
        const logoSize = radius * 1.5 * scale;

        ctx.globalAlpha = 0.6; // Półprzeźroczyste
        ctx.drawImage(
          logoRef.current,
          centerX - logoSize / 2,
          centerY - logoSize / 2,
          logoSize,
          logoSize,
        );
        ctx.restore();
      }

      const bars = Math.floor(bufferLength * 0.75); // Use first 75% for better visual distribution

      const drawBar = (angle: number, height: number, value: number) => {
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + height);
        const y2 = centerY + Math.sin(angle) * (radius + height);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "rgba(226, 184, 89, 0.8)");
        gradient.addColorStop(1, "rgba(239, 68, 68, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        if (value > 200) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(226, 184, 89, 0.5)";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      for (let i = 0; i < bars; i++) {
        const barHeight = (dataArray[i] / 255) * radius * 0.8;

        // Full circle, mirrored. We use (bars - 1) so that the last element exactly hits the bottom line
        const fraction = bars > 1 ? i / (bars - 1) : 0;
        const angle1 = fraction * Math.PI - Math.PI / 2;
        const angle2 = -fraction * Math.PI - Math.PI / 2;

        drawBar(angle1, barHeight, dataArray[i]);
        if (i !== 0 && i !== bars - 1) {
          // avoid drawing twice at top (i=0) and bottom (i=bars-1)
          drawBar(angle2, barHeight, dataArray[i]);
        }
      }
      ctx.shadowBlur = 0;
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, audioRef, visualizerEnabled, spatialMode, equalizer]);

  // Clean up nodes but KEEP global AudioContext alive to prevent mismatch on remount
  useEffect(() => {
    return () => {
      if (contextRef.current) {
        // We don't close the global context, just disconnect our local node references
        try {
          sourceRef.current?.disconnect();
        } catch (e) {}
        analyserRef.current = null;
        sourceRef.current = null;
        convolverRef.current = null;
        dryGainRef.current = null;
        wetGainRef.current = null;
        masterGainRef.current = null;
        eqFiltersRef.current = null;
        contextRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none transition-all duration-700 ${isFullScreen ? "bg-black opacity-100 z-[9500]" : "opacity-0 z-0"}`}
      style={{ filter: isFullScreen ? "blur(0px)" : "blur(10px)" }}
    />
  );
};
