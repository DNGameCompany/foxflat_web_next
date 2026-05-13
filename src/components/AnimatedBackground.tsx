'use client';

import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
    color?: string;
}

export default function AnimatedBackground({
    color = 'rgba(255,165,0,0.4)',
}: AnimatedBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const pointCount = width < 768 ? 25 : 40;
        const maxDist = 120;
        const maxDistSq = maxDist * maxDist;

        const points = Array.from({ length: pointCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
        }));

        let animationFrameId: number;

        function draw() {
            if (document.hidden) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }

            width = canvas.width;
            height = canvas.height;
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 0.5;

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, 6.283185);
                ctx.fillStyle = color;
                ctx.fill();

                for (let j = i + 1; j < points.length; j++) {
                    const q = points[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < maxDistSq) {
                        const alpha = 1 - Math.sqrt(distSq) / maxDist;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = color.replace(/,[\d.]*\)$/, `,${alpha})`);
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
            points.forEach((p) => {
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
