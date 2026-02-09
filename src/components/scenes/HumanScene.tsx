import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Music, Book, Mountain, Coffee, LucideIcon } from 'lucide-react';
import type { HumanContent } from '@/content/schema';

interface HumanSceneProps {
  content: HumanContent;
}

// Icon mapping from string to component
const iconMap: Record<string, LucideIcon> = {
  Mountain,
  Book,
  Music,
  Coffee,
};

const HumanScene = ({ content }: HumanSceneProps) => {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref} className="scene py-32 bg-secondary/20" id="human">
      <div className="scene-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <span className="label text-primary mb-4 block">{content.label}</span>
          <h2 className="heading-xl">
            {content.headlinePart1}{' '}
            <span className="text-accent-gradient">{content.headlineAccent}</span>
          </h2>
          <p className="body-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.interests.map((interest, index) => {
            const Icon = iconMap[interest.icon] || Mountain;
            return (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group"
              >
                <div className="card-glass p-6 h-full hover-lift transition-all duration-500 group-hover:border-primary/30 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="heading-md mb-3 group-hover:text-primary transition-colors duration-300">
                    {interest.title}
                  </h3>
                  <p className="body-sm text-muted-foreground">
                    {interest.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Personal note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="body-base text-muted-foreground italic">
            "{content.closingQuote}"
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HumanScene;