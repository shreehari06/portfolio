import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

interface MobileNavContextType {
  isSectionPickerOpen: boolean;
  setSectionPickerOpen: (open: boolean) => void;
  isInCinematicZone: boolean;
  setInCinematicZone: (inZone: boolean) => void;
  isScrollingDown: boolean;
  shouldShowSocialDock: boolean;
}

const MobileNavContext = createContext<MobileNavContextType | null>(null);

export const useMobileNav = () => {
  const context = useContext(MobileNavContext);
  if (!context) {
    throw new Error('useMobileNav must be used within MobileNavProvider');
  }
  return context;
};

interface MobileNavProviderProps {
  children: ReactNode;
}

export const MobileNavProvider = ({ children }: MobileNavProviderProps) => {
  const [isSectionPickerOpen, setIsSectionPickerOpen] = useState(false);
  const [isInCinematicZone, setIsInCinematicZone] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number>();

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      
      // Only update if significant scroll (avoid micro-movements)
      if (Math.abs(delta) > 5) {
        setIsScrollingDown(delta > 0);
      }
      
      lastScrollY.current = currentY;

      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Reset scrolling state after scroll stops
      scrollTimeout.current = window.setTimeout(() => {
        setIsScrollingDown(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const setSectionPickerOpen = useCallback((open: boolean) => {
    setIsSectionPickerOpen(open);
  }, []);

  const setInCinematicZone = useCallback((inZone: boolean) => {
    setIsInCinematicZone(inZone);
  }, []);

  // Social dock visibility logic
  const shouldShowSocialDock = !isSectionPickerOpen && !isInCinematicZone && !isScrollingDown;

  return (
    <MobileNavContext.Provider value={{
      isSectionPickerOpen,
      setSectionPickerOpen,
      isInCinematicZone,
      setInCinematicZone,
      isScrollingDown,
      shouldShowSocialDock,
    }}>
      {children}
    </MobileNavContext.Provider>
  );
};
