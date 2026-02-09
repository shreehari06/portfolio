import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { HeroContent } from '@/content/schema';

interface HeroSceneProps {
  content: HeroContent;
}

const HeroScene = ({ content }: HeroSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax depth layers - different speeds create depth
  const labelY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const subheadingY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  
  // Opacity fade as you scroll
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Scale for depth perception
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={containerRef} className="scene relative" id="hero">
      <motion.div 
        className="scene-content flex flex-col items-center justify-center text-center min-h-screen py-20"
        style={{ opacity, scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: labelY }}
          className="label text-muted-foreground mb-8"
        >
          {content.label}
        </motion.div>

        <motion.h1
          className="heading-display text-balance mb-8"
          initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: headingY }}
        >
          {content.headlinePart1}{' '}
          <span className="text-accent-gradient">{content.headlineAccent}</span>
        </motion.h1>

        <motion.p
          className="body-lg text-muted-foreground max-w-2xl mb-12"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: subheadingY }}
        >
          {content.subheadline}
        </motion.p>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: ctaY }}
        >
          <a
            href={content.primaryCta.href}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full body-base font-medium hover-lift hover-glow"
            data-cursor={content.primaryCta.cursorLabel}
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector(content.primaryCta.href);
              if (!target) return;

              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

              const rect = target.getBoundingClientRect();
              const targetTop = window.pageYOffset + rect.top - (window.innerHeight * 0.08);

              // Cancel any in-flight scroll animation
              if (scrollAnimRef.current) {
                cancelAnimationFrame(scrollAnimRef.current);
                scrollAnimRef.current = null;
              }

              // Prevent hover interactions from interrupting the scroll
              const prevPointerEvents = document.documentElement.style.pointerEvents;
              document.documentElement.style.pointerEvents = 'none';

              if (prefersReducedMotion) {
                window.scrollTo({ top: targetTop });
                document.documentElement.style.pointerEvents = prevPointerEvents;
                return;
              }

              const startY = window.scrollY;
              const delta = targetTop - startY;
              const distance = Math.abs(delta);
              const duration = Math.min(1400, Math.max(700, distance * 0.6)); // ms
              const startTime = performance.now();

              const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

              const step = (now: number) => {
                const elapsed = now - startTime;
                const t = Math.min(1, elapsed / duration);
                const y = startY + delta * easeOutCubic(t);
                window.scrollTo({ top: y });

                if (t < 1) {
                  scrollAnimRef.current = requestAnimationFrame(step);
                } else {
                  scrollAnimRef.current = null;
                  document.documentElement.style.pointerEvents = prevPointerEvents;
                }
              };

              scrollAnimRef.current = requestAnimationFrame(step);
            }}
          >
            {content.primaryCta.text}
          </a>
          <a
            href={content.secondaryCta.href}
            className="px-8 py-4 border border-border text-foreground rounded-full body-base font-medium hover:bg-secondary/50 transition-colors duration-300"
            data-cursor={content.secondaryCta.cursorLabel}
          >
            {content.secondaryCta.text}
          </a>
        </motion.div>

        {/* Scroll indicator - floats independently */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="label">{content.scrollIndicator}</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroScene;