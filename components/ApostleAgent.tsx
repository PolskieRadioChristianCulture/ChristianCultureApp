import React, { useEffect, useRef } from "react";
import { apostleService } from "../services/apostleService";
import { geminiService } from "../services/geminiService";
import { auth } from "../firebase";
import { UserPersona } from "../types";

interface ApostleAgentProps {
  user: UserPersona | null;
  isAdmin: boolean;
}

/**
 * Apostoł Cyfrowy (Apostle Agent)
 * Proactive background agent that monitors UI, manages tasks, and generates reports.
 */
export const ApostleAgent: React.FC<ApostleAgentProps> = ({
  user,
  isAdmin,
}) => {
  const lastTaskCheck = useRef<number>(0);
  const checkInterval = 60000; // Check every 1 minute
  const strategicCheckInterval = 3600000; // 1 hour for AI strategy cycles

  useEffect(() => {
    // 1. UI Monitoring - Error Listener
    const handleError = (event: ErrorEvent) => {
      // Zapobiegaj pętli nieskończonej - ignoruj błędy uprawnień Firestore w logerze!
      const errorMsg = event.message || "";
      if (
        errorMsg.includes("Missing or insufficient permissions") ||
        errorMsg.includes("permission_denied")
      ) {
        return;
      }

      apostleService.logAction({
        action: "Błąd Systemowy",
        details: `Wykryto błąd: ${errorMsg} w ${event.filename}:${event.lineno}`,
        level: "error",
      });

      apostleService.reportUXIssue({
        issue: errorMsg,
        context: `Linia: ${event.lineno}, Plik: ${event.filename}`,
        severity: "high",
        status: "new",
        detectedAt: new Date().toISOString(),
      });
    };

    window.addEventListener("error", handleError);

    // 2. Responsiveness Monitor
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 320) {
        apostleService.reportUXIssue({
          issue: "Ekstremalnie wąski ekran",
          context: `Szerokość: ${width}px`,
          severity: "medium",
          status: "new",
          detectedAt: new Date().toISOString(),
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // 3. Proactive Task Runner & Strategic Brain
    const runAgentCycle = async () => {
      if (!isAdmin) return;

      // Strict Firebase backend admin validation
      if (
        !auth.currentUser ||
        (auth.currentUser.uid !== "u5SeqT54FcNokFcXjiRcKowjHqC2" &&
          auth.currentUser.uid !== "J4AQs5wSpaWsSjtj04JLqCHPIeg1" &&
          !(
            auth.currentUser.email === "nazirczarkes@gmail.com" &&
            auth.currentUser.emailVerified
          ))
      ) {
        return;
      }

      const now = Date.now();
      if (now - lastTaskCheck.current < checkInterval) return;
      lastTaskCheck.current = now;

      console.log("[Apostle Agent] Powering cycle...");

      // Heartbeat
      try {
        await apostleService.updateConfig({
          isEnabled: true,
          lastActive: new Date().toISOString(),
        });
      } catch (e) {
        // Silently fail rather than throwing global errors
        console.warn("Could not update config heartbeat");
      }

      // AI Strategic Analysis - if it's been a while
      try {
        const report = await apostleService.getLatestReport();
        const lastReportDate = report
          ? new Date(report.timestamp).getTime()
          : 0;

        if (now - lastReportDate > strategicCheckInterval) {
          console.log(
            "[Apostle Agent] Triggering Gemini Strategic Analysis...",
          );
          await geminiService.runStrategicAnalysis();
        }
      } catch (e) {
        console.warn("Could not run strategic analysis", e);
      }
    };

    const interval = setInterval(runAgentCycle, 10000); // Check conditions every 10s
    runAgentCycle();

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, [isAdmin, user]);

  return null;
};
