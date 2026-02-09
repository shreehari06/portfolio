import { z } from 'zod';
import contentJson from './content.json';
import type { PortfolioContent } from './schema';

// Zod schemas for runtime validation

const CtaButtonSchema = z.object({
  text: z.string(),
  href: z.string(),
  cursorLabel: z.string(),
});

const HeroSchema = z.object({
  label: z.string(),
  headlinePart1: z.string(),
  headlineAccent: z.string(),
  subheadline: z.string(),
  primaryCta: CtaButtonSchema,
  secondaryCta: CtaButtonSchema,
  scrollIndicator: z.string(),
});

const CinematicTransitionSchema = z.object({
  line1: z.string(),
  line2: z.string(),
});

const PrincipleSchema = z.object({
  number: z.string(),
  title: z.string(),
  description: z.string(),
});

const QuoteSchema = z.object({
  text: z.string(),
  author: z.string(),
});

const PhilosophySchema = z.object({
  label: z.string(),
  headlinePart1: z.string(),
  headlineAccent: z.string(),
  principles: z.array(PrincipleSchema),
  quote: QuoteSchema,
});

const CapabilityGroupSchema = z.object({
  category: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
});

const ClosingStatementSchema = z.object({
  prefix: z.string(),
  highlight: z.string(),
  suffix: z.string(),
});

const CapabilitiesSchema = z.object({
  label: z.string(),
  headlinePart1: z.string(),
  headlineAccent: z.string(),
  groups: z.array(CapabilityGroupSchema),
  closingStatement: ClosingStatementSchema,
});

const CaseStudySchema = z.object({
  context: z.string(),
  whatIOwned: z.array(z.string()),
  technicalHighlights: z.array(z.string()),
});

const ProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  status: z.string(),
  statusLabel: z.string(),
  caseStudy: CaseStudySchema,
});

const ProductContextSchema = z.object({
  suite: z.string(),
  product: z.string(),
  publicInfoUrl: z.string(),
  publicLinkLabel: z.string(),
  publicContextLabel: z.string(),
  publicContextTooltip: z.string(),
  publicContextDisclaimer: z.string(),
  publicSummary: z.string(),
});

const CollaborationCtaSchema = z.object({
  prefix: z.string(),
  linkText: z.string(),
  href: z.string(),
});

const DrawerLabelsSchema = z.object({
  internalProject: z.string(),
  context: z.string(),
  whatIOwned: z.string(),
  technicalHighlights: z.string(),
  technologies: z.string(),
});

const SelectedWorkSchema = z.object({
  label: z.string(),
  headlinePart1: z.string(),
  headlineAccent: z.string(),
  description: z.string(),
  productContext: ProductContextSchema,
  projects: z.array(ProjectSchema),
  collaborationCta: CollaborationCtaSchema,
  drawerLabels: DrawerLabelsSchema,
});

// Hackathon schemas
const ImpactScenarioSchema = z.object({
  scenario: z.string(),
  annualSpendUSD: z.number(),
  inefficiencyRate: z.string(),
  potentialSavingsUSD: z.number(),
});

const ImpactPotentialSchema = z.object({
  disclaimer: z.string(),
  valueProposition: z.array(z.string()),
  scenarios: z.array(ImpactScenarioSchema),
});

const AudienceCopySchema = z.object({
  technicalRecruiter: z.string(),
  businessStakeholder: z.string(),
});

const HackathonProjectSchema = z.object({
  title: z.string(),
  status: z.string(),
  statusLabel: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  oneLiner: z.string(),
  overview: z.string(),
  keyFeatures: z.array(z.string()),
  impactPotential: ImpactPotentialSchema,
  audienceCopy: AudienceCopySchema,
});

const HackathonCtaSchema = z.object({
  prefix: z.string(),
  linkText: z.string(),
  href: z.string(),
});

const HackathonSpotlightSchema = z.object({
  label: z.string(),
  headlinePart1: z.string(),
  headlineAccent: z.string(),
  description: z.string(),
  project: HackathonProjectSchema,
  cta: HackathonCtaSchema,
});

const ExperienceMetricSchema = z.object({
  metric: z.string(),
  label: z.string(),
  description: z.string(),
});

const TimelineItemSchema = z.object({
  period: z.string(),
  role: z.string(),
  company: z.string(),
  impact: z.string(),
});

const ExperienceSchema = z.object({
  label: z.string(),
  headlinePart1: z.string(),
  headlineAccent: z.string(),
  metrics: z.array(ExperienceMetricSchema),
  timeline: z.array(TimelineItemSchema),
});

const InterestSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

const HumanSchema = z.object({
  label: z.string(),
  headlinePart1: z.string(),
  headlineAccent: z.string(),
  description: z.string(),
  interests: z.array(InterestSchema),
  closingQuote: z.string(),
});

const FooterSchema = z.object({
  credit: z.string(),
  copyright: z.string(),
});

const ContactSchema = z.object({
  label: z.string(),
  headlinePart1: z.string(),
  headlineAccent: z.string(),
  description: z.string(),
  primaryCta: z.string(),
  footer: FooterSchema,
});

const LinksSchema = z.object({
  email: z.string(),
  github: z.string(),
  githubDisplay: z.string(),
  linkedin: z.string(),
  linkedinDisplay: z.string(),
  resumeUrl: z.string(),
});

const CursorLabelsSchema = z.object({
  email: z.string(),
  github: z.string(),
  linkedin: z.string(),
  resume: z.string(),
  lightMode: z.string(),
  darkMode: z.string(),
});

const NavigationSectionSchema = z.object({
  id: z.string(),
  label: z.string(),
});

const NavigationSchema = z.object({
  cursorLabels: CursorLabelsSchema,
  sections: z.array(NavigationSectionSchema),
});

const SeoSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
});

const SiteInfoSchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  shortIntro: z.string(),
});

const PortfolioContentSchema = z.object({
  site: SiteInfoSchema,
  hero: HeroSchema,
  cinematicTransition: CinematicTransitionSchema,
  philosophy: PhilosophySchema,
  capabilities: CapabilitiesSchema,
  selectedWork: SelectedWorkSchema,
  hackathonSpotlight: HackathonSpotlightSchema,
  experience: ExperienceSchema,
  human: HumanSchema,
  contact: ContactSchema,
  links: LinksSchema,
  navigation: NavigationSchema,
  seo: SeoSchema,
});

// Validate and export the content
const parseResult = PortfolioContentSchema.safeParse(contentJson);

if (!parseResult.success) {
  console.error('Content validation failed:', parseResult.error.format());
  throw new Error(
    `Content validation failed. Check src/content/content.json for errors:\n${JSON.stringify(parseResult.error.format(), null, 2)}`
  );
}

// Cast to PortfolioContent after successful Zod validation
export const content = parseResult.data as PortfolioContent;

// Export individual sections for convenience
export const site = content.site;
export const hero = content.hero;
export const cinematicTransition = content.cinematicTransition;
export const philosophy = content.philosophy;
export const capabilities = content.capabilities;
export const selectedWork = content.selectedWork;
export const hackathonSpotlight = content.hackathonSpotlight;
export const experience = content.experience;
export const human = content.human;
export const contact = content.contact;
export const links = content.links;
export const navigation = content.navigation;
export const seo = content.seo;