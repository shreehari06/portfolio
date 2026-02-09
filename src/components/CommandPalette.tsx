import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command as CommandPrimitive } from 'cmdk';
import { 
  Search, 
  Sun, 
  Moon, 
  Mail, 
  Github, 
  Linkedin,
  Sparkles,
  Briefcase,
  Code2,
  User,
  MessageSquare,
  Layers,
  Home,
  Trophy
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import type { Links } from '@/content/schema';
import { useCommandPalette } from './CommandPaletteContext';

interface CommandPaletteProps {
  links: Links;
}

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  group: 'navigation' | 'actions';
}

const CommandPalette = ({ links }: CommandPaletteProps) => {
  const { isOpen, close, toggle } = useCommandPalette();
  const [search, setSearch] = useState('');
  const { theme, setTheme } = useTheme();

  // Keyboard shortcut handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, close, toggle]);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    close();
  }, [close]);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(links.email);
    toast.success('Email copied to clipboard');
    close();
  }, [links.email, close]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    close();
  }, [theme, setTheme, close]);

  const openLink = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    close();
  }, [close]);

  const commands: CommandItem[] = [
    // Navigation
    { id: 'hero', label: 'Go to Hero', icon: <Home className="w-4 h-4" />, action: () => scrollToSection('hero'), group: 'navigation' },
    { id: 'philosophy', label: 'Go to Philosophy', icon: <Sparkles className="w-4 h-4" />, action: () => scrollToSection('philosophy'), group: 'navigation' },
    { id: 'capabilities', label: 'Go to Capabilities', icon: <Code2 className="w-4 h-4" />, action: () => scrollToSection('capabilities'), group: 'navigation' },
    { id: 'work', label: 'Go to Selected Work', icon: <Briefcase className="w-4 h-4" />, action: () => scrollToSection('work'), group: 'navigation' },
    { id: 'hackathon', label: 'Go to Hackathon Spotlight', icon: <Sparkles className="w-4 h-4" />, action: () => scrollToSection('hackathon'), group: 'navigation' },
    { id: 'experience', label: 'Go to Experience', icon: <Layers className="w-4 h-4" />, action: () => scrollToSection('experience'), group: 'navigation' },
    { id: 'human', label: 'Go to Beyond Code', icon: <User className="w-4 h-4" />, action: () => scrollToSection('human'), group: 'navigation' },
    { id: 'contact', label: 'Go to Contact', icon: <MessageSquare className="w-4 h-4" />, action: () => scrollToSection('contact'), group: 'navigation' },
    // Actions
    { id: 'theme', label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode', icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, shortcut: 'T', action: toggleTheme, group: 'actions' },
    { id: 'email', label: 'Copy Email', icon: <Mail className="w-4 h-4" />, shortcut: 'E', action: copyEmail, group: 'actions' },
    { id: 'github', label: 'Open GitHub', icon: <Github className="w-4 h-4" />, shortcut: 'G', action: () => openLink(links.github), group: 'actions' },
    { id: 'linkedin', label: 'Open LinkedIn', icon: <Linkedin className="w-4 h-4" />, shortcut: 'L', action: () => openLink(links.linkedin), group: 'actions' },
  ];

  const navigationCommands = commands.filter(c => c.group === 'navigation');
  const actionCommands = commands.filter(c => c.group === 'actions');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            aria-hidden="true"
          />

          {/* Command Dialog */}
          <motion.div
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="mx-4 overflow-hidden rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
              <CommandPrimitive
                className="flex h-full w-full flex-col"
                loop
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    close();
                  }
                }}
              >
                {/* Search Input */}
                <div className="flex items-center border-b border-border/50 px-4" cmdk-input-wrapper="">
                  <Search className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
                  <CommandPrimitive.Input
                    className="flex h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type a command or search..."
                    value={search}
                    onValueChange={setSearch}
                    autoFocus
                  />
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border/50 bg-muted/50 px-2 font-mono text-xs text-muted-foreground">
                    esc
                  </kbd>
                </div>

                {/* Command List */}
                <CommandPrimitive.List className="max-h-[360px] overflow-y-auto overflow-x-hidden p-2">
                  <CommandPrimitive.Empty className="py-8 text-center text-sm text-muted-foreground">
                    No results found.
                  </CommandPrimitive.Empty>

                  {/* Navigation Group */}
                  <CommandPrimitive.Group heading="Navigation" className="px-1">
                    <p className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Navigation
                    </p>
                    {navigationCommands.map((command) => (
                      <CommandPrimitive.Item
                        key={command.id}
                        value={command.label}
                        onSelect={command.action}
                        className="relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-3 text-sm outline-none transition-colors data-[selected=true]:bg-secondary/80 data-[selected=true]:text-foreground hover:bg-secondary/50"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50 text-muted-foreground group-data-[selected=true]:text-foreground">
                          {command.icon}
                        </span>
                        <span className="flex-1">{command.label}</span>
                      </CommandPrimitive.Item>
                    ))}
                  </CommandPrimitive.Group>

                  {/* Separator */}
                  <div className="my-2 h-px bg-border/50" />

                  {/* Actions Group */}
                  <CommandPrimitive.Group heading="Actions" className="px-1">
                    <p className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </p>
                    {actionCommands.map((command) => (
                      <CommandPrimitive.Item
                        key={command.id}
                        value={command.label}
                        onSelect={command.action}
                        className="relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-3 text-sm outline-none transition-colors data-[selected=true]:bg-secondary/80 data-[selected=true]:text-foreground hover:bg-secondary/50"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50 text-muted-foreground">
                          {command.icon}
                        </span>
                        <span className="flex-1">{command.label}</span>
                        {command.shortcut && (
                          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border/50 bg-muted/50 px-2 font-mono text-xs text-muted-foreground">
                            {command.shortcut}
                          </kbd>
                        )}
                      </CommandPrimitive.Item>
                    ))}
                  </CommandPrimitive.Group>
                </CommandPrimitive.List>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border/50 px-4 py-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <kbd className="inline-flex h-5 items-center rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px]">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="inline-flex h-5 items-center rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px]">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <kbd className="inline-flex h-5 items-center rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px]">⌘K</kbd>
                    <span>Toggle</span>
                  </div>
                </div>
              </CommandPrimitive>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
