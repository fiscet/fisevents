import { useCallback, useEffect, useState } from "react";
import defaultTheme from 'tailwindcss/defaultTheme';

const getBreakpointValue = (value: keyof typeof defaultTheme.screens): number => {
  const screen = defaultTheme.screens[value];
  return parseInt(typeof screen === 'string' ? screen : '0', 10);
};

const getCurrentBreakpoint = (): keyof typeof defaultTheme.screens => {
  const breakpoints = Object.keys(defaultTheme.screens);
  let currentBreakpoint: keyof typeof defaultTheme.screens = 'sm';
  let biggestBreakpointValue = 0;

  for (let i = 0; i < breakpoints.length; i++) {
    const breakpoint = breakpoints[i] as keyof typeof defaultTheme.screens;
    const breakpointValue = getBreakpointValue(breakpoint);

    if (breakpointValue > biggestBreakpointValue && window.innerWidth >= breakpointValue) {
      biggestBreakpointValue = breakpointValue;
      currentBreakpoint = breakpoint;
    }
  }

  return currentBreakpoint;
};

export const useMemoizedBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('sm');

  const handleResize = useCallback(() => {
    const newBreakpoint = getCurrentBreakpoint();
    setCurrentBreakpoint(newBreakpoint);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return currentBreakpoint;
};
