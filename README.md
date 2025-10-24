Angela Petrone — Portfolio (development preview)

What this workspace contains

- `index.html` — the homepage for Angela Petrone (Product Designer)
- `styles.css` — site styles and theme
- `scripts.js` — interactive behaviors: smooth scroll, header behavior, reveal-on-scroll, chart rendering

Preview locally

Open the page in the host browser (dev container) with:

```bash
$BROWSER file:///workspaces/session-09-idea/index.html
```

Notes

- The sample chart in the "Data Visualization" section is generated at runtime by `scripts.js`. Use the Randomize / Update buttons to see the demo data animate.
- To add real case studies, replace the project card content in `index.html` and link `Read case study` to the real pages.
- Images: project cards currently use text placeholders; add images in an `images/` folder and update `.card-media` markup if you want thumbnails.

Accessibility

- The site respects `prefers-reduced-motion` and uses `aria` attributes for important interactive elements.

Want changes?

Tell me which cards to replace with real content, or provide thumbnails and I will wire them in.