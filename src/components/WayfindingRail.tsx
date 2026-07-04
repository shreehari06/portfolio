import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NavigationSection } from '@/content/schema';
import { useMobileNav } from './MobileNavContext';

interface WayfindingRailProps {
  sections: NavigationSection[];
}

const STORAGE_KEY = 'wayfinding-hint-shown';

const WayfindingRail = ({ sections }: WayfindingRailProps) => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set([sections[0]?.id || '']));
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [pulsingSection, setPulsingSection] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);
  
  const { setSectionPickerOpen } = useMobileNav();
  
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number>();

  // Detect mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    checkMobile();
    setPrefersReducedMotion(mediaQuery.matches);

    window.addEventListener('resize', checkMobile);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionHandler);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', motionHandler);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // One-time hint on first load
  useEffect(() => {
    const hasSeenHint = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenHint && !isMobile) {
      const timer = setTimeout(() => {
        setShowHint(true);
        localStorage.setItem(STORAGE_KEY, 'true');
        setTimeout(() => setShowHint(false), 1500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Delayed keyboard hint - shows after expand, hides before collapse
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setShowKeyboardHint(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowKeyboardHint(false);
    }
  }, [isExpanded]);

  // Reset programmatic scroll lock on manual user interaction
  useEffect(() => {
    const resetScrollLock = () => {
      if (isScrollingRef.current) {
        isScrollingRef.current = false;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = undefined;
        }
        document.body.style.pointerEvents = '';
      }
    };

    window.addEventListener('wheel', resetScrollLock, { passive: true });
    window.addEventListener('touchmove', resetScrollLock, { passive: true });
    window.addEventListener('mousedown', resetScrollLock, { passive: true });
    window.addEventListener('keydown', resetScrollLock, { passive: true });

    return () => {
      window.removeEventListener('wheel', resetScrollLock);
      window.removeEventListener('touchmove', resetScrollLock);
      window.removeEventListener('mousedown', resetScrollLock);
      window.removeEventListener('keydown', resetScrollLock);
    };
  }, []);

  // Update scroll progress and handle page section tracking based on offsets
  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const newProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setProgress(newProgress);

    if (isScrollingRef.current) return;

    // Handle top/bottom boundary limits
    if (scrollTop <= 50) {
      const firstSection = sections[0]?.id || '';
      if (firstSection && activeSection !== firstSection) {
        setActiveSection(firstSection);
      }
      return;
    }
    if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 50) {
      const lastSection = sections[sections.length - 1]?.id || '';
      if (lastSection && activeSection !== lastSection) {
        setActiveSection(lastSection);
      }
      return;
    }

    // Determine active section based on offsetTop positions in real-time
    const scrollTrigger = scrollTop + window.innerHeight * 0.4; // 40% bias from top of viewport
    let currentActive = sections[0]?.id || '';

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        if (scrollTrigger >= element.offsetTop) {
          currentActive = section.id;
        }
      }
    }

    if (currentActive !== activeSection) {
      setPulsingSection(currentActive);
      setTimeout(() => setPulsingSection(null), 400);
      setVisitedSections(prev => new Set([...prev, currentActive]));
      setActiveSection(currentActive);
    }
  }, [sections, activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateProgress]);

  // Handle section click
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      isScrollingRef.current = true;
      setActiveSection(sectionId);
      setVisitedSections(prev => new Set([...prev, sectionId]));

      document.body.style.pointerEvents = 'none';
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        document.body.style.pointerEvents = '';
      }, 1000);
    }
    setIsMobileMenuOpen(false);
  }, [prefersReducedMotion]);

  // Global keyboard navigation
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isMobile) return;
      
      // Check if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          setIsExpanded(prev => !prev);
          break;
        case 'escape':
          if (isExpanded) {
            e.preventDefault();
            setIsExpanded(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isMobile, isExpanded]);

  // Handle keyboard navigation within rail
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (currentIndex > 0) {
          const newIndex = currentIndex - 1;
          setFocusedIndex(newIndex);
          labelRefs.current[newIndex]?.focus();
          if (isExpanded) {
            scrollToSection(sections[newIndex].id);
          }
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
          const newIndex = currentIndex + 1;
          setFocusedIndex(newIndex);
          labelRefs.current[newIndex]?.focus();
          if (isExpanded) {
            scrollToSection(sections[newIndex].id);
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          scrollToSection(sections[focusedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsExpanded(false);
        break;
    }
  }, [activeSection, focusedIndex, sections, scrollToSection, isExpanded]);

  const transitionDuration = prefersReducedMotion ? 0 : 0.25;

  // Get active section label
  const activeSectionLabel = sections.find((s) => s.id === activeSection)?.label || '';

  // Sync mobile menu state with context
  useEffect(() => {
    setSectionPickerOpen(isMobileMenuOpen);
  }, [isMobileMenuOpen, setSectionPickerOpen]);

  // Mobile: Handled by MobileDock component - this component is desktop-only
  if (isMobile) {
    return null;
  }

  // Desktop: Horizontal Wayfinding Rail at the top
  return (
    <motion.nav
      ref={railRef}
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ 
        opacity: 1,
        y: 0,
        x: '-50%',
      }}
      transition={{ 
        opacity: { duration: 0.6, delay: 1.5 },
        y: { duration: 0.5, ease: 'easeOut' }
      }}
      className="fixed left-1/2 top-6 z-30"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setFocusedIndex(-1);
      }}
      onKeyDown={handleKeyDown}
      role="navigation"
      aria-label="Page sections"
    >
      <motion.div
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          background: 'hsl(var(--card) / 0.5)',
          backdropFilter: 'blur(16px)',
          border: '1px solid hsl(var(--border) / 0.15)',
          boxShadow: '0 4px 30px -4px hsl(var(--background) / 0.3)',
          height: 38,
        }}
        animate={{
          width: isExpanded ? 800 : 140,
        }}
        transition={{ duration: transitionDuration, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Collapsed View: Current section name */}
        <AnimatePresence mode="wait">
          {!isExpanded && (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center w-full px-4"
            >
              <span className="text-[10px] tracking-widest uppercase font-medium text-muted-foreground whitespace-nowrap">
                {activeSectionLabel}
              </span>
            </motion.div>
          )}

          {/* Expanded View: All sections laid out horizontally */}
          {isExpanded && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, delay: 0.05 }}
              className="flex items-center justify-between w-full px-6"
            >
              {sections.map((section, index) => {
                const isActive = activeSection === section.id;
                const isFocused = focusedIndex === index;
                
                return (
                  <button
                    key={section.id}
                    ref={(el) => { labelRefs.current[index] = el; }}
                    className={`text-[10px] tracking-widest uppercase whitespace-nowrap transition-all duration-200 focus:outline-none py-1 relative ${
                      isActive 
                        ? 'text-primary font-semibold' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => scrollToSection(section.id)}
                    onFocus={() => setFocusedIndex(index)}
                    aria-label={`Jump to ${section.label}`}
                    aria-current={isActive ? 'true' : undefined}
                    tabIndex={0}
                    type="button"
                  >
                    {section.label}
                    {/* Tiny active indicator line under active label */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global horizontal scroll progress track along bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/5">
          <motion.div
            className="h-full bg-accent/35"
            style={{ width: `${progress}%` }}
            initial={false}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      </motion.div>

      {/* Keyboard navigation instructions */}
      <AnimatePresence>
        {showKeyboardHint && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute -bottom-6 left-0 right-0 flex justify-center pointer-events-none"
          >
            <span className="text-[9px] text-muted-foreground tracking-wide whitespace-nowrap">
              ←→ navigate · N toggle
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default WayfindingRail;
