import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { PhilosophyContent } from '@/content/schema';

interface PhilosophySceneProps {
  content: PhilosophyContent;
}

// Staggered text reveal animation - each word appears sequentially
// Uses whitespace: nowrap per word to prevent letter orphaning
const StaggeredText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const words = text.split(' ');
  
  return (
    <span className={`inline-flex flex-wrap ${className || ''}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="whitespace-nowrap mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Word-by-word reveal for headings - prevents single character orphaning
const WordReveal = ({ children, className, delay = 0 }: { children: string; className?: string; delay?: number }) => {
  const words = children.trim().split(' ');
  
  return (
    <span className={`inline-flex flex-wrap ${className || ''}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="whitespace-nowrap mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const PhilosophyScene = ({ content }: PhilosophySceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref } = useScrollAnimation({ threshold: 0.2 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="scene py-32 relative overflow-hidden" id="philosophy">
      {/* Subtle moving background element */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02]"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent blur-3xl" />
      </motion.div>
      
      <div ref={ref} className="scene-content relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <motion.span 
            className="label text-primary mb-4 block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.label}
          </motion.span>
          <h2 className="heading-xl max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline"
            >
              {content.headlinePart1}{' '}
            </motion.span>
            <motion.span 
              className="text-accent-gradient inline"
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {content.headlineAccent}
            </motion.span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {content.principles.map((principle, index) => (
            <motion.div
              key={principle.number}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
            >
              <div className="card-elevated p-8 h-full hover-lift transition-all duration-500 group-hover:border-primary/30">
                <motion.span 
                  className="text-6xl font-display font-bold text-primary/20 group-hover:text-primary/40 transition-colors duration-500 block"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                >
                  {principle.number}
                </motion.span>
                <h3 className="heading-md mt-4 mb-4 group-hover:text-primary transition-colors duration-300">
                  <StaggeredText text={principle.title} delay={index * 0.2 + 0.4} />
                </h3>
                <p className="body-base text-muted-foreground">
                  <StaggeredText text={principle.description} delay={index * 0.2 + 0.5} />
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote with line-by-line reveal */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <motion.p 
            className="heading-lg text-muted-foreground italic font-display"
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            whileInView={{ opacity: 1, letterSpacing: '0em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            "{content.quote.text}"
          </motion.p>
          <motion.cite 
            className="body-sm text-text-tertiary mt-4 block not-italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            — {content.quote.author}
          </motion.cite>
        </motion.blockquote>
      </div>
    </section>
  );
};

export default PhilosophyScene;