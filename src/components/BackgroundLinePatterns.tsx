import { motion } from "framer-motion";
import type { Point } from "../types/ExpandableCard.types";
import {useState, useEffect, } from "react";
import type {JSX} from 'react';

type MovingShape = {
    id: string;
    startPos: Point;
    timestamp: number;
}

type BackgroundLinePatternProps = {
    zIndex?: number;
    yScreenPercentage?: number;
}

export default function BackgroundLinePatterns({zIndex=49, yScreenPercentage=0.1}:BackgroundLinePatternProps):JSX.Element {
    
    const [movingShapes, setMovingShapes] = useState<MovingShape[]>([]);
    const [firstRowPos, setFirstRowPos] = useState(0);
    const strokeColor = '#000000ff';
    const strokeWidth = '3px';
    const movingShapeInterval = 3000;
    const movingShapAnimDuration = 20000;

    useEffect(() => {
        const calculatePosition = () => {
            const backgroundCanvas = document.getElementById('background-canvas');
            const backgroundRect = backgroundCanvas?.getBoundingClientRect();
            const newPos = backgroundRect ? (backgroundRect.bottom - (backgroundRect.height * yScreenPercentage)) : 
                window.innerHeight * 0.9;
            console.log(`newPos: ${newPos}`);
            setFirstRowPos(newPos);
        };

        calculatePosition();
        window.addEventListener('resize', calculatePosition);
        
        return () => window.removeEventListener('resize', calculatePosition);
    }, [yScreenPercentage]);


    useEffect(() => {
        const spawnInterval = setInterval(() => {
            const timestamp = Date.now();
            const newMovingShape:MovingShape = {
                id: `moving-shape-${timestamp}`,
                startPos: {x: window.innerWidth + 50, y: (firstRowPos - 15)},
                timestamp: timestamp,
            } 
            setMovingShapes(prev => [...prev, newMovingShape]);
        }, movingShapeInterval)

        return () => clearInterval(spawnInterval);
    }, [firstRowPos]);

    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            setMovingShapes(prev => 
                prev.filter(shape => Date.now() - shape.timestamp < movingShapAnimDuration + 1000)
            );
        }, 1000);

        return () => clearInterval(cleanupInterval);
    }, [])

    const linePath = `M ${0} ${firstRowPos} ` + 
                     `L ${window.innerWidth} ${firstRowPos}`;

    function getShapePath(startPosX: number, startPosY: number):string {
        const firstCoord = {x: startPosX, y: startPosY - 15};
        const secondCoord = {x: startPosX - 30, y: startPosY - 15};
        const thirdCoord = {x: startPosX - 30, y: startPosY};
        return `M ${startPosX} ${startPosY} ` + 
                `L ${firstCoord.x} ${firstCoord.y} ` + 
                `L ${secondCoord.x} ${secondCoord.y} ` + 
                `L ${thirdCoord.x} ${thirdCoord.y} `;
    }


    return (
        <div className='moving-shapes'
            style={{width: '100%', height: '100%', display:'inline', pointerEvents:'none', zIndex:zIndex}}
        >
            <svg
                width='100%'
                height='100%'
                style={{position: 'absolute', top: 0, left: 0, opacity: 0.3, zIndex:zIndex}}
            >
                <path
                    key={`static-line-${Date.now()}`}
                    id={`static-line-${Date.now()}`}
                    d={linePath}
                    stroke="#000000"
                    strokeWidth='3px'
                    fill='none'
                >
                </path>

                {movingShapes.map(shape => {
                    const path = getShapePath(shape.startPos.x, shape.startPos.y);
                    return (
                        <motion.path
                            key={`moving-shape-${shape.id}`}
                            id={`moving-shape-${shape.id}`}
                            d={path}
                            fill='none'
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            initial={{x: 0}}
                            animate={{x: -window.innerWidth - 200}}
                            transition={{
                                x: {duration: movingShapAnimDuration / 1000, ease:'linear'}
                            }}
                        >

                        </motion.path>
                    ) 
                })

                }
            </svg>
        </div>
    )
}