import React, {useEffect, useRef} from 'react'
import type {JSX} from 'react'
import {AnimatePresence, animateVisualElement, motion} from "framer-motion";
import { isExportAssignment } from 'typescript';

type ExpandableCardProps = {
    children: React.ReactNode;
    animDuration?: number;
    animDelay?: number;
    autoExpand?: boolean;
    cardId: string;
    onExpansionComplete?: (cardId: string, position: cardDimensionsType | null) => void;
}

type cardDimensionsType = {
    center: {x: number, y: number};
    width: number,
    height: number,
    top: number,
    left: number,
    connectionPoints: {
        top: {x:number, y:number},
        bottom: {x:number, y:number},
        left: {x:number, y:number},
        right: {x:number, y:number},
    }
}

export default function ExpandableCard({children, 
        animDuration = 1,
        animDelay = 3, 
        autoExpand = true,
        cardId,
onExpansionComplete}: ExpandableCardProps):JSX.Element {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const [hasFinishedExpanding, setHasFinishedExpanding] = React.useState(false);
    const finalWidth = 400;
    const finalHeight = 300;
    const cardRef = useRef<HTMLDivElement>(null);
    
    function getCardDimensions():cardDimensionsType|null{
        if (!cardRef.current) return null;
        const rect = cardRef.current.getBoundingClientRect();

        const center = {
            x: rect.left + finalWidth / 2,
            y: rect.top + finalHeight / 2,
        };

        const newDimensions:cardDimensionsType = {
            center: center,
            width: finalWidth,
            height: finalHeight,
            left: rect.left,
            top: rect.top,
            connectionPoints: {
                top: {x:center.x, y:center.y - finalHeight / 2},
                bottom: {x:center.x, y:center.y + finalHeight / 2},
                left: {x:center.x - finalWidth / 2, y:center.y},
                right: {x:center.x + finalWidth / 2, y:center.y},
            }            
        }

        return newDimensions;
    }
    
    function handleClick():void {
        setIsExpanded((prev) => {return !prev});
    }

    useEffect(() => {
        if (autoExpand) {
            setIsExpanded(true);
        }
    }, [])

    useEffect(() => {
        !isExpanded && setHasFinishedExpanding(false); 
    }, [isExpanded])

    useEffect(() => {
        if (isExpanded) {
            const timer  = setTimeout(() => {
                const newDimensions = getCardDimensions();
                setHasFinishedExpanding(true);
                onExpansionComplete?.(cardId, newDimensions);
            }, (animDuration + animDelay) * 1000)

            return () => clearTimeout(timer)
        }

    }, [isExpanded, animDelay, animDuration, cardId, onExpansionComplete])


    const DebugOverlay = (positions: cardDimensionsType|null) => {
        if (!positions) return null;

        return (
            <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1000,
            }}
            >
            {/* Connection point dots */}
            <circle
                cx={positions.connectionPoints.top.x}
                cy={positions.connectionPoints.top.y}
                r="4"
                fill="red"
            />
            <circle
                cx={positions.connectionPoints.right.x}
                cy={positions.connectionPoints.right.y}
                r="4"
                fill="blue"
            />
            <circle
                cx={positions.connectionPoints.bottom.x}
                cy={positions.connectionPoints.bottom.y}
                r="4"
                fill="green"
            />
            <circle
                cx={positions.connectionPoints.left.x}
                cy={positions.connectionPoints.left.y}
                r="4"
                fill="yellow"
            />
            
            {/* Center point for reference */}
            <circle
                cx={positions.center.x}
                cy={positions.center.y}
                r="6"
                fill="purple"
                fillOpacity="0.7"
            />
            </svg>
        );
    };



    return (
        <motion.div className='card-expandable-border' ref={cardRef} 
            initial={{width: 1, height: 1, 
                    x: (finalWidth / 2 - 0.5),
                    y: (finalHeight / 2 - 0.5),
            }}
            animate={isExpanded ? {width: finalWidth, height: finalHeight,
                    x: 0,
                    y: 0,
            } : {width: 1, height: 1, 
                x: (finalWidth / 2 - 0.5),
                y: (finalHeight / 2 - 0.5),
            }} 
            exit={{width: 1, height: 1, 
                    x: (finalWidth / 2 - 0.5),
                    y: (finalHeight / 2 - 0.5),
            }}
            transition={{duration: animDuration, delay: isExpanded? animDelay : animDuration}}
            style={{originX:0.5, originY:0.5, cursor:'pointer'}}
            onClick={handleClick}
        >
            
            <motion.div className='card-expandable-content'
                initial={{scale: 0}}
                animate={{scale: isExpanded ? 1 : 0}}
                exit={{scale: 0}}
                transition={{duration: animDuration, delay: isExpanded ? animDelay : animDuration * 0.3}}
                style={{originX:0.5, originY:0.5}}
            >
                {
                    (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: isExpanded ? 1 : 0}}
                            exit={{opacity: 0}}
                            transition={{
                                duration:isExpanded ? animDuration : animDuration * 0.3, 
                                delay: isExpanded ? (animDuration + animDelay + 1) : 0
                            }}
                        >
                            {children}
                        </motion.div>
                    )
                }
                {hasFinishedExpanding && DebugOverlay(getCardDimensions())}
            </motion.div>
            
            
            
        </motion.div>
    )
}