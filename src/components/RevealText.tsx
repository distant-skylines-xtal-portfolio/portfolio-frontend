import React, { useCallback, useEffect, useMemo, useRef } from "react"
import type {JSX} from 'react'


import { getRandomCharEng } from "../utils/randomCharacters"
import { useReducedMotion } from "framer-motion"

type textElementType = 'normal' | 'title';

type revealTextProps = {
    text: string,
    textClass: string,
    durationNextChar?: number,
    durationPerChar?: number
    numberOfScramblePerChar?: number,
    initialDelay?: number,
    revealMultipleChars?: boolean,
    autoStart?: boolean,
    elementType?: textElementType
    onComplete?: () => void,
    onCharacterRevealed?: (index: number, char: string) => void,
    
}

type timeoutId = ReturnType<typeof setTimeout> | undefined;

type timersRefType = {
    progress: timeoutId,
    scramblers: Map<string, timeoutId>
}

export default function RevealText({
    text, textClass, 
    numberOfScramblePerChar=5, durationNextChar=500, initialDelay=100, 
    durationPerChar=50,
    revealMultipleChars=true, autoStart=true, 
    elementType='normal',
    onComplete, onCharacterRevealed
}: revealTextProps):JSX.Element {
        
    const shouldReduceMotion = useReducedMotion();
    
    const [displayedText, setDisplayedText] = React.useState(Array.from({length: text.length}, () => ""));
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [hasStarted, setHasStarted] = React.useState(false);

    const timersRef = useRef<timersRefType>({progress: undefined, scramblers: new Map()});
    const completedCharsRef = useRef<Set<number>>(new Set());
    
    useEffect(() => {
        if (shouldReduceMotion) {
            setDisplayedText(Array.from(text));
            setIsAnimating(false);
            onComplete?.();
            return;
        }
    }, [shouldReduceMotion, text, onComplete])
    
    const clearAllTimers = useCallback(() => {
        if (timersRef.current.progress) {
            clearTimeout(timersRef.current.progress);
            timersRef.current.progress = undefined;
        }
        
        if (timersRef.current.scramblers) {
            timersRef.current.scramblers.forEach(scrambler => {
                if (scrambler) {
                    clearTimeout(scrambler);
                } 
            })
            timersRef.current.scramblers.clear();
        }
    }, []);
    
    const startAnimation = useCallback(() => {
        if (hasStarted) return;
        
        setIsAnimating(true);
        setHasStarted(true);
        completedCharsRef.current.clear();
        
        const startScrambling = (charIndex: number) => {
            const scramble = (currentScrambleCount: number) => {
                // Display a random character if we are under the scramblePerChar count
                if (currentScrambleCount < numberOfScramblePerChar) {
                    setDisplayedText(prev => {
                        const newText = [...prev];
                        newText[charIndex] = getRandomCharEng();
                        return newText;
                    });

                    const timerId = setTimeout(() => {
                        scramble(currentScrambleCount + 1);
                    }, durationPerChar);
                    
                    timersRef.current.scramblers.set(`${charIndex}-${currentScrambleCount}`, timerId);
                } else {
                    // Final character reveal
                    setDisplayedText(prev => {
                        const newText = [...prev];
                        newText[charIndex] = text[charIndex];
                        return newText;
                    });
                    
                    completedCharsRef.current.add(charIndex);
                    onCharacterRevealed?.(charIndex, text[charIndex]);
                    
                    // Check if all characters are complete
                    if (completedCharsRef.current.size === text.length) {
                        setIsAnimating(false);
                        onComplete?.();
                    }
                }
            };

            scramble(0);
        };

        const processCharacter = (charIndex: number) => {
            if (charIndex >= text.length) {
                return;
            }
            
            console.log(`Process Next char: ${charIndex}, char: ${text[charIndex]}`);
            
            startScrambling(charIndex);

            // Schedule next character
            const nextCharDelay = revealMultipleChars ? durationNextChar : numberOfScramblePerChar * durationPerChar;
            
            timersRef.current.progress = setTimeout(() => {
                processCharacter(charIndex + 1);
            }, nextCharDelay);
        };

        processCharacter(0);
    }, [text, numberOfScramblePerChar, durationPerChar, durationNextChar, revealMultipleChars, onComplete, onCharacterRevealed, hasStarted]);
    
    const stopAnimation = useCallback(() => {
        clearAllTimers();
        setIsAnimating(false);
        setHasStarted(false);
    }, [clearAllTimers]);
    
    const skipToEnd = useCallback(() => {
        clearAllTimers();
        setDisplayedText(Array.from(text));
        setIsAnimating(false);
        setHasStarted(false);
        onComplete?.();
    }, [clearAllTimers, text, onComplete]);

    useEffect(() => {
        if (autoStart && !shouldReduceMotion) {
            const timer = setTimeout(() => {
                startAnimation();
            }, initialDelay);
            
            return () => clearTimeout(timer);
        }
    }, [autoStart, initialDelay, startAnimation, shouldReduceMotion]);
    
    // Cleanup on unmount
    useEffect(() => {
        return clearAllTimers;
    }, [clearAllTimers]);

    // Reset when text changes
    useEffect(() => {
        setDisplayedText(Array.from({length: text.length}, () => ""));
        setHasStarted(false);
        completedCharsRef.current.clear();
        clearAllTimers();
    }, [text, clearAllTimers]);

    if (elementType === 'title') {
        return <h1 className={textClass}>{displayedText.join('')}</h1>;
    }

    return (
        <p className={textClass}>{displayedText.join('')}</p>
    );
}