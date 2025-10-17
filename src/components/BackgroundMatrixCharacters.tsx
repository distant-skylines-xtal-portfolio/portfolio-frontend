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

    const textColorRGB = hexToRgb(textColor);

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
                        char: getRandomCharEng(true),
                        createdAt: currentTime,
                        opacity: 1,
                        y: column.currentY - dropDistance,
                    }
    
                    column.characters.push(newChar);
                }
            }

            //Render and cull chars
            column.characters = column.characters.filter(char => {
                const age = currentTime - char.createdAt;
                char.opacity = Math.max(0, 1 - (age / fadeOutDuration));

                //Render char if visible
                if (char.opacity > 0) {
                    ctx.fillStyle = `rgba(${textColorRGB.r}, ${textColorRGB.g}, ${textColorRGB.b}, ${char.opacity})`;
                    ctx.shadowColor = textColor;
                    ctx.shadowBlur = 5 * char.opacity;
                    ctx.fillText(char.char, column.x, char.y);
                    ctx.shadowBlur = 0;
                    return true;
                }

                //otherwise filter from list
                return false;
            })

            //Render Caret
            if (column.currentY <= canvas.height) {
                ctx.fillStyle = caretColor;
                ctx.shadowColor = caretColor;
                ctx.shadowBlur = 10;
                ctx.fillRect(column.x, column.currentY, fontSize, fontSize);
                ctx.shadowBlur = 0;
            }

            if (column.currentY > canvas.height + 100 && column.characters.length === 0) {
                columnsToDelete.push(id);
            }
        })

        columnsToDelete.forEach(id => columnsRef.current.delete(id));

        animationFrameRef.current = requestAnimationFrame(animate);
        
    }, [spawnInterval, dropInterval, dropDistance, fadeOutDuration, fontSize, maxColumns, 
        textColor, caretColor, textColorRGB
    ]);

    //Setup canvas and start animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

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
                zIndex
            }} 
        />
    )
}