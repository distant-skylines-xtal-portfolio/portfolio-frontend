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

    const gradientsRef = useRef<CanvasGradient[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true,
            willReadFrequently: false,
        });
        if (!ctx) return;

        function resizeCanvas() {
            if (!canvas) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            gradientsRef.current = [];
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const numLayers = 3;
        const circlesPerLayer = 8;

        //Pre calculate Layer values
        const layerConfigs = Array.from({length: numLayers}, (_, layer) => ({
            layerOffset: layer * 100,
            layerSpeed: 1 + layer * 0.3,
            alpha: intensity / numLayers
        }));

        let offscreenCanvas: OffscreenCanvas | HTMLCanvasElement;
        let offscreenCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

        if (typeof OffscreenCanvas !== 'undefined') {
            offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
            offscreenCtx = offscreenCanvas.getContext('2d', {alpha: true})!;
        } else {
            offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = canvas.width;
            offscreenCanvas.height = canvas.height;
            offscreenCtx = offscreenCanvas.getContext('2d', {alpha: true})!;
        }

        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;
        let lastFrameTime = 0;

        function createGradient(x: number, y: number, size: number) {
            const gradient = offscreenCtx.createRadialGradient(x, y, 0, x, y, size);
            const alphaHex = Math.floor(intensity * 255).toString(16).padStart(2, '0');
            gradient.addColorStop(0, color + alphaHex);
            gradient.addColorStop(0.5, color + '40');
            gradient.addColorStop(1, color + '00');
            return gradient;
        }

        function animate(currentTime: number) {
            if (!canvas) return;
            if (!ctx) return;

            const elapsed = currentTime - lastFrameTime;
            if (elapsed < frameInterval) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = currentTime - (elapsed % frameInterval);

            timeRef.current += 0.01 * speed;

            

            offscreenCtx.clearRect(0, 0, canvas.width, canvas.height);

            //Draw caustic layers
            for (let layer = 0; layer < numLayers; layer++) {
                const config = layerConfigs[layer];

                offscreenCtx.globalCompositeOperation = layer === 0 ? 'source-over' : 'lighter';
                offscreenCtx.globalAlpha = config.alpha;

                for (let i = 0; i < circlesPerLayer; i++) {
                    const x = (Math.sin(timeRef.current * config.layerSpeed + i * 0.7 + config.layerOffset) * 0.5 + 0.5) * canvas.width;
                    const y = (Math.cos(timeRef.current * config.layerSpeed * 0.8 + i * 0.9 + config.layerOffset) * 0.5 + 0.5) * canvas.height;

                    const size = 290 + Math.sin(timeRef.current * 2 + i) * 50;

                    const gradient = createGradient(x, y, size);

                    offscreenCtx.fillStyle = gradient;
                    offscreenCtx.fillRect(x - size, y - size, size * 2, size * 2);
                }
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offscreenCanvas as any, 0, 0);

            animationFrameRef.current = requestAnimationFrame(animate);
        }
        
        animate(0);

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
                transform: 'translateZ(0)',
                willChange: 'transform',
            }}
        />
    )
}