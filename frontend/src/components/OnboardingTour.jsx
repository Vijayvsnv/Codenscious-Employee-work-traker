import { useState, useEffect } from "react";
import { Joyride, STATUS } from "react-joyride";
import { useTheme } from "../context/ThemeContext";

const STORAGE_KEY_PREFIX = "workpulse:tour:";

export function OnboardingTour({ tourKey, steps, run: forceRun }) {
  const { theme } = useTheme();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (forceRun !== undefined) {
      setRun(forceRun);
      return;
    }
    const done = localStorage.getItem(STORAGE_KEY_PREFIX + tourKey);
    if (!done) {
      // Small delay so target elements are painted
      const timer = setTimeout(() => setRun(true), 500);
      return () => clearTimeout(timer);
    }
  }, [tourKey, forceRun]);

  const handleCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem(STORAGE_KEY_PREFIX + tourKey, "done");
      setRun(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      disableScrolling={false}
      scrollOffset={80}
      callback={handleCallback}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip",
      }}
      styles={{
        options: {
          primaryColor: "#0ec6a4",
          backgroundColor: isDark ? "#161618" : "#ffffff",
          textColor: isDark ? "#fafafa" : "#0a0a0a",
          arrowColor: isDark ? "#161618" : "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
          fontSize: 14,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        },
        tooltipTitle: {
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 6,
        },
        tooltipContent: {
          padding: 0,
          lineHeight: 1.6,
          color: isDark ? "#a4a4b2" : "#525252",
        },
        buttonNext: {
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 500,
          backgroundColor: "#0ec6a4",
        },
        buttonBack: {
          color: isDark ? "#a4a4b2" : "#525252",
          fontSize: 13,
          fontWeight: 500,
          marginRight: 6,
        },
        buttonSkip: {
          color: isDark ? "#a4a4b2" : "#737373",
          fontSize: 12,
        },
        buttonClose: {
          color: isDark ? "#a4a4b2" : "#737373",
        },
      }}
    />
  );
}

export function resetTour(tourKey) {
  localStorage.removeItem(STORAGE_KEY_PREFIX + tourKey);
}
