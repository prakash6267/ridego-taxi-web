import React, { useEffect, useRef } from 'react';

const HeroCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create particles
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
    const particles = [];

    const colors = [
      'rgba(245, 158, 11, 0.65)',   // amber-500
      'rgba(251, 191, 36, 0.55)',   // amber-400
      'rgba(254, 240, 138, 0.45)',  // yellow-200
      'rgba(217, 119, 6, 0.4)',     // amber-600
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45 - 0.15, // Slight upward drift
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // Road speed beams
    const beams = [];
    for (let i = 0; i < 5; i++) {
      beams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 120 + 80,
        speed: Math.random() * 2 + 1.5,
        width: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.25 + 0.05,
      });
    }

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 1;

      // Draw subtle connecting speed lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update floating road speed beams
      for (let b of beams) {
        ctx.beginPath();
        const grad = ctx.createLinearGradient(b.x, b.y, b.x + b.length * 0.4, b.y + b.length);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, `rgba(251, 191, 36, ${b.opacity})`);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = b.width;
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + b.length * 0.4, b.y + b.length);
        ctx.stroke();

        b.y -= b.speed;
        b.x -= b.speed * 0.3;

        if (b.y + b.length < 0 || b.x < -100) {
          b.y = height + 50;
          b.x = Math.random() * width + 100;
          b.speed = Math.random() * 2 + 1.5;
        }
      }

      // Draw & update particles
      for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
};

export default HeroCanvas;
