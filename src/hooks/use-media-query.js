// src/hooks/useMediaQuery.js
import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event) {
      setValue(event.matches);
    }

    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener("change", onChange);
    setValue(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener("change", onChange);
    };
  }, [query]);

  return value;
}
