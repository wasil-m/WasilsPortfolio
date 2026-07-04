import { useEffect, useRef, useState, useCallback } from 'react';

/*
  Playable pixel-platformer intro, shown on a small handheld console.
  Pure 2D canvas + CSS console shell — no three.js on the boot path.
  On START the whole console scales up with its origin on the screen,
  so the camera appears to dive into the screen before the site loads.
  Controls: arrow keys / A,D / space, or the console's own D-pad + buttons.
*/

const PAL = {
  skyTop: '#1a0e10',
  skyBottom: '#241417',
  hillFar: '#201214',
  hillNear: '#2a1619',
  brick: '#301c1f',
  brickLine: '#4a2a2c',
  brickTop: '#e8b94a',
  block: '#e8b94a',
  blockDim: '#a3822f',
  blockBright: '#ffd76a',
  coin: '#ffd76a',
  player: '#f5ece4',
  playerAccent: '#e8b94a',
  flagPole: '#c4a99a',
  flag: '#9db66c',
  shadow: 'rgba(0,0,0,0.35)',
};

const GRAVITY = 2400;
const MOVE = 210;
const JUMP = -700;

export default function Boot({ onEnter }) {
  const canvasRef = useRef(null);
  const [coins, setCoins] = useState(0);
  const [entering, setEntering] = useState(false);
  const [cleared, setCleared] = useState(false);
  const input = useRef({ left: false, right: false, jump: false, jumpHeld: false });
  const enteringRef = useRef(false);

  const start = useCallback(() => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    setEntering(true);
    setTimeout(onEnter, 700);
  }, [onEnter]);

  // keep a live ref so the game loop (mounted once) can call the latest start()
  const startRef = useRef(start);
  useEffect(() => { startRef.current = start; }, [start]);

  /* keyboard — movement only; entering the site is earned in-game */
  useEffect(() => {
    const down = (e) => {
      if (e.repeat) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') input.current.left = true;
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') input.current.right = true;
      else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') { input.current.jump = true; e.preventDefault(); }
    };
    const up = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') input.current.left = false;
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') input.current.right = false;
      else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') { input.current.jump = false; input.current.jumpHeld = false; }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  /* game loop */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let last = performance.now();
    let W = 0, H = 0, dpr = 1;
    let groundY = 0;

    const player = { x: 30, y: 0, vx: 0, vy: 0, w: 13, h: 18, onGround: false, face: 1, walkT: 0 };
    let blocks = [];
    let coinsFx = [];
    let flag = { x: 0, raised: 0 };
    let coinsGot = 0;      // local mirror of coin count (loop can't read React state)
    let cleared = false;   // all 3 collected — flag is rising
    let launched = false;  // dive triggered

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      groundY = H - Math.max(22, Math.round(H * 0.14));
      // smaller blocks — capped so they never dominate a small screen
      const s = Math.min(Math.max(16, Math.round(H * 0.085)), 42);
      // Reachability is set by physics, not screen size: a jump lifts the
      // player's head to (player.h + apex) above the ground, so block *bottoms*
      // must sit inside that envelope to be bumpable on any screen size.
      const apex = (JUMP * JUMP) / (2 * GRAVITY);
      const reach = player.h + apex;                 // ≈ head clearance
      const lowBottom = groundY - reach * 0.5;
      const highBottom = groundY - reach * 0.72;
      blocks = [
        { x: W * 0.28, y: lowBottom - s, s, bump: 0, hit: false },
        { x: W * 0.50 - s / 2, y: highBottom - s, s, bump: 0, hit: false },
        { x: W * 0.72 - s, y: lowBottom - s, s, bump: 0, hit: false },
      ];
      flag.x = W - Math.max(24, W * 0.08);
      player.y = Math.min(player.y, groundY - player.h);
      player.x = Math.min(player.x, W - 30);
    };
    layout();
    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    const drawBricks = () => {
      const bh = Math.max(10, Math.round(H * 0.06)), bw = bh * 2;
      ctx.fillStyle = PAL.brick;
      ctx.fillRect(0, groundY, W, H - groundY);
      ctx.strokeStyle = PAL.brickLine;
      ctx.lineWidth = 1;
      for (let row = 0, y = groundY; y < H; y += bh, row++) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke();
        const off = row % 2 ? bw / 2 : 0;
        for (let x = off; x < W; x += bw) {
          ctx.beginPath();
          ctx.moveTo(x + 0.5, y); ctx.lineTo(x + 0.5, Math.min(y + bh, H)); ctx.stroke();
        }
      }
      ctx.fillStyle = PAL.brickTop;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(0, groundY, W, 2);
      ctx.globalAlpha = 1;
    };

    const drawHills = () => {
      const hill = (color, base, amp, step) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        for (let x = 0; x <= W; x += step) {
          const y = groundY - base - Math.abs(Math.sin(x * 0.008 + base)) * amp;
          ctx.lineTo(x, Math.round(y / 5) * 5);
        }
        ctx.lineTo(W, groundY);
        ctx.closePath();
        ctx.fill();
      };
      hill(PAL.hillFar, 18, 42, 16);
      hill(PAL.hillNear, 4, 24, 12);
    };

    const drawBlock = (b) => {
      const rise = Math.sin(Math.min(b.bump, 1) * Math.PI) * 7;
      const y = b.y - rise;
      const bev = Math.max(2, b.s * 0.12);
      ctx.fillStyle = PAL.shadow;
      ctx.fillRect(b.x + 2, b.y + 2, b.s, b.s);
      ctx.fillStyle = b.hit ? PAL.blockDim : PAL.block;
      ctx.fillRect(b.x, y, b.s, b.s);
      ctx.fillStyle = b.hit ? PAL.block : PAL.blockBright;
      ctx.fillRect(b.x, y, b.s, bev);
      ctx.fillRect(b.x, y, bev, b.s);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(b.x, y + b.s - bev, b.s, bev);
      ctx.fillRect(b.x + b.s - bev, y, bev, b.s);
    };

    const drawCoinFx = (c) => {
      const p = c.t / 0.7;
      const y = c.y - p * 34;
      ctx.globalAlpha = 1 - p;
      ctx.fillStyle = PAL.coin;
      const w = 8 * Math.abs(Math.cos(p * Math.PI * 3));
      ctx.beginPath();
      ctx.ellipse(c.x, y, Math.max(w / 2, 1.5), 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const drawPlayer = () => {
      const { x, y, w, h, face, onGround } = player;
      const moving = onGround && (input.current.left || input.current.right);
      const bob = moving ? Math.sin(player.walkT * 14) * 1.5 : 0;
      ctx.fillStyle = PAL.shadow;
      ctx.beginPath();
      ctx.ellipse(x + w / 2, groundY + 2, 9, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.player;
      ctx.fillRect(x, y + 6 + bob, w, h - 9);
      ctx.fillRect(x + 2, y + bob, w - 4, 9);
      ctx.fillStyle = PAL.playerAccent;
      const vx = face === 1 ? x + w - 8 : x + 2;
      ctx.fillRect(vx, y + 3 + bob, 6, 4);
      ctx.fillRect(x, y + 14 + bob, w, 2);
      ctx.fillStyle = PAL.player;
      const step = moving ? Math.sin(player.walkT * 14) * 2.5 : 0;
      ctx.fillRect(x + 2, y + h - 4 + bob, 5, 4 + step * 0.5);
      ctx.fillRect(x + w - 7, y + h - 4 + bob, 5, 4 - step * 0.5);
    };

    const drawFlag = (t) => {
      const poleH = Math.round(H * 0.42);
      const px = flag.x;
      ctx.fillStyle = PAL.flagPole;
      ctx.fillRect(px, groundY - poleH, 2, poleH);
      ctx.fillRect(px - 2, groundY - poleH, 6, 2);
      const fy = groundY - poleH + 4 + (1 - flag.raised) * (poleH - 22);
      const wave = Math.sin(t * 5) * 2;
      ctx.fillStyle = PAL.flag;
      ctx.beginPath();
      ctx.moveTo(px + 2, fy);
      ctx.lineTo(px + 18 + wave, fy + 5);
      ctx.lineTo(px + 2, fy + 10);
      ctx.closePath();
      ctx.fill();
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      const t = now / 1000;
      const inp = input.current;

      player.vx = (inp.right ? MOVE : 0) - (inp.left ? MOVE : 0);
      if (player.vx !== 0) { player.face = Math.sign(player.vx); player.walkT += dt; }
      if (inp.jump && !inp.jumpHeld && player.onGround) {
        player.vy = JUMP; player.onGround = false; inp.jumpHeld = true;
      }
      player.vy += GRAVITY * dt;
      player.x = Math.max(4, Math.min(W - player.w - 4, player.x + player.vx * dt));
      player.y += player.vy * dt;

      if (player.y + player.h >= groundY) {
        player.y = groundY - player.h; player.vy = 0; player.onGround = true;
      }

      for (const b of blocks) {
        if (b.bump > 0) { b.bump += dt * 3; if (b.bump >= 1) b.bump = 0; }
        const overlapX = player.x + player.w > b.x && player.x < b.x + b.s;
        if (!overlapX) continue;
        if (player.vy < 0 && player.y <= b.y + b.s && player.y > b.y + b.s - 14) {
          player.y = b.y + b.s; player.vy = 80;
          if (b.bump === 0) b.bump = 0.01;
          if (!b.hit) {
            b.hit = true;
            coinsFx.push({ x: b.x + b.s / 2, y: b.y - 4, t: 0 });
            coinsGot += 1;
            setCoins(coinsGot);
            if (coinsGot >= 3 && !cleared) { cleared = true; setCleared(true); }
          }
        } else if (player.vy > 0 && player.y + player.h >= b.y && player.y + player.h < b.y + 14) {
          player.y = b.y - player.h; player.vy = 0; player.onGround = true;
        }
      }

      coinsFx = coinsFx.filter((c) => (c.t += dt) < 0.7);

      // flag only climbs once all three coins are collected
      if (cleared && flag.raised < 1) flag.raised = Math.min(flag.raised + dt * 1.1, 1);
      // when the flag tops out, dive into the screen
      if (cleared && flag.raised >= 1 && !launched) {
        launched = true;
        startRef.current();
      }

      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, PAL.skyTop); sky.addColorStop(1, PAL.skyBottom);
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W / 2, H * 0.3, 20, W / 2, H * 0.3, W * 0.55);
      glow.addColorStop(0, 'rgba(232,185,74,0.08)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

      drawHills();
      drawBricks();
      blocks.forEach(drawBlock);
      coinsFx.forEach(drawCoinFx);
      drawFlag(t);
      drawPlayer();

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const hold = (key) => ({
    onPointerDown: (e) => { e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId); e.currentTarget.classList.add('held'); input.current[key] = true; },
    onPointerUp: (e) => { e.currentTarget.classList.remove('held'); input.current[key] = false; if (key === 'jump') input.current.jumpHeld = false; },
    onPointerLeave: (e) => { e.currentTarget.classList.remove('held'); input.current[key] = false; if (key === 'jump') input.current.jumpHeld = false; },
    onPointerCancel: (e) => { e.currentTarget.classList.remove('held'); input.current[key] = false; if (key === 'jump') input.current.jumpHeld = false; },
  });

  return (
    <div className={`boot ${entering ? 'entering' : ''}`}>
      <div className="console">
        <div className="console-brand">WM&nbsp;·&nbsp;01</div>

        <div className="console-body">
          {/* left: D-pad */}
          <div className="dpad">
            <button className="pad-btn up" aria-label="Jump" {...hold('jump')}>▲</button>
            <button className="pad-btn left" aria-label="Move left" {...hold('left')}>◀</button>
            <button className="pad-btn right" aria-label="Move right" {...hold('right')}>▶</button>
            <span className="pad-center" />
          </div>

          {/* center: the screen you dive into */}
          <div className="console-screen">
            <canvas ref={canvasRef} aria-hidden="true" />
            <div className="screen-hud">
              <span className="coin-ico" />× {coins} / 3
            </div>
            <div className="screen-title">
              <h1>WASIL MAHBUB</h1>
              <div className="role">SOFTWARE ENGINEER</div>
            </div>
            {/* idle attract text — not a control; playing the level is the control */}
            <div className="screen-prompt" aria-hidden="true">
              {cleared ? '★ LEVEL CLEAR ★' : '▸ PRESS START ◂'}
            </div>
            <div className="screen-scan" />
          </div>

          {/* right: A / B face buttons — both jump */}
          <div className="face-btns">
            <button className="face a" aria-label="Jump" {...hold('jump')}>A</button>
            <button className="face b" aria-label="Jump" {...hold('jump')}>B</button>
          </div>
        </div>
      </div>

      <button className="boot-skip" onClick={start}>Skip intro →</button>
    </div>
  );
}
