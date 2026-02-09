import { describe, it, expect } from 'vitest';
import {
  content,
  site,
  hero,
  cinematicTransition,
  philosophy,
  capabilities,
  selectedWork,
  hackathonSpotlight,
  experience,
  human,
  contact,
  links,
  navigation,
  seo,
} from '@/content';

describe('Content Module', () => {
  describe('Site Info', () => {
    it('should have required site properties', () => {
      expect(site.name).toBeDefined();
      expect(site.title).toBeDefined();
      expect(site.location).toBeDefined();
      expect(site.shortIntro).toBeDefined();
    });

    it('should have non-empty site values', () => {
      expect(site.name.length).toBeGreaterThan(0);
      expect(site.title.length).toBeGreaterThan(0);
    });
  });

  describe('Hero Content', () => {
    it('should have all required hero properties', () => {
      expect(hero.label).toBeDefined();
      expect(hero.headlinePart1).toBeDefined();
      expect(hero.headlineAccent).toBeDefined();
      expect(hero.subheadline).toBeDefined();
      expect(hero.scrollIndicator).toBeDefined();
    });

    it('should have valid CTA buttons', () => {
      expect(hero.primaryCta).toBeDefined();
      expect(hero.primaryCta.text).toBeDefined();
      expect(hero.primaryCta.href).toBeDefined();
      expect(hero.primaryCta.cursorLabel).toBeDefined();

      expect(hero.secondaryCta).toBeDefined();
      expect(hero.secondaryCta.text).toBeDefined();
      expect(hero.secondaryCta.href).toBeDefined();
    });
  });

  describe('Cinematic Transition', () => {
    it('should have both lines defined', () => {
      expect(cinematicTransition.line1).toBeDefined();
      expect(cinematicTransition.line2).toBeDefined();
      expect(cinematicTransition.line1.length).toBeGreaterThan(0);
      expect(cinematicTransition.line2.length).toBeGreaterThan(0);
    });
  });

  describe('Philosophy Content', () => {
    it('should have required philosophy properties', () => {
      expect(philosophy.label).toBeDefined();
      expect(philosophy.headlinePart1).toBeDefined();
      expect(philosophy.headlineAccent).toBeDefined();
      expect(philosophy.principles).toBeDefined();
      expect(philosophy.quote).toBeDefined();
    });

    it('should have at least one principle', () => {
      expect(philosophy.principles.length).toBeGreaterThan(0);
    });

    it('should have valid principle structure', () => {
      philosophy.principles.forEach((principle) => {
        expect(principle.number).toBeDefined();
        expect(principle.title).toBeDefined();
        expect(principle.description).toBeDefined();
      });
    });

    it('should have valid quote structure', () => {
      expect(philosophy.quote.text).toBeDefined();
      expect(philosophy.quote.author).toBeDefined();
    });
  });

  describe('Capabilities Content', () => {
    it('should have required capabilities properties', () => {
      expect(capabilities.label).toBeDefined();
      expect(capabilities.headlinePart1).toBeDefined();
      expect(capabilities.headlineAccent).toBeDefined();
      expect(capabilities.groups).toBeDefined();
      expect(capabilities.closingStatement).toBeDefined();
    });

    it('should have at least one capability group', () => {
      expect(capabilities.groups.length).toBeGreaterThan(0);
    });

    it('should have valid capability group structure', () => {
      capabilities.groups.forEach((group) => {
        expect(group.category).toBeDefined();
        expect(group.description).toBeDefined();
        expect(group.skills).toBeDefined();
        expect(group.skills.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Selected Work Content', () => {
    it('should have required selectedWork properties', () => {
      expect(selectedWork.label).toBeDefined();
      expect(selectedWork.headlinePart1).toBeDefined();
      expect(selectedWork.description).toBeDefined();
      expect(selectedWork.projects).toBeDefined();
      expect(selectedWork.productContext).toBeDefined();
    });

    it('should have at least one project', () => {
      expect(selectedWork.projects.length).toBeGreaterThan(0);
    });

    it('should have valid project structure', () => {
      selectedWork.projects.forEach((project) => {
        expect(project.title).toBeDefined();
        expect(project.description).toBeDefined();
        expect(project.tags).toBeDefined();
        expect(project.status).toBeDefined();
        expect(project.caseStudy).toBeDefined();
      });
    });

    it('should have valid drawer labels', () => {
      expect(selectedWork.drawerLabels.internalProject).toBeDefined();
      expect(selectedWork.drawerLabels.context).toBeDefined();
      expect(selectedWork.drawerLabels.whatIOwned).toBeDefined();
      expect(selectedWork.drawerLabels.technicalHighlights).toBeDefined();
      expect(selectedWork.drawerLabels.technologies).toBeDefined();
    });
  });

  describe('Hackathon Spotlight Content', () => {
    it('should have required hackathon properties', () => {
      expect(hackathonSpotlight.label).toBeDefined();
      expect(hackathonSpotlight.headlinePart1).toBeDefined();
      expect(hackathonSpotlight.description).toBeDefined();
      expect(hackathonSpotlight.project).toBeDefined();
      expect(hackathonSpotlight.cta).toBeDefined();
    });

    it('should have valid hackathon project structure', () => {
      const project = hackathonSpotlight.project;
      expect(project.title).toBeDefined();
      expect(project.description).toBeDefined();
      expect(project.techStack).toBeDefined();
      expect(project.techStack.length).toBeGreaterThan(0);
      expect(project.keyFeatures).toBeDefined();
      expect(project.impactPotential).toBeDefined();
      expect(project.audienceCopy).toBeDefined();
    });

    it('should have valid impact potential structure', () => {
      const impact = hackathonSpotlight.project.impactPotential;
      expect(impact.disclaimer).toBeDefined();
      expect(impact.valueProposition).toBeDefined();
      expect(impact.scenarios).toBeDefined();
      expect(impact.scenarios.length).toBeGreaterThan(0);
    });
  });

  describe('Experience Content', () => {
    it('should have required experience properties', () => {
      expect(experience.label).toBeDefined();
      expect(experience.headlinePart1).toBeDefined();
      expect(experience.metrics).toBeDefined();
      expect(experience.timeline).toBeDefined();
    });

    it('should have at least one timeline item', () => {
      expect(experience.timeline.length).toBeGreaterThan(0);
    });

    it('should have valid timeline item structure', () => {
      experience.timeline.forEach((item) => {
        expect(item.period).toBeDefined();
        expect(item.role).toBeDefined();
        expect(item.company).toBeDefined();
        expect(item.impact).toBeDefined();
      });
    });
  });

  describe('Human Content', () => {
    it('should have required human properties', () => {
      expect(human.label).toBeDefined();
      expect(human.headlinePart1).toBeDefined();
      expect(human.description).toBeDefined();
      expect(human.interests).toBeDefined();
    });

    it('should have at least one interest', () => {
      expect(human.interests.length).toBeGreaterThan(0);
    });

    it('should have valid interest structure', () => {
      human.interests.forEach((interest) => {
        expect(interest.icon).toBeDefined();
        expect(interest.title).toBeDefined();
        expect(interest.description).toBeDefined();
      });
    });
  });

  describe('Contact Content', () => {
    it('should have required contact properties', () => {
      expect(contact.label).toBeDefined();
      expect(contact.headlinePart1).toBeDefined();
      expect(contact.description).toBeDefined();
      expect(contact.primaryCta).toBeDefined();
      expect(contact.footer).toBeDefined();
    });

    it('should have valid footer structure', () => {
      expect(contact.footer.credit).toBeDefined();
      expect(contact.footer.copyright).toBeDefined();
    });
  });

  describe('Links', () => {
    it('should have all required links', () => {
      expect(links.email).toBeDefined();
      expect(links.github).toBeDefined();
      expect(links.linkedin).toBeDefined();
      expect(links.resumeUrl).toBeDefined();
    });

    it('should have valid email format', () => {
      expect(links.email).toMatch(/@/);
    });

    it('should have valid URL formats', () => {
      expect(links.github).toMatch(/^https?:\/\//);
      expect(links.linkedin).toMatch(/^https?:\/\//);
    });
  });

  describe('Navigation', () => {
    it('should have cursor labels', () => {
      expect(navigation.cursorLabels).toBeDefined();
      expect(navigation.cursorLabels.email).toBeDefined();
      expect(navigation.cursorLabels.github).toBeDefined();
      expect(navigation.cursorLabels.linkedin).toBeDefined();
    });

    it('should have navigation sections', () => {
      expect(navigation.sections).toBeDefined();
      expect(navigation.sections.length).toBeGreaterThan(0);
    });

    it('should have valid section structure', () => {
      navigation.sections.forEach((section) => {
        expect(section.id).toBeDefined();
        expect(section.label).toBeDefined();
      });
    });
  });

  describe('SEO Content', () => {
    it('should have all required SEO properties', () => {
      expect(seo.title).toBeDefined();
      expect(seo.description).toBeDefined();
      expect(seo.ogTitle).toBeDefined();
      expect(seo.ogDescription).toBeDefined();
    });

    it('should have appropriate length for SEO fields', () => {
      expect(seo.title.length).toBeLessThanOrEqual(70);
      expect(seo.description.length).toBeLessThanOrEqual(160);
    });
  });

  describe('Full Content Object', () => {
    it('should have all top-level sections', () => {
      expect(content.site).toBeDefined();
      expect(content.hero).toBeDefined();
      expect(content.cinematicTransition).toBeDefined();
      expect(content.philosophy).toBeDefined();
      expect(content.capabilities).toBeDefined();
      expect(content.selectedWork).toBeDefined();
      expect(content.hackathonSpotlight).toBeDefined();
      expect(content.experience).toBeDefined();
      expect(content.human).toBeDefined();
      expect(content.contact).toBeDefined();
      expect(content.links).toBeDefined();
      expect(content.navigation).toBeDefined();
      expect(content.seo).toBeDefined();
    });
  });
});
