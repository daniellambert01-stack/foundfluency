# Found Fluency – website

Live: https://www.foundfluency.com/

This repository holds the **built, static website** that GitHub Pages serves.
The source code lives in the Lovable project `fluency-foundry-coaching`
(edit there or in that repo, never here).

## Update the live site
In `fluency-foundry-coaching`:

    bun install
    bunx vite build --config vite.static.config.ts

Then copy `dist/client/` into this repository (keep `CNAME`, `.nojekyll`,
`404.html`, `preise/index.html` and this README) and push to `main`.

Old addresses (previous sites) forward to the matching page.
Earlier versions: branch `canva-site-backup` (Canva one-pager, Nov 2026), branch `old-site` (first site).
