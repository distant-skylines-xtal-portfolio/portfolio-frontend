import { useEffect, useRef } from "react";
import type {JSX} from 'react';

type BackgroundAnimatedCausticsProps = {
    zIndex?: number;
    intensity?: number;
    speed?: number;
    color?: string;
}

export default function BackgroundAnimatedCaustics({
    zIndex = 50,
    intensity = 0.6,
    speed = 0.5,
    color = '#4a9eff'
}:BackgroundAnimatedCausticsProps):JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);
    const timeRef = useRef(0);    

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        function resizeCanvas() {
            if (!canvas) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const numLayers = 3;

        function animate() {
            if (!canvas) return;
            if (!ctx) return;

            timeRef.current += 0.01 * speed;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //Draw caustic layers
            for (let layer = 0; layer < numLayers; layer++) {
                const layerOffset = layer * 100;
                const layerSpeed = 1 + layer * 0.3;

                ctx.globalCompositeOperation = layer === 0 ? 'source-over' : 'lighter';
                ctx.globalAlpha = intensity / numLayers;

                for (let i = 0; i < 8; i++) {
                    const x = (Math.sin(timeRef.current * layerSpeed + i * 0.7 + layerOffset) * 0.5 + 0.5) * canvas.width;
                    const y = (Math.cos(timeRef.current * layerSpeed * 0.8 + i * 0.9 + layerOffset) * 0.5 + 0.5) * canvas.height;

                    const size = 290 + Math.sin(timeRef.current * 2 + i) * 50;

                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
                    gradient.addColorStop(0, color + Math.floor(intensity * 255).toString(16).padStart(2, '0'));
                    gradient.addColorStop(0.5, color + '40');
                    gradient.addColorStop(1, color + '00');

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            animationFrameRef.current = requestAnimationFrame(animate);
        }
        
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, [color, intensity, speed]);


    return (
        <canvas
            ref={canvasRef} 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex,
                pointerEvents: 'none',
                opacity: 0.7,
            }}
        />
    )
}