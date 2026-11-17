import React, { useEffect, useRef } from 'react';

interface MistDrift {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  speed: number;
  opacity: number;
}

interface HearthEmber {
  x: number;
  y: number;
  vy: number;
  vx: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
}

/**
 * Nền Không Gian "Sương Sớm Đại Ngàn Tây Giang":
 * - Dãy Trường Sơn trùng điệp trong sương sớm
 * - Làn sương mỏng lơ lửng trôi chậm
 * - Ánh sáng sớm mai lọc qua tán cây
 * - Vài tàn lửa ấm từ bếp than nhà Gươl (rất tiết chế, không particle dày)
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

    // Chuẩn bị 4-6 đám sương mỏng trôi chậm
    const mistClouds: MistDrift[] = [];
    const mistCount = 5;
    for (let i = 0; i < mistCount; i++) {
      mistClouds.push({
        x: Math.random() * width,
        y: height * (0.15 + (i * 0.16)),
        radiusX: width * 0.45 + Math.random() * 200,
        radiusY: 100 + Math.random() * 80,
        speed: 0.12 + Math.random() * 0.1,
        opacity: 0.035 + Math.random() * 0.035
      });
    }

    // Chỉ giữ 12-16 tàn lửa ấm lơ lửng chậm rãi từ bếp lửa Gươl (không particle dày hay neon)
    const embers: HearthEmber[] = [];
    const emberCount = 14;
    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(Math.random() * 0.2 + 0.08),
        vx: (Math.random() - 0.5) * 0.12,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.25 + 0.1,
        baseAlpha: Math.random() * 0.25 + 0.1,
        phase: Math.random() * Math.PI * 2
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // Chuyển động quán tính nhẹ theo chuột
      mouseX += (targetMouseX - mouseX) * 0.02;
      mouseY += (targetMouseY - mouseY) * 0.02;
      const mouseParallaxX = ((mouseX / width) - 0.5) * 30;

      // 1. Ánh sáng sớm mai lọc qua sương rừng (Dappled Morning Light)
      const sunX = width * 0.68 + Math.sin(tick * 0.001) * 30 + mouseParallaxX * 0.5;
      const sunY = height * 0.18 + Math.cos(tick * 0.0012) * 20;
      const sunGradient = ctx.createRadialGradient(
        sunX, sunY, 10,
        sunX, sunY, Math.max(width, height) * 0.55
      );
      sunGradient.addColorStop(0, 'rgba(222, 170, 92, 0.065)');
      sunGradient.addColorStop(0.45, 'rgba(78, 154, 128, 0.03)');
      sunGradient.addColorStop(1, 'rgba(14, 23, 18, 0)');

      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Các tầng sương mỏng trôi chậm (Slow Volumetric Mist Layers)
      for (let i = 0; i < mistClouds.length; i++) {
        const m = mistClouds[i];
        m.x += m.speed;
        if (m.x - m.radiusX > width) {
          m.x = -m.radiusX;
        }

        const mistGrad = ctx.createRadialGradient(
          m.x, m.y, 10,
          m.x, m.y, m.radiusX
        );
        mistGrad.addColorStop(0, `rgba(243, 237, 227, ${m.opacity})`);
        mistGrad.addColorStop(0.55, `rgba(78, 154, 128, ${m.opacity * 0.4})`);
        mistGrad.addColorStop(1, 'rgba(14, 23, 18, 0)');

        ctx.save();
        ctx.scale(1, m.radiusY / m.radiusX);
        ctx.fillStyle = mistGrad;
        ctx.beginPath();
        ctx.arc(m.x, (m.y * (m.radiusX / m.radiusY)), m.radiusX, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Vài tàn lửa ấm bay lên chậm từ bếp than Gươl
      for (let i = 0; i < embers.length; i++) {
        const p = embers[i];
        p.y += p.vy;
        p.x += p.vx + Math.sin(tick * 0.015 + p.phase) * 0.15;

        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        p.alpha = p.baseAlpha + Math.sin(tick * 0.02 + p.phase) * 0.08;

        const emberGrad = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 2.8
        );
        emberGrad.addColorStop(0, `rgba(200, 147, 68, ${Math.max(0.04, p.alpha)})`);
        emberGrad.addColorStop(0.6, `rgba(182, 84, 58, ${Math.max(0.01, p.alpha * 0.35)})`);
        emberGrad.addColorStop(1, 'rgba(200, 147, 68, 0)');

        ctx.fillStyle = emberGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Lớp đường chân trời núi rừng Trường Sơn - Tây Giang mờ trong sương */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[36vh] min-h-[220px] max-h-[360px] object-cover opacity-60 transition-transform duration-1000 ease-out"
        viewBox="0 0 1440 360"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#233F31" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0E1712" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="mountainMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1C3428" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0B130E" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="mountainNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14261D" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#070D0A" stopOpacity="0.5" />
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

      {/* Canvas sương mù trôi chậm & tàn than ấm */}
      <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />
    </div>
  );
};
