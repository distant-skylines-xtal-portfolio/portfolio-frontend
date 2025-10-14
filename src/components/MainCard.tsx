import type {JSX} from 'react'
import { motion } from "framer-motion";
import Underline from './Underline';
import CardConnectionManager from './CardConnectionManager';
import DropdownCard from './DropdownCard';
import { ThemeType, useTheme } from '../contexts/ThemeContext';
import { Point } from '../types/ExpandableCard.types';

export default function MainCard():JSX.Element {
    const {setTheme} = useTheme();

    const dropdownCardWidth = 150;
    const dropdownCardGap = 25;

    function handleThemeChange(theme: string) {
        setTheme(theme as ThemeType);
    }

    function calculateDropdownPosition(index:number):Point {
        
        let xPos = ((index) * dropdownCardWidth);
        xPos += index > 0 ? (index * dropdownCardGap) : 0;

        return {x: xPos, y: 10};
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
                        position={calculateDropdownPosition(0)}
                        cardWidth={dropdownCardWidth}
                        defaultText='Select Theme'
                        initialSelectedOption={0}
                        onOptionSelect={handleThemeChange}
                    ></DropdownCard>
                    <DropdownCard
                        cardKey='language-dropdown'
                        options={['English', '日本語']}
                        position={calculateDropdownPosition(1)}
                        cardWidth={dropdownCardWidth}
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