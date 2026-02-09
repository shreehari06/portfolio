# Portfolio

Portfolio website built with Vite, React, TypeScript, and Tailwind CSS.

## Local setup

**Requirements:** Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

```sh
# Clone the repository
git clone git@github.com:shreehari06/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the site.

## Build

```sh
npm run build
npm run preview   # preview production build locally
```

## Deploy (GitHub Pages)

The site is deployed automatically via GitHub Actions when you push to `main`.

1. In the repo go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Pushes to `main` will build and deploy to:
   **https://shreehari06.github.io/portfolio/**

## Tech stack

- Vite · TypeScript · React · React Router
- Tailwind CSS · shadcn/ui · Framer Motion
