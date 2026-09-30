"use client";

import { createContext, useContext, useState } from "react";
import { useReducedMotion } from "motion/react";

type IntroState = { ready: boolean; setReady: (ready: boolean) => void };

const IntroContext = createContext<IntroState>({ ready: true, setReady: () => {} });

/* `ready` flips once the loader finishes; intro animations wait for it */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setReady] = useState(false);
  const reduce = useReducedMotion();
  // With reduced motion there's no loader, so everything is ready straight away
  const ready = loaded || reduce === true;
  return <IntroContext value={{ ready, setReady }}>{children}</IntroContext>;
}

export const useIntro = () => useContext(IntroContext);
export const useIntroReady = () => useContext(IntroContext).ready;
