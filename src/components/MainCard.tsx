import type {JSX} from 'react'
import { motion } from "framer-motion";
import Underline from './Underline';
import CardConnectionManager from './CardConnectionManager';
import DropdownCard from './DropdownCard';
import { ThemeType, useTheme } from '../contexts/ThemeContext';

export default function MainCard():JSX.Element {
    const {setTheme} = useTheme();

    function handleThemeChange(theme: string) {
        setTheme(theme as ThemeType);
    }

    return (
        <motion.div className="card-base"
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1, delay:1}}
        >
            <header>
                <div className='header-title' style={{zIndex:100}}>
                    <Underline color="#242424">
                        <h1>Evan McLay | Portfolio</h1>                    
                    </Underline>
                </div>
                <div className="dropdown-container">
                    <DropdownCard
                        cardKey='theme-dropdown'
                        options={['default', 'dark', 'blue']}
                        position={{x: 200, y: 0}}
                        defaultText='Select Theme'
                        initialSelectedOption={0}
                        onOptionSelect={handleThemeChange}
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
                <div className="card-canvas" id="card-canvas">
                    <CardConnectionManager></CardConnectionManager>
                </div>

                
            </div>
        </motion.div>
        
    )
}