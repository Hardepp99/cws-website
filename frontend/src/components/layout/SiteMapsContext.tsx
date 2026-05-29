"use client";

import { createContext, useContext } from "react";
import { CWS_GMB_MAPS_URL } from "@/lib/gmb/defaults";

const SiteMapsContext = createContext(CWS_GMB_MAPS_URL);

export function SiteMapsProvider({
  mapsUrl,
  children,
}: {
  mapsUrl: string;
  children: React.ReactNode;
}) {
  return <SiteMapsContext.Provider value={mapsUrl || CWS_GMB_MAPS_URL}>{children}</SiteMapsContext.Provider>;
}

export function useGmbMapsUrl(): string {
  return useContext(SiteMapsContext);
}
