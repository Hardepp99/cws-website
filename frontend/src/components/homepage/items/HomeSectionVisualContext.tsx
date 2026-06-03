"use client";

import { createContext, useContext, type ReactNode } from "react";

type Ctx = {
  acfLayout: string;
  sectionIndex: number;
};

const HomeSectionVisualContext = createContext<Ctx>({ acfLayout: "default", sectionIndex: 0 });

export function HomeSectionVisualProvider({
  acfLayout,
  sectionIndex,
  children,
}: Ctx & { children: ReactNode }) {
  return (
    <HomeSectionVisualContext.Provider value={{ acfLayout, sectionIndex }}>
      {children}
    </HomeSectionVisualContext.Provider>
  );
}

export function useHomeSectionVisual(): Ctx {
  return useContext(HomeSectionVisualContext);
}
