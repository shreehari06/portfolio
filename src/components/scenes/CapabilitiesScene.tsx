import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState } from 'react';
import { ChevronRight, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import type { CapabilitiesContent } from '@/content/schema';

interface CapabilitiesSceneProps {
  content: CapabilitiesContent;
}

const CapabilitiesScene = ({ content }: CapabilitiesSceneProps) => {
  const { ref } = useScrollAnimation({ threshold: 0.15 });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="scene py-32 scroll-mt-20" id="capabilities">
      <div className="scene-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <span className="label text-primary mb-4 block">{content.label}</span>
          <h2 className="heading-xl">
            {content.headlinePart1}{' '}
            <span className="text-accent-gradient">{content.headlineAccent}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {content.groups.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.7, 
                delay: groupIndex * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
              onMouseEnter={() => setExpandedIndex(groupIndex)}
              onMouseLeave={() => setExpandedIndex(null)}
            >
              <motion.div 
                className="card-elevated p-8 h-full cursor-pointer transition-all duration-500 group-hover:border-primary/40 overflow-hidden"
                animate={{ 
                  scale: expandedIndex === groupIndex ? 1.02 : 1,
                  boxShadow: expandedIndex === groupIndex 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Category header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="label text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    {group.category}
                  </h3>
                  <motion.div
                    animate={{ 
                      rotate: expandedIndex === groupIndex ? 90 : 0,
                      opacity: expandedIndex === groupIndex ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </motion.div>
                </div>

                {/* Skills with hover-driven stagger */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: groupIndex * 0.1 + skillIndex * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-full body-sm cursor-default transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                      data-cursor="Skill"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>

                {/* Expandable description */}
                <div className="overflow-hidden">
                  <AnimatePresence initial={false}>
                    {expandedIndex === groupIndex && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: 1, 
                          height: 'auto',
                          transition: {
                            height: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                            opacity: { duration: 0.2, delay: 0.1 },
                          },
                        }}
                        exit={{ 
                          opacity: 0, 
                          height: 0,
                          transition: {
                            height: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
                            opacity: { duration: 0.15 },
                          },
                        }}
                      >
                        <p className="body-sm text-muted-foreground border-t border-border/50 pt-4 mt-2 pb-1">
                          {group.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Verified Certifications Card */}
        {content.certifications && content.certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-5xl mx-auto mt-8"
          >
            {content.certifications.map((cert) => (
              <div
                key={cert.title}
                className="card-elevated p-6 sm:p-8 border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card hover:border-primary/40 transition-all duration-500 hover-lift rounded-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 text-primary">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          <ShieldCheck className="w-3 h-3" />
                          {cert.issuer} Verified
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          ID: {cert.verificationId.slice(0, 8)}...
                        </span>
                      </div>
                      <h3 className="heading-sm font-semibold text-foreground mb-1">
                        {cert.title}
                      </h3>
                      <p className="body-sm text-muted-foreground max-w-2xl">
                        {cert.description}
                      </p>
                    </div>
                  </div>

                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-secondary/80 hover:bg-primary hover:text-primary-foreground text-foreground text-sm font-medium transition-all duration-300 flex-shrink-0 border border-border/50 hover:border-primary/40 group"
                    data-cursor="Credly Badge"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            {content.closingStatement.prefix}{' '}
            <span className="text-foreground font-medium">{content.closingStatement.highlight}</span>
            {content.closingStatement.suffix}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CapabilitiesScene;