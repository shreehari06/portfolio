import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { 
  hero, 
  philosophy, 
  capabilities, 
  selectedWork, 
  hackathonSpotlight, 
  experience, 
  human, 
  contact, 
  links,
} from '@/content';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
  useSpring: (value: any) => value,
  useMotionValue: (value: any) => ({ get: () => value, set: () => {} }),
  useMotionValueEvent: () => {},
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
window.IntersectionObserver = mockIntersectionObserver;

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Import scenes after mocks
import HeroScene from '@/components/scenes/HeroScene';
import PhilosophyScene from '@/components/scenes/PhilosophyScene';
import CapabilitiesScene from '@/components/scenes/CapabilitiesScene';
import WorkScene from '@/components/scenes/WorkScene';
import HackathonScene from '@/components/scenes/HackathonScene';
import ExperienceScene from '@/components/scenes/ExperienceScene';
import HumanScene from '@/components/scenes/HumanScene';
import ContactScene from '@/components/scenes/ContactScene';

describe('Scene Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('HeroScene', () => {
    it('should render hero content', () => {
      const { getByText } = render(<HeroScene content={hero} />);
      
      expect(getByText(hero.headlinePart1)).toBeInTheDocument();
      expect(getByText(hero.headlineAccent)).toBeInTheDocument();
    });

    it('should render CTA buttons', () => {
      const { getByText } = render(<HeroScene content={hero} />);
      
      expect(getByText(hero.primaryCta.text)).toBeInTheDocument();
      expect(getByText(hero.secondaryCta.text)).toBeInTheDocument();
    });

    it('should have correct section id', () => {
      const { container } = render(<HeroScene content={hero} />);
      
      expect(container.querySelector('#hero')).toBeInTheDocument();
    });
  });

  describe('PhilosophyScene', () => {
    it('should render philosophy content', () => {
      const { getByText } = render(<PhilosophyScene content={philosophy} />);
      
      expect(getByText(philosophy.label)).toBeInTheDocument();
      expect(getByText(philosophy.headlinePart1)).toBeInTheDocument();
    });

    it('should render all principles', () => {
      const { getByText } = render(<PhilosophyScene content={philosophy} />);
      
      philosophy.principles.forEach((principle) => {
        expect(getByText(principle.title)).toBeInTheDocument();
      });
    });

    it('should render quote', () => {
      const { getByText } = render(<PhilosophyScene content={philosophy} />);
      
      expect(getByText(`"${philosophy.quote.text}"`)).toBeInTheDocument();
      expect(getByText(`— ${philosophy.quote.author}`)).toBeInTheDocument();
    });
  });

  describe('CapabilitiesScene', () => {
    it('should render capabilities content', () => {
      const { getByText } = render(<CapabilitiesScene content={capabilities} />);
      
      expect(getByText(capabilities.label)).toBeInTheDocument();
    });

    it('should render all capability groups', () => {
      const { getByText } = render(<CapabilitiesScene content={capabilities} />);
      
      capabilities.groups.forEach((group) => {
        expect(getByText(group.category)).toBeInTheDocument();
      });
    });

    it('should render skills', () => {
      const { getByText } = render(<CapabilitiesScene content={capabilities} />);
      
      // Check at least first skill from first group
      const firstSkill = capabilities.groups[0].skills[0];
      expect(getByText(firstSkill)).toBeInTheDocument();
    });
  });

  describe('WorkScene', () => {
    it('should render work content', () => {
      const { getByText } = render(<WorkScene content={selectedWork} />);
      
      expect(getByText(selectedWork.label)).toBeInTheDocument();
    });

    it('should render all projects', () => {
      const { getByText } = render(<WorkScene content={selectedWork} />);
      
      selectedWork.projects.forEach((project) => {
        expect(getByText(project.title)).toBeInTheDocument();
      });
    });

    it('should have correct section id', () => {
      const { container } = render(<WorkScene content={selectedWork} />);
      
      expect(container.querySelector('#work')).toBeInTheDocument();
    });
  });

  describe('HackathonScene', () => {
    it('should render hackathon content', () => {
      const { getByText } = render(<HackathonScene content={hackathonSpotlight} />);
      
      expect(getByText(hackathonSpotlight.label)).toBeInTheDocument();
    });

    it('should render project title', () => {
      const { getByText } = render(<HackathonScene content={hackathonSpotlight} />);
      
      expect(getByText(hackathonSpotlight.project.title)).toBeInTheDocument();
    });

    it('should render tech stack', () => {
      const { getByText } = render(<HackathonScene content={hackathonSpotlight} />);
      
      hackathonSpotlight.project.techStack.forEach((tech) => {
        expect(getByText(tech)).toBeInTheDocument();
      });
    });
  });

  describe('ExperienceScene', () => {
    it('should render experience content', () => {
      const { getByText } = render(<ExperienceScene content={experience} />);
      
      expect(getByText(experience.label)).toBeInTheDocument();
    });

    it('should render timeline items', () => {
      const { getByText } = render(<ExperienceScene content={experience} />);
      
      experience.timeline.forEach((item) => {
        expect(getByText(item.role)).toBeInTheDocument();
        expect(getByText(item.company)).toBeInTheDocument();
      });
    });

    it('should render metrics', () => {
      const { getByText } = render(<ExperienceScene content={experience} />);
      
      experience.metrics.forEach((metric) => {
        expect(getByText(metric.metric)).toBeInTheDocument();
      });
    });
  });

  describe('HumanScene', () => {
    it('should render human content', () => {
      const { getByText } = render(<HumanScene content={human} />);
      
      expect(getByText(human.label)).toBeInTheDocument();
    });

    it('should render interests', () => {
      const { getByText } = render(<HumanScene content={human} />);
      
      human.interests.forEach((interest) => {
        expect(getByText(interest.title)).toBeInTheDocument();
      });
    });
  });

  describe('ContactScene', () => {
    it('should render contact content', () => {
      const { getByText } = render(<ContactScene content={contact} links={links} />);
      
      expect(getByText(contact.label)).toBeInTheDocument();
    });

    it('should render primary CTA', () => {
      const { getByText } = render(<ContactScene content={contact} links={links} />);
      
      expect(getByText(contact.primaryCta)).toBeInTheDocument();
    });

    it('should render footer', () => {
      const { getByText } = render(<ContactScene content={contact} links={links} />);
      
      expect(getByText(contact.footer.credit)).toBeInTheDocument();
    });
  });
});
