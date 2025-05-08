"use client";

import { useEffect, useState } from "react";
import "../i18n/i18n"; // Import the i18n configuration

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // Gunakan state untuk menandai bahwa komponen telah di-mount di client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Tandai bahwa komponen telah di-mount di client
    setIsMounted(true);
  }, []);

  // Jika komponen belum di-mount, render placeholder minimal
  // untuk menghindari perbedaan antara server dan client
  if (!isMounted) {
    return <>{children}</>;
  }

  // Setelah di-mount di client, render children dengan i18n yang sudah diinisialisasi
  return <>{children}</>;
}
