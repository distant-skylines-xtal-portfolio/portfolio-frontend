import {useEffect, useState} from "react"
import type {JSX} from 'react'
import { getRandomCharsEng } from "../utils/randomCharacters";
import { Point } from "framer-motion";
import RevealText from "./RevealText";
import {motion} from 'framer-motion';

type MovingString = {
    sentence: string,
    startPos: Point,
    timeStamp: number,
}

type BackroundTextProps = {
    zIndex?: number;
    xScreenPercentage: number;
}

export default function BackroundText({zIndex=50,xScreenPercentage}:BackroundTextProps):JSX.Element {

    const [randomizedStrings, setRandomizedStrings] = useState<MovingString[]>([]);
    const [startingPos, SetStartingPos] = useState<Point>({x:0, y:0});
    const spawnTime = 5000;
    const scrollAnimDuration = 15000;

    function getNewRandomString() {
        const randomWordCount = Math.floor(Math.random() * (10 - 5 + 1) + 5);
        let newString = '';
        let charCount = 0;
        for (let i = 0; i < randomWordCount; i++) {
            const randomWordLength = Math.floor(Math.random() + 7);
            const newWord = getRandomCharsEng(randomWordLength, true);
            newString += newWord + ' ';

            charCount += newWord.length;

            if (charCount > 25) {
                newString += '\n';
                charCount = 0;
            }
        }

        newString += ".";

        return newString;
    }

    useEffect(() => {
            const calculatePosition = () => {
                const backgroundCanvas = document.getElementById('background-canvas');
                const backgroundRect = backgroundCanvas?.getBoundingClientRect();
                const newPos = {x: backgroundRect ? (backgroundRect.left + (backgroundRect.width * xScreenPercentage)) : 
                    window.innerHeight * 0.9, y: window.innerHeight + 50};
                SetStartingPos(newPos);
            };
    
            calculatePosition();
            window.addEventListener('resize', calculatePosition);
            
            return () => window.removeEventListener('resize', calculatePosition);
    }, [xScreenPercentage]);

    useEffect(() => {
        const spawnInterval = setInterval(() => {
            const newString = getNewRandomString();
            
            const newMovingString = {
                sentence: newString,
                startPos: startingPos,
                timeStamp: Date.now(),
            }

            setRandomizedStrings(prev => [...prev, newMovingString]);

        }, (spawnTime));

        return () => clearInterval(spawnInterval);
    }, [startingPos])
    
    useEffect(() => {
        const deleteInterval = setInterval(() => {
            setRandomizedStrings(prev => prev.filter(randomString => 
                Date.now() - randomString.timeStamp < scrollAnimDuration + 1000)
            )

        }, 1000);
        
        return () => clearInterval(deleteInterval);
    }, []);

    return (
        <div className="random-strings" style={{
                            width: '100%', height: '100%', display:'inline', pointerEvents:'none', zIndex:zIndex
                        }}>
            {randomizedStrings.map((randomString) => {
                return <motion.div
                        style={{
                            position: 'absolute', top: startingPos.y, left: startingPos.x, opacity: 0.3, zIndex:zIndex,
                            width: '300px'
                        }}
                        key={`random-moving-string-${randomString.timeStamp}`}
                        id={`random-moving-string-${randomString.timeStamp}`}
                        initial={{y: 0}}
                        animate={{y: -window.innerHeight-100}}
                        transition={{
                            y: {duration: (scrollAnimDuration / 1000), ease:'linear'}
                        }}
                    >
                        <RevealText 
                            text={randomString.sentence}
                            textClass="background-text"
                            autoStart={true}
                            durationNextChar={150}
                            durationPerChar={50}
                            initialDelay={100}
                            numberOfScramblePerChar={5} 
                        />
                    </motion.div>
            })}
        </div>
        
    )
}