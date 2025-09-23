import React, {useEffect } from 'react'
import type {JSX} from 'react'
import {AnimatePresence, motion, useTime} from "framer-motion";
import { cardDimensionsType, ExpandableCardMethods } from '../types/ExpandableCard.types';

type ExpandableCardProps = {
    children: React.ReactNode;
    id: string;
    width?: number;
    height?: number;
    animDuration?: number;
    animDelay?: number;
    autoExpand?: boolean;
    className: string;
    x: number;
    y: number;
    onExpansionComplete?: (cardId: string, position: cardDimensionsType | null) => void;
    onCardClick?: () => void;
    ref?: React.RefObject<ExpandableCardMethods | null>;
}

type WaveAnimation = {
    id: number;
    timestamp: number;
}

export default function ExpandableCard({children, 
        animDuration = 0.5,
        animDelay = 0.3, 
        autoExpand = false,
        id,
        ref,
        x, y,
        width=400, height=300,
        className="",
        onExpansionComplete, 
        onCardClick
}: ExpandableCardProps):JSX.Element {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [expansionComplete, setExpansionComplete] = React.useState(false);
    const [clickWaves, setClickWaves] = React.useState<WaveAnimation[]>([]);

    const borderOffset = 5;
    const aspectRatio = width / height;
    const waveAnimLength = 1.5;
    //Check for auto expand
    useEffect(() => {
        if (autoExpand) {
            setIsExpanded(true);
        }
    }, [autoExpand]);

    //Track when card has finished expanding
    useEffect(() => {
        if (!isExpanded) {
            return;
        }
        
        const expandCompleteTimer = setTimeout(() => {
            setExpansionComplete(true);    
        }, (animDelay + animDuration) * 1000)

        return () => clearTimeout(expandCompleteTimer);
    }, [isExpanded])

    //Expose internal methods
    useEffect(() => {
        if (ref && 'current' in ref) {
            ref.current = {
                expand: () => setIsExpanded(true),
                collapse: () => setIsExpanded(false),
                toggle: () => setIsExpanded(prev => !prev),
                isExpanded: () => isExpanded,
            };
        };
    })

    function handleCardClick() {
        if (!expansionComplete) {
            return;
        }

        console.log('Adding new click Waves!')
        const newWave:WaveAnimation = {
            id: Date.now(),
            timestamp: Date.now()
        }

        setClickWaves(prev => [...prev, newWave]);

        const deleteWaveTimeout = setTimeout(() => {
            setClickWaves(prev => prev.filter(wave => wave.id !== newWave.id));
        }, waveAnimLength * 1000)

        onCardClick?.()
    }

    return (
        <motion.div className='card-expandable-border' 
            style={{
                position: 'absolute',
                left: x,
                top: y,
                cursor: 'pointer',
                transformOrigin: 'center center',
                zIndex: 10,
            }}
            id={id}
            initial={{width: 1, height: 1, 
                    x: (width / 2 - 0.5),
                    y: (height / 2 - 0.5),
                    opacity: 0,
            }}
            animate={isExpanded ? {width: width, height: height,
                    x: 0,
                    y: 0,
                    opacity: 1,
            } : {width: 1, height: 1, 
                x: (width / 2 - 0.5),
                y: (height / 2 - 0.5),
                opacity: 0,
            }} 
            exit={{width: 1, height: 1, 
                    x: (width / 2 - 0.5),
                    y: (height / 2 - 0.5),
                    opacity: 0,
            }}
            transition={{duration: animDuration, delay: isExpanded? animDelay : animDuration}}

            onClick={handleCardClick}
            
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
            </motion.div>

            {/* Hover & click border */}
            {
                expansionComplete && (
                <motion.div id='hover-border' 
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        backgroundColor: 'transparent',
                        border: '3px solid white'
                    }}
                    initial={{width: width + borderOffset, height: height + borderOffset, opacity: 0,
                        x: -borderOffset / 2 - 1,
                        y: -borderOffset / 2 - 1,
                    }}
                    whileHover={{
                        width: width + borderOffset + 15,
                        height: height + borderOffset + 15 ,
                        x: -((borderOffset + 15) / 2) - 1,
                        y: -((borderOffset + 15) / 2) - 1,
                        opacity: 1,
                        transition: {repeat: Infinity, repeatType: "reverse", duration: 0.5,
                        }
                    }}
                    transition={{duration: 0.2, ease:'linear'}}
                >

                </motion.div>
            )}

            {/* Click waves */}
            <AnimatePresence>
                {expansionComplete && clickWaves.map((wave, index) => (
                    <React.Fragment key={wave.id}>
                        {/* Wave 1 */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                backgroundColor: 'transparent',
                                border: '2px solid white',
                                pointerEvents: 'none'
                            }}
                            initial={{
                                width: width + borderOffset,
                                height: height + borderOffset,
                                x: -borderOffset / 2 - 1,
                                y: -borderOffset / 2 - 1,
                                opacity: 0.8
                            }}
                            animate={{
                                width: width + 80,
                                height: height + 80,
                                x: -40 - 1,
                                y: -40 - 1,
                                opacity: 0,
                            }}
                            exit={{
                                opacity: 0
                            }}
                            transition={{
                                duration: 0.8,
                                ease: 'easeOut'
                            }}
                        />
                        {/* Wave 2 */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                backgroundColor: 'transparent',
                                border: '2px solid white',
                                pointerEvents: 'none'
                            }}
                            initial={{
                                width: width + borderOffset,
                                height: height + borderOffset,
                                x: -borderOffset / 2 - 1,
                                y: -borderOffset / 2 - 1,
                                opacity: 0.8
                            }}
                            animate={{
                                width: width + 120,
                                height: height + 120,
                                x: -60 - 1,
                                y: -60 - 1,
                                opacity: 0,
                            }}
                            exit={{
                                opacity: 0
                            }}
                            transition={{
                                duration: 0.8,
                                ease: 'easeOut',
                                delay: 0.1,
                            }}
                        />
                        {/* Wave 2 */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                backgroundColor: 'transparent',
                                border: '2px solid white',
                                pointerEvents: 'none'
                            }}
                            initial={{
                                width: width + borderOffset,
                                height: height + borderOffset,
                                x: -borderOffset / 2 - 1,
                                y: -borderOffset / 2 - 1,
                                opacity: 0.8
                            }}
                            animate={{
                                width: width + 150,
                                height: height + 150,
                                x: -75 - 1,
                                y: -75 - 1,
                                opacity: 0,
                            }}
                            exit={{
                                opacity: 0
                            }}
                            transition={{
                                duration: 0.8,
                                ease: 'easeOut',
                                delay: 0.2,
                            }}
                        />
                    </React.Fragment>
                ))}

            
            </AnimatePresence>
        </motion.div>
    )
}