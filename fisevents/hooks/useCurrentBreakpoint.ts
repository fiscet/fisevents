import { useEffect, useState } from "react";
import defaultTheme from 'tailwindcss/defaultTheme';

export const useCurrentBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('sm');

  useEffect(() => {
    const handleResize = () => {
      const currentBreakpoint = getCurrentBreakpoint();
      setCurrentBreakpoint(currentBreakpoint);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return currentBreakpoint;
};

const getBreakpointValue = (value: keyof typeof defaultTheme.screens): number =>
  +defaultTheme.screens[value].slice(
    0,
    defaultTheme.screens[value].indexOf('px')
  );


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