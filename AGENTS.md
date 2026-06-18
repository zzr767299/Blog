# AGENTS.md

Next.js 15 App Router blog (`tailwind-nextjs-starter-blog` v2.4.0). Contentlayer2 + Tailwind CSS v4 + React 19. Chinese-language site (雨泽的Blog). Deployed to GitHub Pages at `zzrblog.eu.cc`.

## Commands

```bash
yarn install          # Yarn 3.6.1, node-modules linker, registry: npmmirror.com
yarn dev              # localhost:3000
yarn build            # build + RSS postbuild (scripts/postbuild.mjs)
yarn lint             # ESLint --fix on app/components/lib/layouts/scripts
yarn serve            # production server
```

**Windows**: `start-dev.bat` exists, or set `$env:PWD = $(Get-Location).Path` before `yarn dev`/`yarn build` (scripts use `INIT_CWD=$PWD` via cross-env).

**Static export**: `EXPORT=1 UNOPTIMIZED=1 yarn build` → `out/`. Add `BASE_PATH=/sub` for subpath deploys.

## No test suite

No tests exist. Do not look for a test command. Verify changes via `yarn build` (catches type errors and broken content) and `yarn lint`.

## Pre-commit

Husky → `lint-staged`: ESLint `--fix` on JS/TS, Prettier `--write` on JS/TS/JSON/CSS/MD/MDX. No typecheck script; TypeScript is checked only through ESLint.

## Content

- **Blog posts**: `data/blog/**/*.mdx` — required frontmatter: `title`, `date`
- **Authors**: `data/authors/**/*.mdx` — required: `name`; `default.mdx` must exist (it's the fallback author)
- **Site config**: `data/siteMetadata.js` — analytics, comments, search, newsletter, locale
- **Nav links**: `data/headerNavLinks.ts`
- **Projects**: `data/projectsData.ts`
- **Auto-generated**: `app/tag-data.json` (Contentlayer onSuccess), `public/search.json` (kbar index)

### Frontmatter reference

```yaml
title: string (required)
date: date (required)
tags: string[] (optional)
lastmod: date (optional)
draft: boolean (optional)       # excluded in production builds
summary: string (optional)
images: json (optional)
authors: string[] (optional, defaults to ['default'])
layout: string (optional)       # PostLayout | PostSimple | PostBanner
canonicalUrl: string (optional)
```

## Contentlayer

- Package is `contentlayer2` (not the unmaintained `contentlayer`)
- Content root: `data/` (`contentDirPath` in `contentlayer.config.ts`)
- Slug: strips first path segment from `flattenedPath` — `blog/foo` → `foo`, `blog/nested/bar` → `nested/bar`
- If cache breaks: delete `.contentlayer/` and rebuild
- onSuccess generates `app/tag-data.json` and `public/search.json` (only when kbar is configured)

## Tailwind CSS v4

No `tailwind.config.*` file. All theme config is in `css/tailwind.css` using `@theme` directive. PostCSS uses `@tailwindcss/postcss` (v4 style, no autoprefixer needed). Custom theme: Space Grotesk font, cyberpunk neon cyan primary (oklch hue 190), cool gray (hue 220).

## Path aliases

Defined in both `tsconfig.json` and `jsconfig.json`:
- `@/components/*`, `@/data/*`, `@/layouts/*`, `@/css/*`
- `contentlayer/generated` → `.contentlayer/generated`
- `pliny/*` → `node_modules/pliny/*`

## Key config files

| File | Purpose |
|------|---------|
| `next.config.js` | CSP headers, SVG loader, Contentlayer + Bundle Analyzer plugins, static export toggle |
| `contentlayer.config.ts` | MDX remark/rehype plugins, document types, onSuccess hooks |
| `eslint.config.mjs` | Flat config; ignores `next-env.d.ts`, `next.config.js` |
| `prettier.config.js` | No semicolons, single quotes, 100 width, tailwindcss plugin |
| `postcss.config.js` | `@tailwindcss/postcss` only |
| `css/tailwind.css` | All Tailwind theme customization (v4 `@theme` syntax) |

## Deployment

GitHub Pages via `.github/workflows/pages.yml`. Triggered on push to `main`. Builds with `EXPORT=1 UNOPTIMIZED=1`, deploys `out/` folder. Custom domain: `public/CNAME` → `zzrblog.eu.cc`.

## MDX components

Custom components registered in `components/MDXComponents.tsx`: `Image`, `TOCInline`, `Pre` (code blocks), `TableWrapper`, `BlogNewsletterForm`. Use these in MDX files.

## Layouts

- `PostLayout` — default 2-column with sidebar meta/author info
- `PostSimple` — single column, minimal
- `PostBanner` — hero banner image at top
- `ListLayout` — blog list with search bar
- `ListLayoutWithTags` — blog list with tag sidebar (v2 style)
