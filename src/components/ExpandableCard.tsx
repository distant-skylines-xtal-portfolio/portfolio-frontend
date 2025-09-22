import React, {useEffect, useRef, useCallback} from 'react'
import type {JSX} from 'react'
import {motion, ViewportEventHandler} from "framer-motion";
import { cardDimensionsType, ExpandableCardMethods } from '../types/ExpandableCard.types';
import { CardPointsDebug } from './CardPointsDebug';

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

export default function ExpandableCard({children, 
        animDuration = 1,
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

    useEffect(() => {
        if (autoExpand) {
            setIsExpanded(true);
        }
    }, [autoExpand]);

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

    
    // useEffect(() => {
    //     if (isExpanded) {
    //         const timer  = setTimeout(() => {
    //             const newDimensions = getCardDimensions();
    //             setHasFinishedExpanding(true);
    //             onExpansionComplete?.(cardId, newDimensions);
    //         }, (animDuration + animDelay) * 1000)

    //         return () => clearTimeout(timer)
    //     }

    // }, [isExpanded, animDelay, animDuration, cardId, onExpansionComplete])



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
            }}
            animate={isExpanded ? {width: width, height: height,
                    x: 0,
                    y: 0,
            } : {width: 1, height: 1, 
                x: (width / 2 - 0.5),
                y: (height / 2 - 0.5),
            }} 
            exit={{width: 1, height: 1, 
                    x: (width / 2 - 0.5),
                    y: (height / 2 - 0.5),
            }}
            transition={{duration: animDuration, delay: isExpanded? animDelay : animDuration}}

            onClick={() => {onCardClick?.()}}
            
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
        </motion.div>
    )
}