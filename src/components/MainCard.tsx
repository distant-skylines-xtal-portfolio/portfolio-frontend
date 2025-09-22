import type {JSX} from 'react'
import { motion } from "framer-motion";
import ExpandableCard from './ExpandableCard';
import Underline from './Underline';
import RevealText from './RevealText';
import CardConnectionManager from './CardConnectionManager';

export default function MainCard():JSX.Element {
    return (
        <motion.div className="card-base"
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1, delay:1}}
        >
            <header>
                <Underline color="#242424">
                    <h1>Evan McLay | Portfolio</h1>                    
                </Underline>
                <RevealText text='Test' textClass='body-text' 
                revealMultipleChars={true} 
                durationNextChar={300}
                durationPerChar={50}
                numberOfScramblePerChar={4}
                />
            </header>
            <div className="card-base-container">
                <div className="card-canvas">
                    <CardConnectionManager></CardConnectionManager>
                </div>

                
            </div>
        </motion.div>
        
    )
}