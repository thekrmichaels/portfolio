import { useEffect, useState } from "react";

function useLightMode() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    setIsLightMode(mediaQuery.matches);

    const handleChange = (e: { matches: boolean }) => setIsLightMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isLightMode;
}

export default useLightMode;
