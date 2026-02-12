import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, FileText, Moon, Sun, X } from 'lucide-react';
import type { NavigationSection, Links } from '@/content/schema';
import { useMobileNav } from './MobileNavContext';
interface MobileDockProps {
  sections: NavigationSection[];
  links: Links;
}

const MobileDock = ({ sections, links }: MobileDockProps) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [isSectionPickerOpen, setIsSectionPickerOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  const { setSectionPickerOpen, isInCinematicZone } = useMobileNav();
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number>();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Sync section picker state with context
  useEffect(() => {
    setSectionPickerOpen(isSectionPickerOpen);
  }, [isSectionPickerOpen, setSectionPickerOpen]);

  // IntersectionObserver for scrollspy
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSection(entry.target.id);
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
  }, [sections]);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      
      // Track if user has scrolled past initial viewport
      setHasScrolled(currentY > 100);
      
      // Only update visibility if significant scroll
      if (Math.abs(delta) > 8) {
        setIsVisible(delta < 0); // Scrolling up = show, down = hide
      }
      
      lastScrollY.current = currentY;

      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Show dock after scroll stops
      scrollTimeout.current = window.setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsSectionPickerOpen(false);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Get active section label
  const activeSectionLabel = sections.find((s) => s.id === activeSection)?.label || 'Home';

  // Hide dock during cinematic zone or when modals are open
  const shouldShowDock = !isInCinematicZone && !isSectionPickerOpen && (isVisible || !hasScrolled);

  return (
    <>
      {/* Main dock bar */}
      <AnimatePresence>
        {shouldShowDock && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-3 right-3 z-40 md:hidden"
            style={{
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
            }}
          >
            <div 
              className="flex items-center justify-between h-14 px-2 rounded-2xl border border-border/20 mx-auto"
              style={{
                maxWidth: '400px',
                background: 'hsl(var(--card) / 0.85)',
                backdropFilter: 'blur(16px) saturate(180%)',
                boxShadow: '0 8px 32px -8px hsl(var(--background) / 0.5), 0 2px 8px -2px hsl(var(--background) / 0.3)',
              }}
            >
              {/* Left: Section pill */}
              <button
                onClick={() => setIsSectionPickerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors min-w-0 flex-shrink-0"
                style={{ minHeight: '44px' }}
                aria-label={`Current section: ${activeSectionLabel}. Tap to navigate.`}
                aria-expanded={isSectionPickerOpen}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span className="text-[13px] font-medium text-foreground/90 truncate max-w-[72px]">
                  {activeSectionLabel}
                </span>
              </button>

              {/* Right: All action icons */}
              <div className="flex items-center flex-shrink-0">
                <a
                  href={`mailto:${links.email}`}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  aria-label="Send email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  aria-label="GitHub profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                {/* Resume link */}
                <a
                  href={links.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  aria-label="Resume"
                >
                  <FileText className="w-4 h-4" />
                </a>

                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Section picker bottom sheet */}
      <AnimatePresence>
        {isSectionPickerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 md:hidden"
              style={{ background: 'hsl(var(--background) / 0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsSectionPickerOpen(false)}
            />
            
            {/* Section list */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-2xl border-t border-border/20"
              style={{
                background: 'hsl(var(--card) / 0.98)',
                backdropFilter: 'blur(20px)',
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <span className="text-sm font-medium text-muted-foreground">Jump to section</span>
                <button
                  onClick={() => setIsSectionPickerOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  aria-label="Close section picker"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drag handle */}
              <div className="w-10 h-1 rounded-full bg-muted/40 mx-auto mb-2" />

              {/* Section list */}
              <nav className="px-3 pb-2 max-h-[50vh] overflow-y-auto" role="navigation" aria-label="Page sections">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left transition-colors ${
                        isActive
                          ? 'bg-accent/8 text-foreground'
                          : 'text-muted-foreground hover:bg-muted/20 hover:text-foreground'
                      }`}
                      style={{ minHeight: '48px' }}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                        isActive ? 'bg-accent' : 'bg-muted-foreground/30'
                      }`} />
                      <span className={`text-[15px] ${isActive ? 'font-medium' : ''}`}>
                        {section.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileDock;
