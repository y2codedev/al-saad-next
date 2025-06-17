"use client";

import { useEffect } from "react";

export const useDirection = () => {
  useEffect(() => {
    const direction = isRTL ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", direction);
  }, [isRTL]);
};
