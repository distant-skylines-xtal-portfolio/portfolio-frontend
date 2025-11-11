import { AnimatePresence } from 'framer-motion';
import {useEffect, useRef, useState} from 'react'; 
import { motion } from 'framer-motion';
import { JSX } from 'react';
import { ExpandableCardMethods, Point } from '../types/ExpandableCard.types';
import ExpandableCard from './ExpandableCard';


type DropdownCardProps = {
    options: string[],
    position: Point,
    cardWidth?: number,
    cardHeight?: number,
    cardKey: string,
    animDuration?: number,
    initialSelectedOption?: number,
    defaultText?: string,
    alwaysDisplayDefaultText?: boolean,
    onOptionSelect?: (option: string) => void;
}

export default function DropdownCard({
    options, 
    position,
    cardWidth=200, cardHeight=30,
    cardKey,
    animDuration=0.2,
    initialSelectedOption=-1,
    defaultText='Select Option',
    alwaysDisplayDefaultText=false,
    onOptionSelect,
}:DropdownCardProps):JSX.Element {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(
        initialSelectedOption !== -1 ? options[initialSelectedOption] : ""
    ); 
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(initialSelectedOption);
    const dropdownExpandableCardRef = useRef<ExpandableCardMethods>(null);
    const parentDropdownRef = useRef<HTMLDivElement>(null);
    const cardGap = 5;

    const container = parentDropdownRef.current?.closest('.card-canvas');
    let offset = {x: 0, y: 0};
    if (container) {
        const containterRect = container.getBoundingClientRect();
        offset.x = containterRect.left;
        offset.y = containterRect.top;
    }

    const relativePosition = {
        x: position.x + offset.x,
        y: position.y + offset.y,
    }

    useEffect(() => {
        setSelectedOption(options[selectedOptionIndex]);
    }, [selectedOptionIndex, options])

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleMouseClickOutside(event: MouseEvent) {
            if (parentDropdownRef.current && 
                !parentDropdownRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
        }

        document.addEventListener('mousedown', handleMouseClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleMouseClickOutside);
        }
    }, [isOpen])



    function getOptionYOffset(index: number):number {
        if (index === 0) {
            return cardHeight + cardGap;
        }

        return ((index + 1) * (cardGap + cardHeight));
    }
    
    function handleCardClick() {
        setIsOpen(prev => !prev);
    }

    function handleOptionClick(option:string, index:number) {
        setSelectedOption(option);
        setSelectedOptionIndex(index);
        setIsOpen(false);
        onOptionSelect?.(option);
    }


    return (

        <div
            ref={parentDropdownRef}
            style={{
                position: 'absolute',
                left: relativePosition.x,
                top: relativePosition.y,
            }}
            
        >
            {/* Parent card */}
            <ExpandableCard
                key={cardKey}
                id={cardKey}
                ref={dropdownExpandableCardRef}
                x={0}
                y={0}
                width={cardWidth}
                height={cardHeight}
                autoExpand={true}
                animDelay={0.5}
                onCardClick={() => handleCardClick()}
                className='dropdown-card'
            >
                <div className="dropdown-selected-content"
                >
                    {selectedOption === "" ? 
                        <span>{defaultText} {isOpen ? '▲' : '▼'}</span> :
                        <span>{alwaysDisplayDefaultText ? defaultText + ': ' + selectedOption : selectedOption} {isOpen ? '▲' : '▼'}</span>
                    }
                    
                </div>
            </ExpandableCard>

            {/* Option cards */}
                <div 
                    className="dropdown-options-holder"
                    style={{
                        position: 'absolute',
                        
                        width: cardWidth,
                        height: cardHeight,
                    }}
                    >
                    <AnimatePresence>
                    { isOpen && options.map((option, index) => (
                        <motion.div
                            key={`${cardKey}-option-${option}`}
                            className='dropdown-option'
                            style={{
                                transformOrigin: 'center center',
                                position: 'absolute',
                                backgroundColor: (selectedOption === option ? 
                                    '#000000ff' : 
                                    '#5c5c58ff'
                                ),
                                pointerEvents: 'visibleFill'
                            }}
                            initial={{
                                opacity: 1, 
                                x: 0,
                                y: 0,
                                width: cardWidth,
                                height: cardHeight,
                                scale: 1,
                                zIndex: 10 - index,
                            }}
                            animate={{
                                x: 0,
                                y: getOptionYOffset(index),
                                scale: 1,
                                opacity: 1,
                            }}
                            exit={{
                                x: 0, 
                                y: 0,
                                scale: 0.8,
                                opacity: 0,
                                zIndex: 10 - index,
                            }}
                            transition={{
                                duration: (animDuration * (index + 1)),
                                delay: 0,
                                ease: 'linear'
                            }}
                            onClick={() => (handleOptionClick(option, index))}
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: ('#2b2b29'
                                )
                            }}
                        >
                            <span style={{pointerEvents: 'none'}}>{option}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                </div>
        </div>
    )
}