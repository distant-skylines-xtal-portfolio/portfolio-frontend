import {useEffect, useRef, useCallback} from 'react';
import { getRandomCharEng } from "../utils/randomCharacters"

import type {JSX} from 'react';
import { hexToRgb } from '../utils/colorUtils';

type BackgroundMatrixCharactersProps = {
    zIndex?: number,
    textColor?: string;
    caretColor?: string;
    spawnInterval?: number;
    dropInterval?: number;
    fadeOutDuration?: number;
    fontSize?: number;
    maxColumns?: number;
    dropDistance?: number;
}

type MatrixChar = {
    id: string;
    char: string;
    y: number;
    opacity: number;
    createdAt: number;
}

type MatrixColumn = {
    id: string;
    x: number;
    currentY: number;
    characters: MatrixChar[];
    lastUpdate: number;
}

export default function BackgroundMatrixCharacters({
    textColor = '#00ff00',
    caretColor = '#ffffff',
    spawnInterval = 150,
    dropInterval = 100,
    fadeOutDuration = 2000,
    fontSize = 16,
    maxColumns = 50,
    dropDistance = 20,
    zIndex = 1
}:BackgroundMatrixCharactersProps):JSX.Element {
    const animationFrameRef = useRef<number>(0);
    const lastSpawnTimeRef = useRef<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const columnsRef = useRef<Map<string, MatrixColumn>>(new Map());

    const textColorRGB = useRef(hexToRgb(textColor));
    const textColorRGBString = useRef(`${textColorRGB.current.r}, ${textColorRGB.current.g}, ${textColorRGB.current.b}`);

    const charPoolRef = useRef<string[]>([]);

    useEffect(() => {
        charPoolRef.current = Array.from({length: 100}, () => getRandomCharEng(true));
    }, []);

    const animate = useCallback((currentTime: number):void => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px monospace`;

        function getRandomColumnPos() {
            if (!canvasRef.current) return 0;
            const numColumns = Math.floor(canvasRef.current.width / fontSize);
            const randomX = Math.floor(Math.random() * (numColumns + 1)) * fontSize;
            return randomX;
        }

        function getRandomChar(): string {
            return charPoolRef.current[Math.floor(Math.random() * charPoolRef.current.length)];
        }

        //Spawn new column if time is over interval
        if (currentTime - lastSpawnTimeRef.current >= spawnInterval) {
            if (columnsRef.current.size < maxColumns) {
                const id = `matrix-col-${Date.now()}-${Math.random()}`;
                const newColumn: MatrixColumn = {
                    id,
                    x: getRandomColumnPos(),
                    currentY: 0,
                    characters: [],
                    lastUpdate: currentTime,
                };
                columnsRef.current.set(id, newColumn);
            };
            lastSpawnTimeRef.current = currentTime;
        }

        //Move columns and spawn text
        const columnsToDelete: string[] = [];

        ctx.shadowBlur = 0;

        columnsRef.current.forEach((column, id) => {
            //move column if greater than drop interval
            if (currentTime - column.lastUpdate >= dropInterval) {
                column.currentY += dropDistance;
                column.lastUpdate = currentTime;

                //Add new character
                if (column.currentY <= canvas.height) {
                    const charId = `matrix-char-${Date.now()}-${Math.random()}`;
                    const newChar: MatrixChar = {
                        id: charId,
                        char: getRandomChar(),
                        createdAt: currentTime,
                        opacity: 1,
                        y: column.currentY - dropDistance,
                    }
    
                    column.characters.push(newChar);
                }
            }

            const visibleChars: MatrixChar[] = [];

            //Render and cull chars
            column.characters = column.characters.filter(char => {
                const age = currentTime - char.createdAt;
                char.opacity = Math.max(0, 1 - (age / fadeOutDuration));

                if (char.opacity > 0) {
                    visibleChars.push(char);
                    return true;
                }
                return false;
            });

            // Render all characters in this column with same settings
            if (visibleChars.length > 0) {
                visibleChars.forEach(char => {
                    const roundedOpacity = Math.round(char.opacity * 10) / 10;
                    ctx.fillStyle = `rgba(${textColorRGBString.current}, ${roundedOpacity})`;
                    
                    ctx.fillText(char.char, column.x, char.y);
                });
            }

            // Render Caret with shadow (only one per column)
            if (column.currentY <= canvas.height) {
                ctx.fillStyle = caretColor;
                ctx.shadowColor = caretColor;
                ctx.shadowBlur = 10;
                ctx.fillRect(column.x, column.currentY, fontSize, fontSize);
                ctx.shadowBlur = 0; // Reset immediately
            }

            if (column.currentY > canvas.height + 100 && column.characters.length === 0) {
                columnsToDelete.push(id);
            }
        });

        columnsToDelete.forEach(id => columnsRef.current.delete(id));

        animationFrameRef.current = requestAnimationFrame(animate);
        
    }, [spawnInterval, dropInterval, dropDistance, fadeOutDuration, fontSize, maxColumns, 
        caretColor,
    ]);

    //Setup canvas and start animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true,
            willReadFrequently: false
        });
        if (!ctx) return;

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        //Start animation
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, [animate])

    return (
        <canvas
            ref={canvasRef}
            className='matrix-background-canvas'
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex,
                transform: 'translateZ(0)',
                willChange: 'transform',
            }} 
        />
    )
}