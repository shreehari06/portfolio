import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, FileText, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Links, CursorLabels } from '@/content/schema';
interface FloatingNavProps {
  links: Links;
  cursorLabels: CursorLabels;
}

const FloatingNav = ({ links, cursorLabels }: FloatingNavProps) => {
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const externalLinks = [
    { icon: Mail, href: `mailto:${links.email}`, label: 'Email', cursor: cursorLabels.email },
    { icon: Github, href: links.github, label: 'GitHub', cursor: cursorLabels.github },
    { icon: Linkedin, href: links.linkedin, label: 'LinkedIn', cursor: cursorLabels.linkedin },
  ];

  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: scrolled ? 1 : 0.6, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="card-glass p-2 flex flex-col gap-1">
        {externalLinks.map(({ icon: Icon, href, label, cursor }) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
            data-cursor={cursor}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
          >
            <Icon className="w-4 h-4" />
          </motion.a>
        ))}
        
        {/* Resume link */}
        <motion.a
          href={links.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
          data-cursor={cursorLabels.resume}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Resume"
        >
          <FileText className="w-4 h-4" />
        </motion.a>
        
        <div className="w-full h-px bg-border/50 my-1" />
        
        <motion.button
          onClick={toggleTheme}
          className="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
          data-cursor={isDark ? cursorLabels.lightMode : cursorLabels.darkMode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default FloatingNav;