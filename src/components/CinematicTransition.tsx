import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { CinematicTransitionContent } from '@/content/schema';

interface CinematicTransitionProps {
  content: CinematicTransitionContent;
  onCinematicStateChange?: (isActive: boolean) => void;
}

const CinematicTransition = ({ content, onCinematicStateChange }: CinematicTransitionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'], // Start tracking when section enters viewport from below
  });

  // Notify particle background of cinematic state
  scrollYProgress.on('change', (value) => {
    const isActive = value > 0.25 && value < 0.92;
    if (isActive !== lastActiveRef.current) {
      lastActiveRef.current = isActive;
      onCinematicStateChange?.(isActive);
    }
  });

  // Phase timing with offset ['start end', 'end end']:
  // 0% = section top at viewport bottom
  // ~33% = section centered in viewport (sticky kicks in)
  // 100% = section bottom at viewport bottom (exit)
  
  // Text appears as section enters, holds through most of scroll, fades at very end

  // Dim overlay
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.35, 0.85, 0.95],
    [0, 0.05, 0.05, 0]
  );

  // Line 1 - appears as section centers, stays visible until near end
  const line1Opacity = useTransform(
    scrollYProgress,
    [0.2, 0.35, 0.85, 0.95],
    [0, 1, 1, 0]
  );
  const line1Y = useTransform(
    scrollYProgress,
    [0.2, 0.38],
    [20, 0]
  );
  const line1Blur = useTransform(
    scrollYProgress,
    [0.2, 0.38],
    [6, 0]
  );

  // Line 2 - appears right after line 1, same exit timing
  const line2Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.85, 0.95],
    [0, 1, 1, 0]
  );
  const line2Y = useTransform(
    scrollYProgress,
    [0.3, 0.48],
    [15, 0]
  );
  const line2Blur = useTransform(
    scrollYProgress,
    [0.3, 0.48],
    [4, 0]
  );

  // Decorative line - appears with line 2
  const lineScale = useTransform(
    scrollYProgress,
    [0.35, 0.5, 0.85, 0.95],
    [0, 1, 1, 0]
  );

  // Center alignment guides
  const guidesOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.4, 0.85, 0.95],
    [0, 0.08, 0.08, 0]
  );

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (prefersReducedMotion) {
    return (
      <section ref={containerRef} className="h-[100vh]">
        <div className="h-screen flex items-center justify-center text-center px-6">
          <div>
            <p className="heading-lg md:heading-xl font-display text-foreground mb-4">
              {content.line1}
            </p>
            <p className="heading-md md:heading-lg font-display text-muted-foreground italic">
              {content.line2}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef} 
      className="relative h-[200vh]"
      aria-label="Signature statement"
    >
      {/* Sticky container - stays fixed during scroll */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        {/* Dim overlay */}
        <motion.div
          className="absolute inset-0 bg-background pointer-events-none z-10"
          style={{ opacity: overlayOpacity }}
        />

        {/* Subtle alignment guides for ordered feel */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{ opacity: guidesOpacity }}
        >
          {/* Horizontal center line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>
          {/* Vertical center line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
          </div>
        </motion.div>

        {/* Text content */}
        <div className="relative z-30 text-center px-6 max-w-4xl">
          
          {/* Line 1 - word-by-word to prevent orphan letters */}
          <motion.p
            className="heading-lg md:heading-xl font-display text-foreground flex flex-wrap justify-center mb-6"
            style={{ opacity: line1Opacity }}
          >
            {content.line1.split(' ').map((word, i, arr) => (
              <motion.span
                key={i}
                className="whitespace-nowrap"
                style={{
                  y: line1Y,
                  filter: useTransform(line1Blur, (v) => `blur(${v}px)`),
                  marginRight: i < arr.length - 1 ? '0.3em' : 0,
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            className="flex justify-center mb-6"
            style={{ 
              scaleX: lineScale, 
              opacity: line2Opacity,
            }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </motion.div>

          {/* Line 2 - word-by-word */}
          <motion.p
            className="heading-md md:heading-lg font-display text-muted-foreground italic flex flex-wrap justify-center"
            style={{ opacity: line2Opacity }}
          >
            {content.line2.split(' ').map((word, i, arr) => (
              <motion.span
                key={i}
                className="whitespace-nowrap"
                style={{
                  y: line2Y,
                  filter: useTransform(line2Blur, (v) => `blur(${v}px)`),
                  marginRight: i < arr.length - 1 ? '0.3em' : 0,
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </div>

        {/* Radial vignette for focus */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            opacity: useTransform(scrollYProgress, [0.25, 0.4, 0.85, 0.95], [0, 0.35, 0.35, 0]),
            background: 'radial-gradient(circle at 50% 50%, transparent 35%, hsl(var(--background) / 0.6) 85%)',
          }}
        />
      </div>
    </section>
  );
};

export default CinematicTransition;
