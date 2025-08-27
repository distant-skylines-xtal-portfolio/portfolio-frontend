import React from 'react'
import type {JSX} from 'react'
import {AnimatePresence, motion} from "framer-motion";
import { isExportAssignment } from 'typescript';

type ExpandableCardProps = {
    children: React.ReactNode;
    animDuration?: number;
    animDelay?: number;
}

export default function ExpandableCard({children, animDuration = 1, animDelay = 3}: ExpandableCardProps):JSX.Element {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const finalWidth = 400;
    const finalHeight = 300;

    function handleClick():void {
        setIsExpanded((prev) => {return !prev});
    }

    return (
        <motion.div className='card-expandable-border'
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
            </motion.div>
            

            
        </motion.div>
    )
}