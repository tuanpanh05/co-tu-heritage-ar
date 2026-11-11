import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  phase: number;
  phaseSpeed: number;
  isBurst?: boolean;
  life?: number;
}

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false
    };

    const palette = [
      '35, 122, 99',   // Ngọc bích rừng (Jade)
      '82, 183, 154',  // Xanh sương lá (Mint Dew)
      '212, 163, 89',  // Nắng sớm Tây Giang (Warm Sun)
      '74, 154, 142',  // Xanh lam ngọc (Soft Teal)
      '120, 194, 164'  // Xanh non (Soft Sage)
    ];

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 32 : 60;
    const particles: Particle[] = [];

    const createParticle = (x?: number, y?: number, isBurst = false): Particle => {
      const baseRadius = isBurst ? Math.random() * 3.5 + 2 : Math.random() * 3.2 + 1.4;
      return {
        x: x ?? Math.random() * width,
        y: y ?? Math.random() * height,
        vx: isBurst ? (Math.random() - 0.5) * 2.4 : (Math.random() - 0.5) * 0.45,
        vy: isBurst ? (Math.random() - 0.7) * 2.4 : -Math.random() * 0.4 - 0.12,
        radius: baseRadius,
        baseRadius,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: isBurst ? 0.85 : Math.random() * 0.45 + 0.2,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.02 + 0.01,
        isBurst,
        life: isBurst ? 1.0 : undefined
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 6; i++) {
        if (particles.length < 95) {
          particles.push(createParticle(e.clientX, e.clientY, true));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      const orb1X = width * 0.2 + Math.sin(time * 0.7) * 80;
      const orb1Y = height * 0.25 + Math.cos(time * 0.5) * 60;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, Math.max(width, height) * 0.4);
      grad1.addColorStop(0, 'rgba(82, 183, 154, 0.11)');
      grad1.addColorStop(1, 'rgba(82, 183, 154, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.8 + Math.cos(time * 0.6) * 90;
      const orb2Y = height * 0.7 + Math.sin(time * 0.4) * 70;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, Math.max(width, height) * 0.38);
      grad2.addColorStop(0, 'rgba(212, 163, 89, 0.08)');
      grad2.addColorStop(1, 'rgba(212, 163, 89, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 5, mouse.x, mouse.y, 190);
        mouseGrad.addColorStop(0, 'rgba(82, 183, 154, 0.13)');
        mouseGrad.addColorStop(0.5, 'rgba(212, 163, 89, 0.05)');
        mouseGrad.addColorStop(1, 'rgba(82, 183, 154, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 190, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.phase += p.phaseSpeed;

        p.x += p.vx + Math.sin(p.phase) * 0.25;
        p.y += p.vy;
        p.radius = p.baseRadius + Math.sin(p.phase * 1.5) * 0.7;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const interactRadius = 150;

          if (dist < interactRadius && dist > 0.1) {
            const force = (interactRadius - dist) / interactRadius;
            p.x += (dx / dist) * force * 1.6 - (dy / dist) * force * 0.5;
            p.y += (dy / dist) * force * 1.6 + (dx / dist) * force * 0.5;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${p.color}, ${force * 0.22})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        for (let j = i - 1; j >= 0; j--) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 105) {
            const lineAlpha = (1 - dist / 105) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(35, 122, 99, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        if (p.isBurst && p.life !== undefined) {
          p.life -= 0.016;
          p.alpha = Math.max(0, p.life * 0.8);
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
        }

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        } else if (p.y > height + 20) {
          p.y = -20;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const glowRadius = Math.max(1, p.radius * 3.5);
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        pGrad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        pGrad.addColorStop(0.45, `rgba(${p.color}, ${p.alpha * 0.4})`);
        pGrad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.alpha * 1.2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.radius * 0.45), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-bg-canvas fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
