import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Lock, X, Shield, ChevronRight, ExternalLink } from 'lucide-react';
import type { SelectedWorkContent, Project } from '@/content/schema';

interface WorkSceneProps {
  content: SelectedWorkContent;
}

// Vault card with press-in resistance effect
const VaultCard = ({ 
  project, 
  index, 
  onOpen 
}: { 
  project: Project; 
  index: number;
  onOpen: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });
  
  // Spring config for resistance feel - higher damping + restDelta to prevent end jerk
  const springConfig = { stiffness: 80, damping: 40, mass: 1, restDelta: 0.01 };
  
  const rawY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.5, 1]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  
  const y = useSpring(rawY, springConfig);
  const opacity = useSpring(rawOpacity, springConfig);
  const scale = useSpring(rawScale, springConfig);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, scale }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <motion.div 
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-card cursor-pointer"
        animate={{
          scale: isPressed ? 0.98 : isHovered ? 1.01 : 1,
          boxShadow: isHovered 
            ? '0 0 40px -10px hsl(var(--primary) / 0.25), 0 25px 50px -12px hsl(var(--foreground) / 0.15)'
            : '0 10px 30px -10px hsl(var(--foreground) / 0.1)',
          borderColor: isHovered ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--border) / 0.5)',
        }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 25,
          restDelta: 0.001,
        }}
        onClick={onOpen}
        data-cursor="Open Summary"
        initial={{ filter: 'blur(6px)' }}
        whileInView={{ filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* Badge + Arrow container - positioned top right */}
        <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-10 flex items-center gap-1.5 lg:gap-2">
          <motion.div 
            className="flex items-center gap-1.5 px-2 py-1.5 lg:px-3 rounded-full bg-muted/80 backdrop-blur-sm border border-border/50"
            animate={{
              backgroundColor: isHovered ? 'hsl(var(--primary) / 0.15)' : 'hsl(var(--muted) / 0.8)',
              borderColor: isHovered ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border) / 0.5)',
            }}
          >
            <Lock className="w-3 h-3 text-muted-foreground" />
            <span className="label text-muted-foreground hidden sm:inline">{project.statusLabel}</span>
          </motion.div>
          
          <motion.div 
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-secondary/50 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
            animate={{ 
              x: isHovered ? 4 : 0,
              opacity: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </motion.div>
        </div>

        {/* Subtle glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <div className="p-6 pt-16 sm:pt-8 lg:p-10">
          <div className="flex-1">
            <motion.h3 
              className="heading-md mb-4 pr-32 sm:pr-40 lg:pr-48 transition-colors duration-300"
              animate={{ color: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
            >
              {project.title}
            </motion.h3>
            <p className="body-base text-muted-foreground mb-6 max-w-xl">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, tagIndex) => (
                <motion.span
                  key={tag}
                  className="px-3 py-1 bg-secondary/50 text-text-secondary rounded-full body-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1 + tagIndex * 0.04,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Detail drawer/modal
const VaultDrawer = ({ 
  project, 
  isOpen, 
  onClose,
  labels
}: { 
  project: Project | null; 
  isOpen: boolean; 
  onClose: () => void;
  labels: SelectedWorkContent['drawerLabels'];
}) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="h-full overflow-y-auto bg-card border-l border-border/50 shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/50 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="label text-primary">{labels.internalProject}</span>
                    </div>
                    <h3 className="heading-md">{project.title}</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Context */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="label text-muted-foreground mb-3">{labels.context}</h4>
                  <p className="body-base text-foreground">{project.caseStudy.context}</p>
                </motion.section>

                {/* Ownership */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="label text-muted-foreground mb-4">{labels.whatIOwned}</h4>
                  <ul className="space-y-3">
                    {project.caseStudy.whatIOwned.map((item, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="body-base text-foreground">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.section>

                {/* Technical Highlights */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="label text-muted-foreground mb-4">{labels.technicalHighlights}</h4>
                  <ul className="space-y-3">
                    {project.caseStudy.technicalHighlights.map((item, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="body-sm text-muted-foreground">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.section>

                {/* Tags */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="label text-muted-foreground mb-3">{labels.technologies}</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-secondary/50 text-secondary-foreground rounded-full body-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const WorkScene = ({ content }: WorkSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = (project: Project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // Delay clearing project to allow exit animation
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <section ref={containerRef} className="scene py-32 bg-secondary/20" id="work">
      <div className="scene-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <motion.span 
            className="label text-primary mb-4 block"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {content.label}
          </motion.span>
          <motion.h2 
            className="heading-xl max-w-3xl"
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {content.headlinePart1}{' '}
            <span className="text-accent-gradient">{content.headlineAccent}</span>
          </motion.h2>
          
          {/* Product context line */}
          <motion.div
            className="mt-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="body-sm text-muted-foreground">
              {content.productContext.product} — part of {content.productContext.suite}
            </span>
          </motion.div>

          {/* Public context link */}
          <motion.div
            className="mt-3 space-y-1.5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <div className="flex items-center gap-2 group/link">
              <span className="body-sm text-muted-foreground/60">
                {content.productContext.publicContextLabel}:
              </span>
              <a
                href={content.productContext.publicInfoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 body-sm text-muted-foreground/70 hover:text-accent transition-colors duration-300 group-hover/link:underline underline-offset-2"
                data-cursor={content.productContext.publicContextTooltip}
                title={content.productContext.publicContextTooltip}
              >
                {content.productContext.publicLinkLabel}
                <ExternalLink className="w-3 h-3 opacity-50 group-hover/link:opacity-100 transition-opacity" />
              </a>
            </div>
            <p className="body-sm text-muted-foreground/40 text-xs max-w-xl">
              {content.productContext.publicContextDisclaimer}
            </p>
          </motion.div>
          
          <motion.p 
            className="body-lg text-muted-foreground mt-6 max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {content.description}
          </motion.p>
        </motion.div>

        <div className="grid gap-6 lg:gap-8">
          {content.projects.map((project, index) => (
            <VaultCard 
              key={project.title} 
              project={project} 
              index={index}
              onOpen={() => openDrawer(project)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="body-base text-muted-foreground">
            {content.collaborationCta.prefix}{' '}
            <a 
              href={content.collaborationCta.href} 
              className="link-underline text-foreground font-medium" 
              data-cursor="Connect"
            >
              {content.collaborationCta.linkText}
            </a>
          </p>
        </motion.div>
      </div>

      {/* Vault drawer - portaled to body to escape transform context */}
      {typeof document !== 'undefined' && createPortal(
        <VaultDrawer 
          project={selectedProject} 
          isOpen={isDrawerOpen} 
          onClose={closeDrawer}
          labels={content.drawerLabels}
        />,
        document.body
      )}
    </section>
  );
};

export default WorkScene;
