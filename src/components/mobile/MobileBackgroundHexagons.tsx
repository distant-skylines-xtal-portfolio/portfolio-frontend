import {useEffect, useState, useCallback} from 'react'
import type {JSX} from 'react';
import {motion} from "framer-motion";
import { Point } from '../../types/ExpandableCard.types';

type HexagonIndex = {
    col: number;
    row: number;
}

type MovingHexagon = {
    id: string;
    startPos: Point;
    timestamp: number;
    filledIn: boolean;
}

type BackgroundHexagonsProps = {
    zIndex?: number
}

const initialHexagons: HexagonIndex[] = [
        // Column 0
        { col: 0, row: 0 },
        { col: 0, row: 1 },
        { col: 0, row: 2 },
        { col: 0, row: 3 },
        { col: 0, row: 4 },
        { col: 0, row: 5 },
        { col: 0, row: 6 },
        { col: 0, row: 7 },
        { col: 0, row: 8 },
        { col: 0, row: 9 },
        { col: 0, row: 10 },
        // Column 1
        { col: 1, row: 0 },
        { col: 1, row: 1 },
        { col: 1, row: 2 },
        { col: 1, row: 3 },
        { col: 1, row: 4 },
        { col: 1, row: 5 },
        { col: 1, row: 6 },
        { col: 1, row: 7 },
        { col: 1, row: 8 },
        { col: 1, row: 9 },
        { col: 1, row: 10 },
        // Column 2
        { col: 2, row: 0 },
        { col: 2, row: 1 },
        { col: 2, row: 2 },
        { col: 2, row: 3 },
        { col: 2, row: 4 },
        { col: 2, row: 5 },
        { col: 2, row: 6 },
        { col: 2, row: 7 },
        { col: 2, row: 8 },
        { col: 2, row: 9 },
        { col: 2, row: 10 },
        // Column 3
        { col: 3, row: 1 },
        { col: 3, row: 2 },
        { col: 3, row: 3 },
        { col: 3, row: 4 },
        { col: 3, row: 5 },
        { col: 3, row: 6 },
        { col: 3, row: 7 },
        // Column 4
        { col: 4, row: 2 },
        { col: 4, row: 3 },
        { col: 4, row: 4 },
        { col: 4, row: 6 },
        { col: 4, row: 7 },
    ]
    
const spawnPositions: HexagonIndex[] = [
    { col: 3, row: 0 },
    { col: 3, row: 8 },
    { col: 3, row: 9 },
    { col: 3, row: 10 },
    { col: 4, row: 1 },
    { col: 4, row: 5 },
    { col: 4, row: 8 },
    { col: 5, row: 3 },
    { col: 5, row: 4 },
    { col: 5, row: 5 },
    { col: 5, row: 6 },
    ];

export default function MobileBackgroundHexagons({zIndex=50}:BackgroundHexagonsProps): JSX.Element {
    const [movingHexagons, setMovingHexagons] = useState<MovingHexagon[]>([]);

    const hexagonSize = 100;
    const gap = 10;
    const strokeWidth = 4;
    const strokeColor = '#000000';

    const hexWidth = hexagonSize * 0.866;
    const hexHeight = hexagonSize * 0.866;
    const horizontalSpacing = hexWidth * 0.866 + gap;
    const verticalSpacing = hexHeight + gap;

    const getHexPositionCallback = useCallback(getHexPosition, [horizontalSpacing, verticalSpacing]);

    function getHexPosition(col: number, row: number) {
        const offsetY = col % 2 === 1 ? verticalSpacing / 2 : 0;
        return {
            x: col * horizontalSpacing,
            y: row * verticalSpacing + offsetY,
        }; 
    }

    function getHexPath(centerX: number, centerY: number, size: number) {
        const points: [number, number][] = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = centerX + (size / 2) * Math.cos(angle);
            const y = centerY + (size / 2) * Math.sin(angle);
            points.push([x, y]);
        }

        return `M ${points[0][0]} ${points[0][1]}` + 
                points.slice(1).map(p => `L  ${p[0]} ${p[1]}`).join(' ') + ' Z';
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const randomSpawn = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
            const startPos = getHexPositionCallback(randomSpawn.col, randomSpawn.row);
            const filledIn = Math.random() > 0.5;
            const newHexagon: MovingHexagon = {
                id: `moving-hexagon-${Date.now()}`,
                startPos,
                timestamp: Date.now(),
                filledIn: filledIn,
            };

            setMovingHexagons(prev => [...prev, newHexagon]);
        }, 2500)

        return () => clearInterval(interval);
    }, [getHexPositionCallback])

    useEffect(() => {
        const cleanup = setInterval(() => {
            setMovingHexagons(prev => 
                prev.filter(hex => Date.now() - hex.timestamp < 16000)
            );
        }, 1000);

        return () => clearInterval(cleanup);
    }, [])


    return (
        <div className='hexagons' 
            style={{width: '100%', height: '100%', display: 'inline', zIndex:zIndex}}
        >
            <svg
                width="100%"
                height="100%"
                style={{position: 'absolute', top: 0, left: 0, opacity: 0.4, zIndex:zIndex}}
            >
                {initialHexagons.map((hex, index) => {
                    const pos = getHexPositionCallback(hex.col, hex.row);
                    const path = getHexPath(pos.x, pos.y, hexagonSize);
                    
                    return (
                        <path
                            key={`static-hex-${index}`}
                            d={path}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            fill={index % 3 === 0 ? 'none' : 'fill'}
                        >

                        </path>
                    )
                })}
                {movingHexagons.map(hex => {
                    const path = getHexPath(hex.startPos.x, hex.startPos.y, hexagonSize);
                    return (
                        <motion.path
                            key={`moving-hex-${hex.id}-${hex.timestamp}`}
                            id={`moving-hex-time-${hex.timestamp}`}
                            d={path}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            fill={hex.filledIn ? 'fill' : 'none'}
                            initial={{pathLength: 0, opacity: 0, x: 0, fillOpacity: 0}}
                            animate={{pathLength: 1, opacity: 1, x: window.innerWidth, fillOpacity: hex.filledIn ? 1 : 0}}
                            transition={{
                                pathLength: {duration: 2, ease: 'easeInOut'},
                                opacity: {duration: 0.5},
                                x: {duration: 10, delay: 1.5, ease: 'easeIn'},
                                fillOpacity: {duration: 2, ease:"easeIn"}
                            }}
                        />
                    )
                })}
            </svg>

        </div>
    )
}