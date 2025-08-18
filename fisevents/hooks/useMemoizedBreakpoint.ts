import { useEffect, useState, useMemo } from "react";
import defaultTheme from 'tailwindcss/defaultTheme';

export const useMemoizedBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('sm');

  const breakpointValue = useMemo(() => {
    const getBreakpointValue = (value: keyof typeof defaultTheme.screens): number => {
      return parseInt(
        defaultTheme.screens[value].indexOf('px')
      );
    };

    const getCurrentBreakpoint = () => {
      const breakpoints = Object.keys(defaultTheme.screens);
      let currentBreakpoint = 'sm';
      let biggestBreakpointValue = 0;

      for (let i = 0; i < breakpoints.length; i++) {
        const breakpoint = breakpoints[i] as keyof typeof defaultTheme.screens;
        const breakpointValue = getBreakpointValue(breakpoint);

        if (breakpointValue > biggestBreakpointValue && window.innerWidth >= breakpointValue) {
          biggestBreakpointValue = breakpointValue;
          currentBreakpoint = breakpoint;
        }
      }

      return currentBreakpoint as keyof typeof defaultTheme.screens;
    };

    return getCurrentBreakpoint();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getCurrentBreakpoint();
      setCurrentBreakpoint(newBreakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return currentBreakpoint;
};
