import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: string;
  isFirefly: boolean;
}

/**
 * Nền tương tác "Đại Ngàn Trường Sơn & Sương Sớm Tây Giang":
 * - Dãy núi Trường Sơn trùng điệp ẩn hiện trong sương mù phía chân trời
 * - Hạt đom đóm vàng ấm & sương rừng ngọc bích lơ lửng
 * - Tương tác mượt mà khi di chuyển chuột hoặc chạm màn hình
 */
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
      radius: 170,
      active: false
    };

    const colors = [
      '35, 122, 99',    // Xanh ngọc rừng sâu
      '82, 183, 154',   // Xanh lá sương mai
      '212, 163, 89',   // Đom đóm vàng nắng ấm
      '235, 185, 95',   // Ánh lửa bản làng dịu
      '116, 198, 157'   // Xanh ngọc bích non
    ];

    const particleCount = Math.min(68, Math.max(30, Math.floor((width * height) / 21000)));
    const particles: Particle[] = [];

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const isFirefly = i % 3 === 0;
        const baseAlpha = isFirefly ? Math.random() * 0.45 + 0.25 : Math.random() * 0.3 + 0.12;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.28 - 0.08,
          radius: isFirefly ? Math.random() * 3.2 + 1.8 : Math.random() * 2.5 + 1.2,
          baseAlpha,
          alpha: baseAlpha,
          pulseSpeed: Math.random() * 0.025 + 0.008,
          pulseOffset: Math.random() * Math.PI * 2,
          color: isFirefly
            ? colors[2 + (i % 2)]
            : colors[i % 2 === 0 ? 0 : 1],
          isFirefly
        });
      }
    };

    initParticles();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 5; i++) {
        if (particles.length > 100) particles.shift();
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 24,
          y: e.clientY + (Math.random() - 0.5) * 24,
          vx: (Math.random() - 0.5) * 1.4,
          vy: (Math.random() - 0.5) * 1.4 - 0.3,
          radius: Math.random() * 3.2 + 1.8,
          baseAlpha: 0.45,
          alpha: 0.65,
          pulseSpeed: 0.03,
          pulseOffset: Math.random() * Math.PI,
          color: colors[Math.floor(Math.random() * colors.length)],
          isFirefly: true
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('click', handleClick);

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Vầng sương sáng dịu trên đỉnh rừng
      const topGlow = ctx.createRadialGradient(
        width * 0.22 + Math.sin(tick * 0.002) * 50,
        height * 0.18,
        20,
        width * 0.22,
        height * 0.18,
        Math.max(width, height) * 0.48
      );
      topGlow.addColorStop(0, 'rgba(82, 183, 154, 0.11)');
      topGlow.addColorStop(1, 'rgba(82, 183, 154, 0)');
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, width, height);

      const sunMistGlow = ctx.createRadialGradient(
        width * 0.82 + Math.cos(tick * 0.002) * 40,
        height * 0.28,
        20,
        width * 0.82,
        height * 0.28,
        Math.max(width, height) * 0.42
      );
      sunMistGlow.addColorStop(0, 'rgba(212, 163, 89, 0.09)');
      sunMistGlow.addColorStop(1, 'rgba(212, 163, 89, 0)');
      ctx.fillStyle = sunMistGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Vầng sáng đi theo chuột
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        const mouseGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          4,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        mouseGrad.addColorStop(0, 'rgba(212, 163, 89, 0.12)');
        mouseGrad.addColorStop(0.5, 'rgba(82, 183, 154, 0.06)');
        mouseGrad.addColorStop(1, 'rgba(82, 183, 154, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Cập nhật & vẽ các hạt đom đóm / sương rừng
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        p.alpha = p.baseAlpha + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.14;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 1.4;
            p.y += (dy / dist) * force * 1.4;
            p.alpha = Math.min(0.85, p.alpha + force * 0.35);
          }
        }

        const glowRadius = p.radius * (p.isFirefly ? 4.2 : 3.2);
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0.2, p.x, p.y, glowRadius);
        pGrad.addColorStop(0, `rgba(${p.color}, ${Math.max(0.08, p.alpha)})`);
        pGrad.addColorStop(0.45, `rgba(${p.color}, ${Math.max(0.03, p.alpha * 0.42)})`);
        pGrad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Các đường tơ sương mỏng kết nối hạt gần nhau
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 110;

          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * 0.08;
            ctx.strokeStyle = `rgba(35, 122, 99, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Lớp đường chân trời núi rừng Trường Sơn - Tây Giang mờ trong sương */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[38vh] min-h-[220px] max-h-[380px] object-cover opacity-55"
        viewBox="0 0 1440 360"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9CC5B6" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#D7EAE2" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="mountainMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6AA893" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#CBE2D9" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="mountainNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B7D67" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#DCECE5" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Dãy Trường Sơn tầng xa */}
        <path
          d="M0,210 Q180,95 370,175 T760,130 T1140,180 T1440,115 L1440,360 L0,360 Z"
          fill="url(#mountainFar)"
        />
        {/* Dãy núi sương tầng trung */}
        <path
          d="M0,250 Q240,150 480,220 T960,165 T1440,215 L1440,360 L0,360 Z"
          fill="url(#mountainMid)"
        />
        {/* Thung lũng rừng già tầng gần */}
        <path
          d="M0,285 Q190,225 420,275 T890,235 T1260,270 T1440,245 L1440,360 L0,360 Z"
          fill="url(#mountainNear)"
        />
      </svg>

      {/* Canvas hạt đom đóm & sương rừng tương tác */}
      <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />
    </div>
  );
};
