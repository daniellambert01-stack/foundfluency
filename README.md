# Found Fluency – website

Live: https://www.foundfluency.com/

A single page (`index.html`, designed in Canva and corrected) plus `impressum/` and `datenschutz/`.
Everything is served from this domain – no Google Fonts, no CDNs (GDPR):

- `css/site.css` is compiled from `_src/` with Tailwind 3:
  `cd _src && npx tailwindcss@3.4.17 -c tailwind.config.js -i input.css -o ../css/site.css --minify`
  (run it again after changing classes in the HTML)
- `fonts/` – Cormorant Garamond and Inter (SIL Open Font License)
- `vendor/fa/` – Font Awesome Free icons
- `img/` – AI-generated pictures, always captioned "Symbolbild, KI-generiert"

Rules: no invented testimonials or team members; real trainers only with written consent.
Old addresses (previous sites) forward to the matching section.
Earlier versions: branch `old-site` (first site); the Lovable version lives in `fluency-foundry-coaching`.
