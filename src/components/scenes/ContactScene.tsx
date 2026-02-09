import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import type { ContactContent, Links } from '@/content/schema';

interface ContactSceneProps {
  content: ContactContent;
  links: Links;
}

const ContactScene = ({ content, links }: ContactSceneProps) => {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 });

  const socialLinks = [
    { icon: Mail, label: 'Email', href: `mailto:${links.email}`, text: links.email },
    { icon: Github, label: 'GitHub', href: links.github, text: links.githubDisplay },
    { icon: Linkedin, label: 'LinkedIn', href: links.linkedin, text: links.linkedinDisplay },
  ];

  return (
    <section ref={ref} className="scene py-32" id="contact">
      <div className="scene-content text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <span className="label text-primary mb-6 block">{content.label}</span>
          <h2 className="heading-display mb-8">
            {content.headlinePart1}{' '}
            <span className="text-accent-gradient">{content.headlineAccent}</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            {content.description}
          </p>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <a
            href={`mailto:${links.email}`}
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-full heading-md hover-lift hover-glow transition-all duration-300"
            data-cursor="Contact"
          >
            {content.primaryCta}
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              data-cursor="Visit"
            >
              <link.icon className="w-4 h-4" />
              <span className="body-base link-underline">{link.text}</span>
            </a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-32 pt-8 border-t border-border/50"
        >
          <p className="body-sm text-muted-foreground">
            {content.footer.credit}
          </p>
          <p className="body-sm text-text-tertiary mt-2">
            © {new Date().getFullYear()} — {content.footer.copyright}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactScene;