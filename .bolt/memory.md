# Project memory

## Product intent & audience

- Content-driven web app; SSR output ~69KB HTML indicates substantial page content
- Built with Lovable platform (Lovable-generated project structure and config)

## Brand personality & voice

- Not yet inferred from available context

## Visual design & UX direction

- Animation system: `usePageMotion` hook uses `IntersectionObserver`; `.reveal` elements with `motion-ready` class hide content until scrolled into view
- Styling: Tailwind CSS with `tw-animate-css` package; custom colors, utility classes, animations (~103KB CSS)
- SSR-first rendering with client hydration (TanStack Start — no `index.html`)

## Decisions, constraints & rationale

- **Stack:** Vite + React + TanStack Start (SSR), TypeScript
- **Routing:** TanStack Start route tree (file-based)
- **Build verification:** Production build passes, TypeScript checks pass, tests pass, SSR output contains all content
- **Known risk:** Reveal animation pattern (`motion-ready` + `IntersectionObserver`) can leave content hidden if client JS fails to execute — potential cause of blank preview
- **Preview issue unresolved:** SSR renders correctly but preview shows blank; likely client-side hydration error or CSS visibility issue; requires browser console output to diagnose

## Open questions & assumptions

- **Blank preview root cause:** Needs browser console errors to pinpoint — hydration failure vs. CSS hiding vs. transient environment issue
- **Is the reveal animation graceful?** Should content be visible by default and only animated if JS succeeds, to avoid blank-page risk?
- **Does the preview environment fully support TanStack Start SSR hydration?**
- Product domain, audience, and brand identity not yet established