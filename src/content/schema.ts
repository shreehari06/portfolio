// TypeScript interfaces for portfolio content structure
// These types mirror the content.json structure

export interface SiteInfo {
  name: string;
  title: string;
  location: string;
  shortIntro: string;
}

export interface CtaButton {
  text: string;
  href: string;
  cursorLabel: string;
}

export interface HeroContent {
  label: string;
  headlinePart1: string;
  headlineAccent: string;
  subheadline: string;
  primaryCta: CtaButton;
  secondaryCta: CtaButton;
  scrollIndicator: string;
}

export interface CinematicTransitionContent {
  line1: string;
  line2: string;
}

export interface Principle {
  number: string;
  title: string;
  description: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface PhilosophyContent {
  label: string;
  headlinePart1: string;
  headlineAccent: string;
  principles: Principle[];
  quote: Quote;
}

export interface CapabilityGroup {
  category: string;
  description: string;
  skills: string[];
}

export interface ClosingStatement {
  prefix: string;
  highlight: string;
  suffix: string;
}

export interface CapabilitiesContent {
  label: string;
  headlinePart1: string;
  headlineAccent: string;
  groups: CapabilityGroup[];
  closingStatement: ClosingStatement;
}

export interface CaseStudy {
  context: string;
  whatIOwned: string[];
  technicalHighlights: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  status: string;
  statusLabel: string;
  caseStudy: CaseStudy;
}

export interface ProductContext {
  suite: string;
  product: string;
  publicInfoUrl: string;
  publicLinkLabel: string;
  publicContextLabel: string;
  publicContextTooltip: string;
  publicContextDisclaimer: string;
  publicSummary: string;
}

export interface CollaborationCta {
  prefix: string;
  linkText: string;
  href: string;
}

export interface DrawerLabels {
  internalProject: string;
  context: string;
  whatIOwned: string;
  technicalHighlights: string;
  technologies: string;
}

export interface SelectedWorkContent {
  label: string;
  headlinePart1: string;
  headlineAccent: string;
  description: string;
  productContext: ProductContext;
  projects: Project[];
  collaborationCta: CollaborationCta;
  drawerLabels: DrawerLabels;
}

export interface ExperienceMetric {
  metric: string;
  label: string;
  description: string;
}

export interface TimelineItem {
  period: string;
  role: string;
  company: string;
  impact: string;
}

export interface ExperienceContent {
  label: string;
  headlinePart1: string;
  headlineAccent: string;
  metrics: ExperienceMetric[];
  timeline: TimelineItem[];
}

// Hackathon Spotlight types
export interface ImpactScenario {
  scenario: string;
  annualSpendUSD: number;
  inefficiencyRate: string;
  potentialSavingsUSD: number;
}

export interface ImpactPotential {
  disclaimer: string;
  valueProposition: string[];
  scenarios: ImpactScenario[];
}

export interface AudienceCopy {
  technicalRecruiter: string;
  businessStakeholder: string;
}

export interface HackathonProject {
  title: string;
  status: string;
  statusLabel: string;
  description: string;
  techStack: string[];
  oneLiner: string;
  overview: string;
  keyFeatures: string[];
  impactPotential: ImpactPotential;
  audienceCopy: AudienceCopy;
}

export interface HackathonCta {
  prefix: string;
  linkText: string;
  href: string;
}

export interface HackathonSpotlightContent {
  label: string;
  headlinePart1: string;
  headlineAccent: string;
  description: string;
  project: HackathonProject;
  cta: HackathonCta;
}

export interface Interest {
  icon: string;
  title: string;
  description: string;
}

export interface HumanContent {
  label: string;
  headlinePart1: string;
  headlineAccent: string;
  description: string;
  interests: Interest[];
  closingQuote: string;
}

export interface FooterContent {
  credit: string;
  copyright: string;
}

export interface ContactContent {
  label: string;
  headlinePart1: string;
  headlineAccent: string;
  description: string;
  primaryCta: string;
  footer: FooterContent;
}

export interface Links {
  email: string;
  github: string;
  githubDisplay: string;
  linkedin: string;
  linkedinDisplay: string;
  resumeUrl: string;
}

export interface CursorLabels {
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  lightMode: string;
  darkMode: string;
}

export interface NavigationSection {
  id: string;
  label: string;
}

export interface NavigationContent {
  cursorLabels: CursorLabels;
  sections: NavigationSection[];
}

export interface SeoContent {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

export interface PortfolioContent {
  site: SiteInfo;
  hero: HeroContent;
  cinematicTransition: CinematicTransitionContent;
  philosophy: PhilosophyContent;
  capabilities: CapabilitiesContent;
  selectedWork: SelectedWorkContent;
  hackathonSpotlight: HackathonSpotlightContent;
  experience: ExperienceContent;
  human: HumanContent;
  contact: ContactContent;
  links: Links;
  navigation: NavigationContent;
  seo: SeoContent;
}