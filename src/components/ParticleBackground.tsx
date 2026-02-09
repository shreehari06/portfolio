import { useEffect, useRef, useCallback } from 'react';

// Global state for cinematic mode (can be controlled externally)
let cinematicModeActive = false;
let cinematicModeBlend = 0; // 0-1 blend factor
export const setCinematicMode = (active: boolean) => {
  cinematicModeActive = active;
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  life: number;
  maxLife: number;
  // Context-aware properties
  targetX: number | null;
  targetY: number | null;
  isNearText: boolean;
  // Cinematic mode properties
  gridX: number;
  gridY: number;
  // Ordered drift direction for cinematic mode
  driftAngle: number;
}

interface ContentZone {
  top: number;
  bottom: number;
  density: number;
  isActive: boolean;
}

// Target ~30fps for performance (33ms between frames)
const TARGET_FRAME_TIME = 33;

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();
  const prefersReducedMotion = useRef(false);
  const contentZonesRef = useRef<ContentZone[]>([]);
  const activeSectionRef = useRef<{ top: number; bottom: number; center: number } | null>(null);
  const lastFrameTimeRef = useRef(0);
  const isVisibleRef = useRef(true);

  const updateContentZones = useCallback(() => {
    const sections = document.querySelectorAll('.scene');
    const zones: ContentZone[] = [];
    
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      const textElements = section.querySelectorAll('h1, h2, h3, p, span, a');
      const density = Math.min(textElements.length / 20, 1);
      
      const isActive = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
      
      zones.push({
        top: rect.top + scrollY,
        bottom: rect.bottom + scrollY,
        density,
        isActive,
      });
      
      if (isActive && rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
        activeSectionRef.current = {
          top: rect.top + scrollY,
          bottom: rect.bottom + scrollY,
          center: (rect.top + rect.bottom) / 2 + scrollY,
        };
      }
    });
    
    contentZonesRef.current = zones;
  }, []);

  const createParticle = useCallback((canvas: HTMLCanvasElement, index: number = 0): Particle => {
    // Calculate grid position for cinematic alignment
    const cols = 12;
    const rows = 8;
    const gridX = (index % cols) * (canvas.width / cols) + (canvas.width / cols / 2);
    const gridY = Math.floor(index / cols) * (canvas.height / rows) + (canvas.height / rows / 2);
    
    // Unified drift direction for cinematic mode (slight downward-right flow)
    const baseDriftAngle = Math.PI * 0.35; // ~63 degrees
    const driftAngle = baseDriftAngle + (Math.random() - 0.5) * 0.3; // Small variation
    
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      baseOpacity: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.3 + 0.1,
      life: 0,
      maxLife: Math.random() * 500 + 300,
      targetX: null,
      targetY: null,
      isNearText: false,
      gridX,
      gridY,
      driftAngle,
    };
  }, []);

  const getLocalDensity = useCallback((y: number): number => {
    const scrollY = window.scrollY;
    const worldY = y + scrollY;
    
    for (const zone of contentZonesRef.current) {
      if (worldY >= zone.top && worldY <= zone.bottom) {
        return zone.density;
      }
    }
    return 0;
  }, []);

  const getClusterTarget = useCallback((particle: Particle): { x: number; y: number } | null => {
    const activeSection = activeSectionRef.current;
    if (!activeSection) return null;
    
    const scrollY = window.scrollY;
    
    const sectionTop = activeSection.top - scrollY;
    const sectionBottom = activeSection.bottom - scrollY;
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const distToTop = Math.abs(particle.y - sectionTop);
    const distToBottom = Math.abs(particle.y - sectionBottom);
    
    if (distToTop < 150 || distToBottom < 150) {
      const targetY = distToTop < distToBottom ? sectionTop : sectionBottom;
      const targetX = particle.x + (Math.random() - 0.5) * 100;
      return { x: targetX, y: targetY };
    }
    
    return null;
  }, []);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particleCount = prefersReducedMotion.current ? 30 : 80; // Reduced for better perf
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => createParticle(canvas, i));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastScrollTimeRef.current;
      
      if (timeDelta > 0) {
        const scrollDelta = Math.abs(currentScroll - lastScrollRef.current);
        const rawVelocity = scrollDelta / Math.max(timeDelta, 16) * 16;
        // Clamp velocity and apply easing for smooth response
        scrollVelocityRef.current = Math.min(rawVelocity * 1.2, 60);
      }
      
      lastScrollRef.current = currentScroll;
      lastScrollTimeRef.current = currentTime;
      
      updateContentZones();
    };

    // Visibility API - pause when tab not visible
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current) {
        // Reset timing to prevent jumps
        lastFrameTimeRef.current = performance.now();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    updateContentZones();
    
    const zoneUpdateInterval = setInterval(updateContentZones, 500);

    const getParticleColor = () => {
      const style = getComputedStyle(document.documentElement);
      const hsl = style.getPropertyValue('--particle-color').trim();
      if (hsl) {
        const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
        return { h, s, l };
      }
      return { h: 35, s: 50, l: 40 };
    };

    const animate = (currentTime: number) => {
      // Skip if tab not visible
      if (!isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Frame limiting to ~30fps
      const deltaTime = currentTime - lastFrameTimeRef.current;
      if (deltaTime < TARGET_FRAME_TIME) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime - (deltaTime % TARGET_FRAME_TIME);

      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particleColor = getParticleColor();
      const scrollInfluence = scrollVelocityRef.current;
      const isScrollingFast = scrollInfluence > 8;
      const isScrollingVeryFast = scrollInfluence > 25;
      
      // Smoothly blend cinematic mode
      const targetBlend = cinematicModeActive ? 1 : 0;
      cinematicModeBlend += (targetBlend - cinematicModeBlend) * 0.04;
      const inCinematicMode = cinematicModeBlend > 0.01;
      
      particlesRef.current.forEach((particle, index) => {
        particle.life++;
        
        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle(canvas, index);
          return;
        }

        // Context-aware density detection
        const localDensity = getLocalDensity(particle.y);
        particle.isNearText = localDensity > 0.3;
        
        // Reduce motion/brightness near text-heavy sections
        const textFadeFactor = 1 - (localDensity * 0.75);
        const textSpeedFactor = 1 - (localDensity * 0.6);
        
        // Cinematic mode dampening
        const cinematicDampen = 1 - cinematicModeBlend * 0.85;
        
        // Velocity-based boost during fast scroll
        const scrollBoost = isScrollingFast 
          ? 1 + scrollInfluence * 0.04 * cinematicDampen * textSpeedFactor
          : 1;

        if (!prefersReducedMotion.current) {
          if (inCinematicMode) {
            // Cinematic mode: ordered drift + grid alignment
            
            // Gently pull toward grid position
            const toGridX = particle.gridX - particle.x;
            const toGridY = particle.gridY - particle.y;
            particle.vx += toGridX * 0.006 * cinematicModeBlend;
            particle.vy += toGridY * 0.006 * cinematicModeBlend;
            
            // Add unified drift direction for "ordered" feel
            const driftSpeed = 0.08 * cinematicModeBlend;
            particle.vx += Math.cos(particle.driftAngle) * driftSpeed;
            particle.vy += Math.sin(particle.driftAngle) * driftSpeed;
            
            // Strong damping for calm motion
            particle.vx *= 0.90;
            particle.vy *= 0.90;
            
          } else {
            // Normal ambient behavior
            const mouseInfluenceFactor = particle.isNearText ? 0.2 : 1;
            const dx = mouseRef.current.x - particle.x;
            const dy = mouseRef.current.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 180) {
              const force = (180 - dist) / 180 * 0.015 * mouseInfluenceFactor * textSpeedFactor;
              particle.vx -= dx * force * 0.01;
              particle.vy -= dy * force * 0.01;
            }

            // Fast scroll response - increased energy
            if (isScrollingFast) {
              const scrollEnergy = Math.min(scrollInfluence * 0.015, 0.8);
              particle.vx += (Math.random() - 0.5) * scrollEnergy * textSpeedFactor;
              particle.vy += scrollEnergy * (Math.random() * 0.6 + 0.4) * textSpeedFactor;
              
              // Subtle outward expansion during very fast scroll
              if (isScrollingVeryFast) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const toCenterX = centerX - particle.x;
                const toCenterY = centerY - particle.y;
                particle.vx -= toCenterX * 0.00008 * scrollInfluence;
                particle.vy -= toCenterY * 0.00008 * scrollInfluence;
              }
            }

            // Section clustering (disabled during fast scroll)
            const clusterTarget = getClusterTarget(particle);
            if (clusterTarget && !isScrollingFast) {
              const toTargetX = clusterTarget.x - particle.x;
              const toTargetY = clusterTarget.y - particle.y;
              particle.vx += toTargetX * 0.00015 * textSpeedFactor;
              particle.vy += toTargetY * 0.0002 * textSpeedFactor;
            }
            
            // Extra damping near text
            if (particle.isNearText) {
              particle.vx *= 0.94;
              particle.vy *= 0.94;
            }
          }
        }

        // Apply velocity with context-aware damping
        const baseDamping = inCinematicMode ? 0.93 : (particle.isNearText ? 0.95 : 0.98);
        particle.x += particle.vx * scrollBoost * textSpeedFactor;
        particle.y += particle.vy * scrollBoost * textSpeedFactor;
        particle.vx *= baseDamping;
        particle.vy *= baseDamping;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Calculate opacity with all context factors
        const lifeFade = 1 - Math.abs((particle.life / particle.maxLife) * 2 - 1);
        const cinematicOpacityFactor = 1 - cinematicModeBlend * 0.55;
        const scrollBrightness = isScrollingFast ? 1 + scrollInfluence * 0.006 : 1;
        const targetOpacity = particle.baseOpacity * lifeFade * textFadeFactor * cinematicOpacityFactor * scrollBrightness;
        particle.opacity += (targetOpacity - particle.opacity) * 0.08;
        
        // Size variation during scroll
        const dynamicSize = particle.size * (isScrollingFast ? 1 + scrollInfluence * 0.008 : 1);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dynamicSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particleColor.h}, ${particleColor.s}%, ${particleColor.l}%, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections - context-aware
      if (!prefersReducedMotion.current) {
        const connectionDistance = inCinematicMode 
          ? 70 
          : (isScrollingFast ? 130 : 90);
        
        const baseConnectionOpacity = inCinematicMode 
          ? 0.025 * (1 - cinematicModeBlend * 0.75)
          : (isScrollingFast ? 0.1 : 0.05);
        
        // Reduce connection checks for performance (every other particle)
        for (let i = 0; i < particlesRef.current.length; i += 2) {
          const p1 = particlesRef.current[i];
          if (p1.isNearText && getLocalDensity(p1.y) > 0.5) continue;
          
          for (let j = i + 2; j < Math.min(i + 12, particlesRef.current.length); j += 2) {
            const p2 = particlesRef.current[j];
            if (p2.isNearText && getLocalDensity(p2.y) > 0.5) continue;
            
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;
            const maxDistSq = connectionDistance * connectionDistance;

            if (distSq < maxDistSq) {
              const dist = Math.sqrt(distSq);
              const connectionFade = Math.min(p1.opacity, p2.opacity) / 0.3;
              const opacity = (1 - dist / connectionDistance) * baseConnectionOpacity * connectionFade;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `hsla(${particleColor.h}, ${particleColor.s}%, ${particleColor.l}%, ${opacity})`;
              ctx.lineWidth = isScrollingFast ? 0.7 : 0.4;
              ctx.stroke();
            }
          }
        }
      }

      // Decay scroll velocity
      scrollVelocityRef.current *= 0.9;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(zoneUpdateInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [createParticle, updateContentZones, getLocalDensity, getClusterTarget]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default ParticleBackground;
