import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { projects, skillGroups, experience, meta } from './data.js';

const Hero3D = lazy(() => import('./Hero3D.jsx'));
const Boot = lazy(() => import('./Boot.jsx'));

/* Scroll reveal hook — re-runs when `active` flips so it can observe
   sections that only mount after the boot screen is dismissed. */
function useReveal(active) {
  useEffect(() => {
    if (!active) return;
    const els = document.querySelectorAll('.reveal:not(.visible)');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const links = [
    ['about', 'About'],
    ['projects', 'Projects'],
    ['skills', 'Skills'],
    ['experience', 'Experience'],
    ['contact', 'Contact'],
  ];

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // one coin per section — lights up as you pass it
  const coinStops = links.map((_, i) => (i + 1) / (links.length + 1));

  return (
    <nav className="nav">
      <a href="#top" className="nav-logo">
        wasil_mahbub<span>.dev</span>
      </a>
      <button className="nav-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? '[ close ]' : '[ menu ]'}
      </button>
      <div className={`nav-links ${open ? 'open' : ''}`}>
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a className="nav-cta" href={`mailto:${meta.email}`}>
          Get in touch
        </a>
      </div>
      <div className="nav-progress" aria-hidden="true">
        <div className="fill" style={{ width: `${progress * 100}%` }} />
        {coinStops.map((stop) => (
          <span
            key={stop}
            className={`coin ${progress >= stop ? 'lit' : ''}`}
            style={{ left: `${stop * 100}%` }}
          />
        ))}
      </div>
    </nav>
  );
}

function Hero() {
  const lines = ['Wasil', 'Mahbub'];
  return (
    <header className="hero" id="top">
      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>
      <div className="hero-inner wrap">
        <motion.div
          className="hero-status"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="dot" />
          Open to graduate & internship roles · Sydney
        </motion.div>

        <h1>
          {lines.map((line, i) => (
            <span className="line" key={line}>
              <motion.span
                style={{ display: 'inline-block' }}
                className={i === 1 ? 'accent' : ''}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.75, delay: 0.15 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Computer Science & Data Science · University of Sydney
        </motion.p>

        <motion.p
          className="hero-tag"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          I build things end-to-end — machine learning pipelines, data tools, and the
          occasional game — and I care most about the part where a technical result
          becomes something a real person can actually use and trust.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <a className="btn btn-primary" href="#projects">
            View projects →
          </a>
          <a className="btn btn-ghost" href="#contact">
            Get in touch
          </a>
        </motion.div>
      </div>

      <div className="hero-scroll">
        <span>SCROLL</span>
        <span className="bar" />
      </div>
    </header>
  );
}

function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="eyebrow reveal">01 — About</div>
        <div className="about-grid">
          <div className="about-card reveal">
            <div className="about-photo-fallback">WM</div>
            <div className="about-meta">
              <div className="row"><span className="k">Degree</span><span className="v">BSc CS + Data Sci</span></div>
              <div className="row"><span className="k">University</span><span className="v">Sydney</span></div>
              <div className="row"><span className="k">Result</span><span className="v">Distinction</span></div>
              <div className="row"><span className="k">Graduating</span><span className="v">Jun 2026</span></div>
              <div className="row"><span className="k">Location</span><span className="v">Sydney, AU</span></div>
            </div>
          </div>
          <div className="about-body reveal">
            <p className="lead">
              I like the moment a messy dataset or a stubborn bug turns into
              something that <span className="hl">actually works</span> — and that
              someone else can actually use.
            </p>
            <p>
              I'm a <b>Computer Science & Data Science</b> graduate from the University
              of Sydney. Most of what I've learned came from building things end-to-end:
              taking a problem from raw, messy data all the way through to a working tool,
              and owning it when it breaks.
            </p>
            <p>
              My favourite kind of work sits right between the technical and the human —
              getting a model to perform well is only half of it; making it
              understandable and trustworthy for someone outside the technical team is the
              part I find most satisfying. Two years of tutoring taught me that translation
              matters as much as the code itself.
            </p>
            <p>
              Right now I'm looking for graduate and internship roles in machine learning,
              data, and software engineering where I can keep building and learn from people
              who are better than me.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const cardRef = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <section id="projects">
      <div className="wrap">
        <div className="eyebrow reveal">02 — Selected Work</div>
        <h2 className="section-title reveal">Things I've built</h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <motion.article
              className="project-card reveal"
              key={p.title}
              onMouseMove={cardRef}
              whileHover={{}}
            >
              <div className="project-top">
                <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="project-year">{p.year}</span>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <div className="project-role">{p.role}</div>
              <p className="project-desc">{p.desc}</p>
              <div className="project-metric">
                <span className="num">{p.metric.num}</span> {p.metric.label}{' '}
                <span style={{ color: 'var(--text-faint)' }}>{p.metric.extra}</span>
              </div>
              <div className="project-stack">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              {p.links.length > 0 && (
                <div className="project-links">
                  {p.links.map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                      → {l.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills">
      <div className="wrap">
        <div className="eyebrow reveal">03 — Toolkit</div>
        <h2 className="section-title reveal">Skills & tools</h2>
        <div className="skills-cols">
          {skillGroups.map((g) => (
            <div className="skill-group reveal" key={g.title}>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <div className="eyebrow reveal">04 — Background</div>
        <h2 className="section-title reveal">Where I've worked</h2>
        <div className="exp-list">
          {experience.map((e) => (
            <div className="exp-entry reveal" key={e.role}>
              <div className="exp-date">{e.date}</div>
              <div>
                <div className="exp-role">{e.role}</div>
                <div className="exp-org">{e.org}</div>
                <p className="exp-desc">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | ok | err

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xrbkorww', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      });
      if (res.ok) {
        setStatus('ok');
        e.target.reset();
      } else setStatus('err');
    } catch {
      setStatus('err');
    }
  };

  return (
    <section id="contact">
      <div className="wrap">
        <div className="eyebrow reveal">05 — Contact</div>
        <div className="contact-inner">
          <div className="reveal">
            <p className="contact-lead">
              Let's build <span className="hl">something</span>.
            </p>
            <p style={{ color: 'var(--text-soft)' }}>
              I'm looking for graduate and internship roles — and always happy to talk
              about a project, a problem, or the gnarliest bug your team hit this year.
            </p>
            <div className="contact-links">
              <a href={`mailto:${meta.email}`}>
                <span className="label">email</span> {meta.email}
              </a>
              <a href={meta.linkedin} target="_blank" rel="noreferrer">
                <span className="label">linkedin</span> /in/wasilmahbub
              </a>
              <a href={meta.github} target="_blank" rel="noreferrer">
                <span className="label">github</span> /wasil-m
              </a>
              <a href={`tel:${meta.phone.replace(/\s/g, '')}`}>
                <span className="label">phone</span> {meta.phone}
              </a>
            </div>
          </div>

          <form className="contact-form reveal" onSubmit={submit}>
            <div>
              <label htmlFor="email">Your email</label>
              <input id="email" type="email" name="email" required placeholder="you@company.com" style={{ width: '100%', marginTop: '0.4rem' }} />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required placeholder="What's on your mind?" style={{ width: '100%', marginTop: '0.4rem', resize: 'vertical' }} />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={status === 'sending'}
              style={{ justifyContent: 'center', opacity: status === 'sending' ? 0.7 : 1 }}
            >
              {status === 'sending' ? 'Sending…' : 'Send message →'}
            </button>
            {status === 'ok' && (
              <p className="form-status ok" role="status">Message sent — I'll get back to you soon.</p>
            )}
            {status === 'err' && (
              <p className="form-status err" role="status">Something went wrong. Email me directly at {meta.email}.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <p>© {new Date().getFullYear()} Wasil Mahbub</p>
        <p>Built with React · Deployed on Vercel</p>
      </div>
    </footer>
  );
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function App() {
  const [booted, setBooted] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (prefersReducedMotion()) return true;
    return sessionStorage.getItem('wm_booted') === '1';
  });
  const [entering, setEntering] = useState(false);

  useReveal(booted);

  const handleEnter = () => {
    sessionStorage.setItem('wm_booted', '1');
    setEntering(true);
    // slight overlap so the site fades in as the boot canvas fades out
    setTimeout(() => setBooted(true), 260);
  };

  if (!booted) {
    return (
      <Suspense fallback={<div className="boot-fallback" />}>
        <div className={`boot-stage ${entering ? 'boot-exit' : ''}`}>
          <Boot onEnter={handleEnter} />
        </div>
      </Suspense>
    );
  }

  return (
    <motion.div
      initial={entering ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Nav />
      <Hero />
      <main>
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}
