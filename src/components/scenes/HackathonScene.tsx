import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Trophy, X, Zap, ChevronRight, AlertCircle, TrendingUp, Lock } from 'lucide-react';
import type { HackathonSpotlightContent } from '@/content/schema';

interface HackathonSceneProps {
  content: HackathonSpotlightContent;
}

// Hackathon card with press-in resistance effect
const HackathonCard = ({ 
  project, 
  onOpen 
}: { 
  project: HackathonSpotlightContent['project'];
  onOpen: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });
  
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
            ? '0 0 40px -10px hsl(var(--accent) / 0.3), 0 25px 50px -12px hsl(var(--foreground) / 0.15)'
            : '0 10px 30px -10px hsl(var(--foreground) / 0.1)',
          borderColor: isHovered ? 'hsl(var(--accent) / 0.4)' : 'hsl(var(--border) / 0.5)',
        }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 25,
          restDelta: 0.001,
        }}
        onClick={onOpen}
        data-cursor="View Details"
        initial={{ filter: 'blur(6px)' }}
        whileInView={{ filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* Badge + Arrow container - positioned to align with title */}
        <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-10 flex items-center gap-1.5 lg:gap-2">
          {/* Internal badge */}
          <motion.div 
            className="flex items-center gap-1.5 px-2 py-1.5 lg:px-3 rounded-full bg-muted/80 backdrop-blur-sm border border-border/50"
            animate={{
              backgroundColor: isHovered ? 'hsl(var(--muted))' : 'hsl(var(--muted) / 0.8)',
              borderColor: isHovered ? 'hsl(var(--border))' : 'hsl(var(--border) / 0.5)',
            }}
          >
            <Lock className="w-3 h-3 text-muted-foreground" />
            <span className="label text-muted-foreground hidden sm:inline">Internal</span>
          </motion.div>
          
          {/* Hackathon badge */}
          <motion.div 
            className="flex items-center gap-1.5 px-2 py-1.5 lg:px-3 rounded-full bg-accent/15 backdrop-blur-sm border border-accent/30"
            animate={{
              backgroundColor: isHovered ? 'hsl(var(--accent) / 0.25)' : 'hsl(var(--accent) / 0.15)',
              borderColor: isHovered ? 'hsl(var(--accent) / 0.5)' : 'hsl(var(--accent) / 0.3)',
            }}
          >
            <Trophy className="w-3 h-3 text-accent" />
            <span className="label text-accent hidden sm:inline">{project.statusLabel}</span>
          </motion.div>
          
          <motion.div 
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-secondary/50 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground"
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
          className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <div className="p-6 pt-16 sm:pt-8 lg:p-10">
          <div className="flex-1">
            <motion.h3 
              className="heading-md mb-4 pr-40 sm:pr-64 lg:pr-80 transition-colors duration-300"
              animate={{ color: isHovered ? 'hsl(var(--accent))' : 'hsl(var(--foreground))' }}
            >
              {project.title}
            </motion.h3>
            <p className="body-base text-muted-foreground mb-6 max-w-xl">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1 bg-secondary/50 text-text-secondary rounded-full body-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: techIndex * 0.04,
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Hackathon detail drawer
const HackathonDrawer = ({ 
  project, 
  isOpen, 
  onClose,
}: { 
  project: HackathonSpotlightContent['project'] | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<'technical' | 'business'>('technical');

  if (!project) return null;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(0)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

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
                      <Trophy className="w-4 h-4 text-accent" />
                      <span className="label text-accent">{project.statusLabel}</span>
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
                {/* One-liner */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="body-base text-foreground font-medium">{project.oneLiner}</p>
                  </div>
                </motion.section>

                {/* Overview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h4 className="label text-muted-foreground mb-3">Overview</h4>
                  <p className="body-base text-foreground">{project.overview}</p>
                </motion.section>

                {/* Key Features */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="label text-muted-foreground mb-4">Key Features</h4>
                  <ul className="space-y-3">
                    {project.keyFeatures.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="body-base text-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.section>

                {/* Tech Stack */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="label text-muted-foreground mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-secondary/50 text-secondary-foreground rounded-full body-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.section>

                {/* Impact Potential */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <h4 className="label text-muted-foreground mb-4">Impact Potential</h4>
                  
                  {/* Disclaimer */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50 mb-4">
                    <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="body-sm text-muted-foreground">{project.impactPotential.disclaimer}</p>
                  </div>

                  {/* Value Proposition */}
                  <ul className="space-y-2 mb-4">
                    {project.impactPotential.valueProposition.map((value, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="body-sm text-foreground">{value}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Scenarios Table */}
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="px-3 py-2 text-left label text-muted-foreground">Scenario</th>
                          <th className="px-3 py-2 text-right label text-muted-foreground">Spend</th>
                          <th className="px-3 py-2 text-right label text-muted-foreground">Rate</th>
                          <th className="px-3 py-2 text-right label text-muted-foreground">Savings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.impactPotential.scenarios.map((scenario, i) => (
                          <tr key={i} className="border-t border-border/30">
                            <td className="px-3 py-2 body-sm text-foreground">{scenario.scenario}</td>
                            <td className="px-3 py-2 body-sm text-muted-foreground text-right">{formatCurrency(scenario.annualSpendUSD)}</td>
                            <td className="px-3 py-2 body-sm text-muted-foreground text-right">{scenario.inefficiencyRate}</td>
                            <td className="px-3 py-2 body-sm text-accent font-medium text-right">{formatCurrency(scenario.potentialSavingsUSD)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.section>

                {/* Audience Copy Tabs */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="label text-muted-foreground mb-4">Summary</h4>
                  
                  {/* Tab Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setActiveTab('technical')}
                      className={`px-4 py-2 rounded-lg body-sm transition-colors ${
                        activeTab === 'technical' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Technical
                    </button>
                    <button
                      onClick={() => setActiveTab('business')}
                      className={`px-4 py-2 rounded-lg body-sm transition-colors ${
                        activeTab === 'business' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Business
                    </button>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-lg bg-secondary/30 border border-border/30"
                    >
                      <p className="body-base text-foreground">
                        {activeTab === 'technical' 
                          ? project.audienceCopy.technicalRecruiter 
                          : project.audienceCopy.businessStakeholder
                        }
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </motion.section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const HackathonScene = ({ content }: HackathonSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <section ref={containerRef} className="scene py-32 bg-background" id="hackathon">
      <div className="scene-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <motion.span 
            className="label text-accent mb-4 block"
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
          <HackathonCard 
            project={content.project}
            onOpen={openDrawer}
          />
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
            {content.cta.prefix}{' '}
            <a 
              href={content.cta.href} 
              className="link-underline text-foreground font-medium" 
              data-cursor="Connect"
            >
              {content.cta.linkText}
            </a>
          </p>
        </motion.div>
      </div>

      {/* Hackathon drawer - portaled to body to escape transform context */}
      {typeof document !== 'undefined' && createPortal(
        <HackathonDrawer 
          project={content.project} 
          isOpen={isDrawerOpen} 
          onClose={closeDrawer}
        />,
        document.body
      )}
    </section>
  );
};

export default HackathonScene;
