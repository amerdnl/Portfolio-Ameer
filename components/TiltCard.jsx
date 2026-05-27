"use client";

import { useRef } from "react";

const INTENSITY = 9;   // max tilt degrees
const LERP      = 0.1; // spring speed (lower = springier)

export default function TiltCard({ children, className, intensity = INTENSITY }) {
  const wrapRef   = useRef(null);
  const shineRef  = useRef(null);
  const frameRef  = useRef(null);
  const cur       = useRef({ x: 0, y: 0 });
  const tgt       = useRef({ x: 0, y: 0 });
  const active    = useRef(false);

  const loop = () => {
    const c = cur.current;
    const t = tgt.current;
    c.x += (t.x - c.x) * LERP;
    c.y += (t.y - c.y) * LERP;

    const wrap = wrapRef.current;
    if (wrap) {
      wrap.style.transform = `perspective(900px) rotateX(${c.x}deg) rotateY(${c.y}deg) scale3d(1.025,1.025,1.025)`;
    }

    const stillMoving = Math.hypot(t.x - c.x, t.y - c.y) > 0.01;
    if (active.current || stillMoving) {
      frameRef.current = requestAnimationFrame(loop);
    } else {
      frameRef.current = null;
    }
  };

  const startLoop = () => {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(loop);
  };

  const onMouseMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left)  / rect.width;   // 0–1
    const ny = (e.clientY - rect.top)   / rect.height;  // 0–1
    tgt.current = {
      x:  (0.5 - ny) * intensity,
      y:  (nx - 0.5) * intensity,
    };
    if (shineRef.current) {
      shineRef.current.style.background = `radial-gradient(circle at ${nx * 100}% ${ny * 100}%, rgba(255,255,255,0.11) 0%, transparent 58%)`;
      shineRef.current.style.opacity = "1";
    }
    startLoop();
  };

  const onMouseEnter = () => {
    active.current = true;
    startLoop();
  };

  const onMouseLeave = () => {
    active.current = false;
    tgt.current = { x: 0, y: 0 };
    if (shineRef.current) shineRef.current.style.opacity = "0";
    startLoop();
  };

  return (
    <div
      ref={wrapRef}
      className={className}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}

      {/* Specular shine that follows cursor within the frame */}
      <div
        ref={shineRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6] opacity-0 transition-opacity duration-500"
        style={{ mixBlendMode: "overlay" }}
      />
    </div>
  );
}
