import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandPalette } from './CommandPaletteContext';

const CommandPaletteHint = () => {
  const { open } = useCommandPalette();
  const [isMac, setIsMac] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect platform
    const platform = navigator.platform?.toLowerCase() || '';
    const userAgent = navigator.userAgent?.toLowerCase() || '';
    const isMacPlatform = platform.includes('mac') || userAgent.includes('mac');
    setIsMac(isMacPlatform);

    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    open();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  };

  // Mobile: Hide entirely - navigation is handled by WayfindingRail section picker
  // Resume download is in MobileNav social dock
  if (isMobile) {
    return null;
  }

  // Desktop: Show full hint
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-24 z-40"
    >
      <motion.button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-card/40 backdrop-blur-md border border-border/20 shadow-sm transition-all duration-300 hover:bg-card/60 hover:border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Open command palette"
        data-cursor="Quick Actions"
      >
        <span className="body-sm text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
          Press
        </span>
        
        <span className="flex items-center gap-0.5">
          <kbd className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded bg-muted/50 border border-border/30 font-mono text-[10px] text-muted-foreground/80 group-hover:text-muted-foreground group-hover:border-border/50 transition-colors">
            {isMac ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded bg-muted/50 border border-border/30 font-mono text-[10px] text-muted-foreground/80 group-hover:text-muted-foreground group-hover:border-border/50 transition-colors">
            K
          </kbd>
        </span>

        <span className="body-sm text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
          Command Palette
        </span>

        {/* Hover tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg bg-card/95 backdrop-blur-md border border-border/30 shadow-lg whitespace-nowrap"
            >
              <p className="body-sm text-muted-foreground">
                Jump sections, toggle theme, copy email
              </p>
              <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2 bg-card/95 border-r border-b border-border/30" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default CommandPaletteHint;
