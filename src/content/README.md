# Portfolio Content

This folder contains all text content for the portfolio site.

## Files

- **content.json** — The single source of truth for all copy
- **schema.ts** — TypeScript interfaces for type safety
- **index.ts** — Runtime validation with Zod + exports

## How to Edit Content

1. Open `content.json`
2. Edit the text values you want to change
3. Save the file
4. The site will hot-reload with your changes

## Content Structure

### `site`
Basic info: name, title, location, short intro.

### `hero`
Hero section: headline, subheadline, CTA buttons.

### `cinematicTransition`
The signature two-line reveal between hero and philosophy sections.

### `philosophy`
Your approach: numbered principles and a closing quote.

### `capabilities`
Skills grouped by category with descriptions.

### `selectedWork`
Project placeholders with status labels. Use `status: "coming_soon"` for WIP.

### `experience`
Metrics (years, users, etc.) and timeline of roles.

### `human`
Personal interests/hobbies that add dimension.

### `contact`
CTA section and footer text.

### `links`
All external links: email, GitHub, LinkedIn, resume URL.

### `navigation`
Cursor labels shown on hover.

### `seo`
Meta tags: title, description, Open Graph.

## Validation

Content is validated at runtime using Zod. If you make a structural error (wrong type, missing field), you'll see a clear error in the console.

## Adding New Sections

1. Add the new content to `content.json`
2. Add TypeScript interface in `schema.ts`
3. Add Zod schema in `index.ts`
4. Export the new section from `index.ts`
5. Import in your component: `import { newSection } from '@/content'`

## Tips

- Keep headlines concise and impactful
- Use placeholder projects with confident copy like "Case study in progress"
- The `statusLabel` field controls what displays on project cards
- All icons in the "human" section must match Lucide icon names
