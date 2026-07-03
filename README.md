# Wasil Mahbub — Portfolio

A modern, React-based personal portfolio with a playable retro-platformer intro. Built with Vite, React, Three.js (react-three-fiber), and Framer Motion. Palette: deep red + gold, torch-lit brick-world theme carried through every screen.

## Highlights
- **Playable boot level** — the site opens on an original 8-bit-style platformer level (pure 2D canvas, no game engine, no three.js on the boot path — ~3 kB gzipped). Walk with arrow keys or the on-screen D-pad, jump and bump the gold blocks for coins, reach the flag at the far right — or just hit PRESS START at any time to dive into the site.
- Interactive 3D hero — floating gold and cream shards that react to your mouse
- Coin-track scroll progress bar in the nav — one coin lights per section as you scroll
- Contact form submits in-page with a success state (no navigation away)
- Scroll-reveal animations and hover micro-interactions throughout
- Fully responsive (5-column skills grid collapses gracefully on tablet/mobile)
- Respects `prefers-reduced-motion` — skips the console intro entirely and goes straight to the site for anyone who has that setting on
- The intro only plays once per browser session (`sessionStorage`) — revisiting or navigating back won't replay it

## Run it locally

You need [Node.js](https://nodejs.org) (v18 or newer) installed.

```bash
npm install      # install dependencies (first time only)
npm run dev      # start the dev server → http://localhost:5173
```

Edit anything and the page reloads automatically.

## Where to change things

Almost all your content lives in one file, so you don't have to touch the layout code:

- **`src/data.js`** — your projects, skills, work experience, and contact details. This is the file you'll edit most.
- **`src/App.jsx`** — the page structure and section text (the About paragraphs, hero tagline, etc.).
- **`src/styles.css`** — colours, fonts, spacing. The palette lives at the very top under `:root`.
- **`index.html`** — the page title and social-share description.

### Adding a project
Open `src/data.js`, copy one of the objects in the `projects` array, and change the fields. Done.

### Adding your photo
1. Drop your photo into the `public/` folder (e.g. `public/me.jpg`).
2. In `src/App.jsx`, find the `about-photo-fallback` div (it currently shows "WM") and replace it with:
   ```jsx
   <img className="about-photo" src="/me.jpg" alt="Wasil Mahbub" />
   ```

### Your resume
Drop your resume PDF into `public/` (e.g. `public/Wasil-Resume.pdf`) and it'll be available at `/Wasil-Resume.pdf`. You can link to it from the nav or contact section.

## Deploy to Vercel (free)

### Easiest way — via GitHub
1. Create a new repository on [GitHub](https://github.com) and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com), sign in with GitHub.
3. Click **Add New → Project**, select your repo, and click **Deploy**.
4. Vercel auto-detects Vite. No config needed — it just works.

Every time you `git push`, Vercel redeploys automatically.

### Or — via the Vercel CLI
```bash
npm i -g vercel
vercel          # follow the prompts
vercel --prod   # deploy to production
```

### Custom domain
Once deployed, go to your project on Vercel → **Settings → Domains** to add a custom domain (e.g. `wasilmahbub.com`).

## The contact form
The form posts to Formspree (the same endpoint from your old site). To use your own, sign up at [formspree.io](https://formspree.io), create a form, and replace the `action` URL in the `Contact` component in `src/App.jsx`.

---

Built with React · Vite · Framer Motion.
