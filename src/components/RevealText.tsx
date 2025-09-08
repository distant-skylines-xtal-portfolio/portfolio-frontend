import React, { useCallback, useEffect, useMemo, useRef } from "react"
import type {JSX} from 'react'


import { getRandomCharEng } from "../utils/randomCharacters"
import { useReducedMotion } from "framer-motion"

type revealTextTypes = {
    text: string,
    textClass: string,
    durationNextChar?: number,
    durationPerChar?: number
    numberOfScramblePerChar?: number,
    initialDelay?: number,
    revealMultipleChars?: boolean,
    autoStart?: boolean,
    onComplete?: () => void,
    onCharacterRevealed?: (index: number, char: string) => void,
}

type timeoutId = ReturnType<typeof setTimeout> | undefined;

type timersRefType = {
    progress: timeoutId,
    scramblers: Map<number, timeoutId>
}

export default function RevealText({
    text, textClass, 
    numberOfScramblePerChar=5, durationNextChar=500, initialDelay=100, 
    durationPerChar=50,
    revealMultipleChars=true, autoStart=true, 
    onComplete, onCharacterRevealed}: revealTextTypes):JSX.Element {
        
    const shouldReduceMotion = useReducedMotion();
    
    useEffect(() => {
        if (shouldReduceMotion) {
            setDisplayedText(Array.from(text));
            setIsAnimating(false);
            return;
        }
    }, [shouldReduceMotion, text])
            
    const [displayedText, setDisplayedText] = React.useState(Array.from({length: text.length}, () => ""));
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(true);

    const timersRef = useRef<timersRefType>({progress: undefined, scramblers: new Map()});

    
    
    const clearAllTimers = useCallback(() => {
        console.log("clear all timers!")
        if (timersRef.current.progress) {
            clearTimeout(timersRef.current.progress);
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
        setIsAnimating(true);
        setCurrentIndex(0);
    }, []);
    
    const stopAnimation = useCallback(() => {
        clearAllTimers();
        setIsAnimating(false);
    }, [clearAllTimers])
    
    const skipToEnd = useCallback(() => {
        clearAllTimers();
        setDisplayedText(Array.from(text));
        setIsAnimating(false);
        onComplete?. ();
    }, [clearAllTimers, text, onComplete])
    
    useEffect(() => {
        const getNextCharDelay = () => {
            return revealMultipleChars 
                ? CharacterData 
                : numberOfScramblePerChar * durationPerChar
        }
        if (currentIndex >= text.length || !autoStart) {
            return;
        }
        
        const startScrambling = (charIndex: number) => {
            
            const scramble = (currentScrambleCount: number) => {
                
                //Display a random character if we under the scramblePerChar cound
                //otherwise just display the correct char.
                if (currentScrambleCount < numberOfScramblePerChar) {
                    
                    setDisplayedText(prev => {
                        let newText = [...prev];
                        newText[charIndex] = getRandomCharEng();
                        return newText;
                    });

                    timersRef.current.scramblers.set(charIndex, 
                        setTimeout(() => {scramble(currentScrambleCount + 1)}, 
                        durationPerChar));
                } else {
                    setDisplayedText(prev => {
                        let newText = [...prev];
                        newText[charIndex] = text[charIndex];
                        return newText;
                    })
                }
                
            }

            scramble(0);
        }

        const processCharacter = (charIndex: number) => {
            if (charIndex >= text.length) {
                timersRef.current.progress = setTimeout(() => {
                    setIsAnimating(false);

                }, numberOfScramblePerChar * durationPerChar);
                return;
            }
            
            startScrambling(charIndex);
            timersRef.current.progress = setTimeout(() => {
                    
                timersRef.current.progress = setTimeout(() => {
                    setCurrentIndex(charIndex + 1);
                    processCharacter(charIndex + 1);
                }, durationNextChar)
            

            }, initialDelay)
        }

        processCharacter(currentIndex);

        return clearAllTimers;
    }, [text, isAnimating, clearAllTimers, currentIndex, durationPerChar, 
        revealMultipleChars, initialDelay, numberOfScramblePerChar, durationNextChar, autoStart
    ])

    return (
        <p className={textClass}>{displayedText.join('')}</p>
    )
}