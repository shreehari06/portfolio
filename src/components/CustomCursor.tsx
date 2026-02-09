import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CursorMode = 'default' | 'hover' | 'scroll' | 'drag' | 'loading';

interface CursorState {
  x: number;
  y: number;
  text: string;
  mode: CursorMode;
  scale: number;
  rotation: number;
}

const modeConfig: Record<CursorMode, { ring: string; dot: string; textColor: string }> = {
  default: {
    ring: 'border-foreground/20',
    dot: 'bg-foreground',
    textColor: 'text-muted-foreground',
  },
  hover: {
    ring: 'border-primary/60 bg-primary/5',
    dot: 'bg-primary',
    textColor: 'text-primary',
  },
  scroll: {
    ring: 'border-muted-foreground/40',
    dot: 'bg-muted-foreground',
    textColor: 'text-muted-foreground',
  },
  drag: {
    ring: 'border-accent/60 bg-accent/5',
    dot: 'bg-accent',
    textColor: 'text-accent',
  },
  loading: {
    ring: 'border-primary/40 animate-pulse',
    dot: 'bg-primary animate-pulse',
    textColor: 'text-primary',
  },
};

const CustomCursor = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    text: '',
    mode: 'default',
    scale: 1,
    rotation: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<number>();
  const idleTimeoutRef = useRef<number>();
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const updateCursor = useCallback((e: MouseEvent) => {
    // Calculate velocity for rotation effect
    const dx = e.clientX - lastPositionRef.current.x;
    const dy = e.clientY - lastPositionRef.current.y;
    velocityRef.current = { x: dx, y: dy };
    lastPositionRef.current = { x: e.clientX, y: e.clientY };
    
    // Subtle rotation based on movement direction
    const rotation = Math.atan2(dy, dx) * (180 / Math.PI) * 0.1;
    
    setCursor(prev => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
      rotation: Math.abs(dx) > 2 || Math.abs(dy) > 2 ? rotation : prev.rotation * 0.9,
    }));
    setIsVisible(true);
    
    // Reset idle timeout - show contextual hint after idle
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = window.setTimeout(() => {
      // If not hovering anything, show a subtle "Scroll" hint
      setCursor(prev => {
        if (prev.mode === 'default' && !prev.text) {
          return { ...prev, text: 'Scroll to explore', mode: 'scroll' };
        }
        return prev;
      });
    }, 3000);
  }, []);

  // Scroll detection for contextual cursor
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const direction = currentY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentY;
      setScrollDirection(direction);
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      
      // Set scrolling to false after scroll stops
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
        setScrollDirection(null);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Check if touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    window.addEventListener('mousemove', updateCursor);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Interactive elements detection with intent mapping
    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Check for data-cursor attribute with various intents
      const cursorElement = target.closest('[data-cursor]');
      const cursorText = cursorElement?.getAttribute('data-cursor') || '';
      const cursorMode = cursorElement?.getAttribute('data-cursor-mode') as CursorMode || 'hover';
      
      const isInteractive = target.closest('a, button, [role="button"], [data-cursor], input, textarea, select');
      const isInput = target.closest('input, textarea');
      const isButton = target.closest('button, [role="button"]');
      const isLink = target.closest('a');
      
      // Determine appropriate mode and text based on element type
      let mode: CursorMode = 'default';
      let text = cursorText;
      let scale = 1;
      
      if (isInteractive) {
        mode = cursorMode !== 'hover' ? cursorMode : 'hover';
        scale = 1.4;
        
        // Auto-generate contextual text if not provided
        if (!text) {
          if (isInput) {
            text = 'Type';
          } else if (isButton) {
            const buttonText = (target.closest('button') as HTMLButtonElement)?.innerText?.slice(0, 12);
            text = buttonText || 'Click';
          } else if (isLink) {
            const href = (target.closest('a') as HTMLAnchorElement)?.href;
            if (href?.includes('#')) {
              text = 'Jump';
            } else if (href?.includes('mailto:')) {
              text = 'Email';
            } else if (href?.includes('http')) {
              text = 'Visit';
            } else {
              text = 'Explore';
            }
          }
        }
      }
      
      setCursor(prev => ({
        ...prev,
        text,
        mode,
        scale,
      }));
    };

    const handleElementLeave = () => {
      setCursor(prev => ({
        ...prev,
        text: '',
        mode: 'default',
        scale: 1,
      }));
    };

    // Mouse down/up for drag feel
    const handleMouseDown = () => {
      setCursor(prev => ({
        ...prev,
        scale: prev.scale * 0.9,
      }));
    };

    const handleMouseUp = () => {
      setCursor(prev => ({
        ...prev,
        scale: prev.mode === 'hover' ? 1.4 : 1,
      }));
    };

    document.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseout', handleElementLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseout', handleElementLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [updateCursor]);

  if (isTouchDevice) return null;

  const config = modeConfig[cursor.mode];
  
  // During scroll, modify the cursor behavior
  const scrollScale = isScrolling ? 0.8 : 1;
  const scrollText = isScrolling && scrollDirection 
    ? (scrollDirection === 'down' ? '↓' : '↑') 
    : null;

  return (
    <>
      {/* Main cursor dot - premium, restrained movement */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: cursor.x - 5,
          y: cursor.y - 5,
          scale: cursor.scale * scrollScale,
          rotate: cursor.rotation,
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 35,
          mass: 0.3,
        }}
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${config.dot}`} />
      </motion.div>

      {/* Outer ring - smoother, more deliberate follow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: cursor.x - 20,
          y: cursor.y - 20,
          scale: cursor.mode !== 'default' ? 1.6 : (isScrolling ? 0.7 : 1),
        }}
        transition={{
          type: 'spring',
          stiffness: 120,
          damping: 25,
          mass: 1,
        }}
        style={{ opacity: isVisible ? 0.9 : 0 }}
      >
        <div 
          className={`w-10 h-10 rounded-full border transition-all duration-500 ${config.ring}`}
        />
      </motion.div>

      {/* Contextual text label - restrained, informative */}
      <AnimatePresence mode="wait">
        {(cursor.text || scrollText) && isVisible && (
          <motion.div
            key={cursor.text || scrollText}
            className="fixed top-0 left-0 pointer-events-none z-[9997]"
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              // Position tooltip to the left if cursor is near right edge of viewport
              x: cursor.x > window.innerWidth - 120 ? cursor.x - 80 : cursor.x + 18,
              ...( isScrolling ? { y: cursor.y - 8 } : { y: cursor.y + 18 }),
            }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              opacity: { duration: 0.15 },
            }}
          >
            <span 
              className={`label bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/30 shadow-lg transition-colors duration-300 whitespace-nowrap ${config.textColor}`}
              style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}
            >
              {scrollText || cursor.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll direction indicator - subtle arrow during scroll */}
      <AnimatePresence>
        {isScrolling && scrollDirection && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9996]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 0.4,
              scale: 1,
              x: cursor.x - 4,
              y: cursor.y + (scrollDirection === 'down' ? 35 : -45),
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            <motion.div
              animate={{ y: scrollDirection === 'down' ? [0, 4, 0] : [0, -4, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              className="text-muted-foreground/60"
              style={{ fontSize: '0.75rem' }}
            >
              {scrollDirection === 'down' ? '↓' : '↑'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
