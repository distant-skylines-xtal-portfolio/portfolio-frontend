import type {JSX} from 'react'
import { useTheme } from '../contexts/ThemeContext';
import BackgroundHexagons from './BackgroundHexagons';
import BackgroundLinePatterns from './BackgroundLinePatterns';
import BackgroundText from './BackgroundText';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundComponentManager():JSX.Element {

    const {currentTheme, isTransitioning} = useTheme();

    function getBackgroundComponents() {
        switch(currentTheme) {
            case 'default':
                return (<>
                    <BackgroundHexagons zIndex={50} />
                    <BackgroundLinePatterns zIndex={49} yScreenPercentage={0.1} />
                    <BackgroundLinePatterns zIndex={49} yScreenPercentage={0.8} />
                    <BackgroundText zIndex={51} xScreenPercentage={0.5} />
                </>)
            case 'dark':
                return (<>
                </>)
            case 'blue':
                return (<>
                    <BackgroundHexagons zIndex={50} />
                    <BackgroundText zIndex={51} xScreenPercentage={0.7} />
                </>)
            default: 
                return null;
        }
    }

    return (
        <AnimatePresence mode="wait">
            {!isTransitioning && (
                <motion.div
                    key={currentTheme}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5, ease:'easeInOut'}}
                >
                    {getBackgroundComponents()}
                </motion.div>
            )}
        </AnimatePresence>
    )
}