import type {JSX} from 'react'
import { motion } from "framer-motion";
import Underline from './Underline';
import RevealText from './RevealText';
import CardConnectionManager from './CardConnectionManager';
import DropdownCard from './DropdownCard';

export default function MainCard():JSX.Element {
    return (
        <motion.div className="card-base"
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1, delay:1}}
        >
            <header>
                <div className='header-title'>
                    <Underline color="#242424">
                        <h1>Evan McLay | Portfolio</h1>                    
                    </Underline>
                    <RevealText text='Test' textClass='body-text' 
                    revealMultipleChars={true} 
                    durationNextChar={300}
                    durationPerChar={50}
                    numberOfScramblePerChar={4}
                    />  
                </div>
                <div className="dropdown-container">
                    <DropdownCard
                        cardKey='theme-dropdown'
                        options={['default', 'dark', 'blue']}
                        position={{x: 200, y: 0}}
                        defaultText='Select Theme'
                        initialSelectedOption={0}
                    ></DropdownCard>
                    <DropdownCard
                        cardKey='language-dropdown'
                        options={['English', '日本語']}
                        position={{x: 450, y: 0}}
                        initialSelectedOption={0}
                    ></DropdownCard>       
                </div>
            </header>
            <div className="card-base-container">
                <div className="card-canvas">
                    <CardConnectionManager></CardConnectionManager>
                </div>

                
            </div>
        </motion.div>
        
    )
}