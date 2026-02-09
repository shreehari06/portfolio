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

  // Set up IntersectionObserver for scrollspy
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const newSection = entry.target.id;
            if (newSection !== activeSection) {
              // Trigger one-time pulse
              setPulsingSection(newSection);
              setTimeout(() => setPulsingSection(null), 400);
              
              // Mark as visited
              setVisitedSections(prev => new Set([...prev, newSection]));
            }
            setActiveSection(newSection);
          }
        });
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: [0.3, 0.5, 0.7],
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sections, activeSection]);

  // Update scroll progress
  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const newProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setProgress(newProgress);
  }, []);

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
      document.body.style.pointerEvents = 'none';
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 800);
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
      case 'ArrowUp':
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
      case 'ArrowDown':
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

  // Calculate section positions for visual markers
  const getSectionPosition = (index: number) => {
    return (index / (sections.length - 1)) * 100;
  };

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

  // Desktop: Wayfinding Rail
  return (
    <motion.nav
      ref={railRef}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        x: showHint ? 3 : 0,
      }}
      transition={{ 
        opacity: { duration: 0.6, delay: 1.5 },
        x: { duration: 0.3, ease: 'easeInOut' }
      }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-30"
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
        className="relative flex items-center gap-3 py-4 px-2 rounded-2xl"
        style={{
          background: 'hsl(var(--card) / 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid hsl(var(--border) / 0.15)',
          boxShadow: '0 4px 20px -4px hsl(var(--background) / 0.3)',
        }}
        animate={{
          width: isExpanded ? 160 : 28,
        }}
        transition={{ duration: transitionDuration, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Progress track */}
        <div
          ref={trackRef}
          className="relative w-[2px] h-44 rounded-full flex-shrink-0 ml-0.5"
          style={{ background: 'hsl(var(--accent) / 0.08)' }}
        >
          {/* Progress fill */}
          <motion.div
            className="absolute top-0 left-0 right-0 rounded-full"
            style={{ 
              height: `${progress}%`,
              background: 'hsl(var(--accent) / 0.35)',
            }}
            initial={false}
            transition={{ duration: 0.1, ease: 'linear' }}
          />

          {/* Section markers */}
          {sections.map((section, index) => {
            const isActive = activeSection === section.id;
            const isVisited = visitedSections.has(section.id);
            const isPulsing = pulsingSection === section.id;
            const position = getSectionPosition(index);
            
            return (
              <div
                key={section.id}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${position}%` }}
              >
                <motion.button
                  className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-card"
                  animate={{
                    width: isActive ? 7 : 4,
                    height: isActive ? 7 : 4,
                    backgroundColor: isActive
                      ? 'hsl(var(--accent))'
                      : isVisited
                        ? 'hsl(var(--accent) / 0.35)'
                        : 'hsl(var(--muted-foreground) / 0.2)',
                    boxShadow: isActive
                      ? '0 0 0 3px hsl(var(--accent) / 0.15), 0 0 8px hsl(var(--accent) / 0.25)'
                      : 'none',
                    scale: isPulsing && !prefersReducedMotion ? [1, 1.4, 1] : 1,
                  }}
                  transition={{
                    duration: transitionDuration,
                    scale: { duration: 0.4, ease: 'easeOut' },
                  }}
                  onClick={() => scrollToSection(section.id)}
                  onFocus={() => setFocusedIndex(index)}
                  aria-label={`Jump to ${section.label}`}
                  aria-current={isActive ? 'true' : undefined}
                  tabIndex={0}
                  type="button"
                />
              </div>
            );
          })}
        </div>

        {/* Labels container - glass panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: transitionDuration, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col justify-between h-44 py-0 overflow-hidden"
            >
              {sections.map((section, index) => {
                const isActive = activeSection === section.id;
                const isFocused = focusedIndex === index;
                
                return (
                  <motion.button
                    key={section.id}
                    ref={(el) => { labelRefs.current[index] = el; }}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                    }}
                    transition={{ 
                      delay: index * 0.035,
                      duration: 0.2,
                      ease: 'easeOut'
                    }}
                    className={`group flex items-center gap-2 text-left text-xs whitespace-nowrap transition-all duration-150 focus:outline-none rounded px-1 -mx-1 ${
                      isFocused ? 'ring-1 ring-accent/50' : ''
                    }`}
                    onClick={() => scrollToSection(section.id)}
                    onFocus={() => setFocusedIndex(index)}
                    aria-label={`Jump to ${section.label}`}
                    aria-current={isActive ? 'true' : undefined}
                    tabIndex={0}
                  >
                    {/* Active indicator line */}
                    <span 
                      className={`w-0.5 h-3 rounded-full transition-all duration-200 ${
                        isActive 
                          ? 'bg-accent opacity-100' 
                          : 'bg-transparent opacity-0 group-hover:bg-muted-foreground/30 group-hover:opacity-100'
                      }`}
                    />
                    <span 
                      className={`transition-all duration-150 ${
                        isActive
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground group-hover:text-foreground/80 group-hover:translate-x-0.5'
                      }`}
                      style={{
                        fontSize: isActive ? '0.8rem' : '0.75rem',
                      }}
                    >
                      {section.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Keyboard hint (fades out before collapse starts) */}
      <AnimatePresence>
        {showKeyboardHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute -bottom-6 left-0 right-0 flex justify-center pointer-events-none"
          >
            <span className="text-[9px] text-muted-foreground tracking-wide whitespace-nowrap">
              ↑↓ navigate · N toggle
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default WayfindingRail;
