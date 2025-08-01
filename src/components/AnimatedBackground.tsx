'use client';

import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
    color?: string; // Колір у форматі rgba, наприклад, 'rgba(0,255,170,0.6)'
}

export default function AnimatedBackground({ color = 'rgba(0,255,170,0.6)' }: AnimatedBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const points = Array.from({ length: 60 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
        }));

        let animationFrameId: number;

        function draw() {
            width = canvas.width;
            height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();

                for (let j = i + 1; j < points.length; j++) {
                    const q = points[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = color.replace(/,[\d.]*\)$/, `,${1 - dist / 100})`);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            points.forEach(p => {
                p.x = Math.random() * width;
                p.y = Math.random() * height;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />;
}