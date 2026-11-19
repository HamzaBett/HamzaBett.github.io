# Hamza Bettahar — portfolio

A one-page portfolio built from the LinkedIn profile
[linkedin.com/in/bettahar-hamza-b626831b4](https://www.linkedin.com/in/bettahar-hamza-b626831b4/).
Plain HTML, CSS and JavaScript: no framework, no build step, no dependencies.

```
portfolio/
├── index.html              all the content (sections are marked with comments)
├── css/styles.css          design tokens (colours, fonts) at the top, then each section
├── js/main.js              theme toggle, mobile menu, terminal animation, project filters, copy email
└── assets/
    ├── favicon.svg         browser tab icon
    ├── apple-touch-icon.png  home-screen icon (180×180)
    └── og-image.png        preview card shown when the link is shared (1200×630)
```

## Preview it locally

From inside this folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` by double-click also works.

## What it includes

- Hero with an animated terminal (Terraform → kubectl → Helm → health check)
- About, with the electronics → ML → DevOps journey and quick facts
- Experience timeline (Slalom, Sonatrach). The "4 yrs 1 mo" duration updates itself every month
- The 3 GitHub projects featured with pipeline diagrams, plus the other 14 projects with filters
- Skills, education, courses and languages
- Contact with a mailto button and a copy-email button
- Dark and light themes (follows the visitor's system setting, with a toggle), mobile menu,
  reduced-motion support, print styles, Open Graph and schema.org metadata for LinkedIn and Google

## Before you publish

1. **Slalom achievements.** The LinkedIn text for this role still has template placeholders:
   `[AWS/Azure]`, `[60%]`, `[40%]`, `[EKS/AKS]`, `[Datadog/Prometheus & Grafana]`, `[50%]`, `[25%]`.
   The site leaves them out. Search `index.html` for `EDIT ME` and add your real tools and numbers.
   Fix them on LinkedIn too.
2. **Email.** The contact section shows `jourday2@gmail.com`, taken from your LinkedIn contact info.
   Change or remove it in `index.html` (search for `jourday2`) if you don't want it public.
3. **Photo (optional).** Put a square photo at `assets/profile.jpg` and follow the comment above the
   `HB` avatar in the About section.

## Publish it (free)

Pick one:

- **GitHub Pages:** create a repository named `HamzaBett.github.io`, push this folder's contents to it,
  and the site goes live at `https://hamzabett.github.io/`.
  (Any other repo also works: Settings → Pages → Deploy from branch.)
- **Netlify Drop:** drag this folder onto <https://app.netlify.com/drop>.
- **Vercel:** `npx vercel` from this folder.

After it's online:

1. In `index.html`, replace `assets/og-image.png` in the `og:image` tag with the full URL
   (for example `https://hamzabett.github.io/assets/og-image.png`), and add
   `<link rel="canonical" href="https://hamzabett.github.io/">`. LinkedIn needs the absolute URL
   to show the preview card.
2. On LinkedIn: **Edit contact info → Website → type "Portfolio"**, and add the link to your
   **Featured** section.
3. Check the preview card with LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/).

## Customising

- **Colours:** the `[data-theme="dark"]` and `[data-theme="light"]` blocks at the top of `css/styles.css`.
- **Fonts:** Space Grotesk (headings), Inter (text) and JetBrains Mono (code), loaded from Google Fonts in `index.html`.
- **Projects:** each card is an `<li data-cats="...">` in the projects section. `data-cats` takes
  `ai`, `embedded`, `web` or `blockchain`. Update the counts in the filter buttons if you add or remove cards.
