import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { ExperienceContent } from '@/content/schema';

interface ExperienceSceneProps {
  content: ExperienceContent;
}

const ExperienceScene = ({ content }: ExperienceSceneProps) => {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section ref={ref} className="scene py-32" id="experience">
      <div className="scene-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="label text-primary mb-4 block">{content.label}</span>
          <h2 className="heading-xl max-w-3xl">
            {content.headlinePart1}{' '}
            <span className="text-accent-gradient">{content.headlineAccent}</span>
          </h2>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {content.metrics.map((exp, index) => (
            <motion.div
              key={exp.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center lg:text-left"
            >
              <div className="heading-display text-primary mb-2">{exp.metric}</div>
              <div className="heading-md mb-2">{exp.label}</div>
              <div className="body-sm text-muted-foreground">{exp.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {content.timeline.map((item, index) => (
            <motion.div
              key={item.period}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -30 }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
              className="group"
            >
              <div className="card-elevated p-8 hover-lift transition-all duration-500 group-hover:border-primary/30">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="lg:w-48 flex-shrink-0">
                    <span className="label text-muted-foreground">{item.period}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-md mb-1 group-hover:text-primary transition-colors duration-300">
                      {item.role}
                    </h3>
                    <p className="body-base text-muted-foreground mb-4">{item.company}</p>
                    <p className="body-base text-text-secondary">{item.impact}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceScene;