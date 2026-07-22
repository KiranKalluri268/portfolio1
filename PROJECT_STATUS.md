# Project Status

Last updated: 2026-07-22  
Active branch: `feat/projects-page`

## Current focus

Build and review the complete `/projects` case-study experience.

| Work item | Status | Notes |
| --- | --- | --- |
| Shared structured project data | Complete | Homepage and `/projects` use `src/data/projects.json` |
| Responsive projects page | Complete | Featured case studies plus additional-project cards |
| Project metadata and indexing | Complete | Canonical metadata added; `noindex` removed |
| Sitemap | Complete | `/projects` included |
| Content accuracy review | In review | Confirm descriptions, roles, metrics, and available links |
| Desktop visual QA | Pending | Test common desktop widths and hover/focus states |
| Mobile visual QA | Pending | Test small phones, landscape, and long-card scrolling |
| Automated verification | Complete | ESLint and the Next.js production build pass |

## Next

1. Review `/projects` content and visuals on desktop and mobile.
2. Add project-specific repository or live links if ResumeByAI or MindPlan become public.
3. Complete the hiring CTA with availability and preferred-role information.
4. Audit copy and machine-readable experience dates.
5. Add automated tests and strengthen CI.

## Later

- Add production error monitoring and structured operational logging.
- Consider individual project detail routes if case studies grow beyond the overview page.
- Add new project screenshots and measurable outcomes as they become available.

## Recently completed

- Comprehensive README and operational documentation
- MIT code license and CC BY 4.0 content/design license
- Mobile Experience timeline alignment and focus animation
- Persistent mobile scene navigation overlay
- Responsive hero typography
- SEO metadata and generated social preview

## Known constraints

- `/api/contact` uses an in-memory, instance-local rate limiter.
- ResumeByAI and MindPlan do not currently have verified public project links.
- Real-device mobile QA is still required after significant layout changes.
- Some Windows/WSL worktrees may report line-ending-only file modifications; verify logical diffs before staging.

## Verification baseline

Current branch verification:

- `npm run lint` — Passed
- `npm run build` — Passed

Before merging a feature branch:

```bash
npm run lint
npm run build
```

Manual verification should include keyboard navigation, reduced motion, touch behavior, route return behavior, and background-tab audio/video handling.
