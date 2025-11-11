import type {JSX} from 'react'
import { useTheme } from '../contexts/ThemeContext';
import BackgroundHexagons from './BackgroundHexagons';
import BackgroundLinePatterns from './BackgroundLinePatterns';
import BackgroundText from './BackgroundText';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundAnimatedGradient from './BackgroundAnimatedGradient';
import BackgroundAnimatedCaustics from './BackgroundAnimatedCaustics';
import BackgroundMatrixCharacters from './BackgroundMatrixCharacters';
import { useViewport } from '../hooks/useViewport';
import MobileBackgroundComponentManager from './mobile/MobileBackgroundComponentManager';

export default function BackgroundComponentManager():JSX.Element {

    const {currentTheme, transitionState} = useTheme();
    const {isMobile} = useViewport();

    if (isMobile) {
        return <MobileBackgroundComponentManager />;
    }

    function getBackgroundComponents() {
        switch(currentTheme) {
            case 'grey':
                return (<>
                    <BackgroundAnimatedGradient 
                        zIndex={48}
                        animationSpeed='medium'
                        gradientType='waves' 
                    />
                    <BackgroundHexagons zIndex={50} />
                    <BackgroundLinePatterns zIndex={49} yScreenPercentage={0.1} />
                    <BackgroundLinePatterns zIndex={49} yScreenPercentage={0.8} />
                    <BackgroundText zIndex={51} xScreenPercentage={0.5} />
                </>)
            case 'dark':
                return (<>
                <BackgroundAnimatedGradient
                    zIndex={48}
                    gradientType='mesh'
                    animationSpeed='fast'
                />
                <BackgroundMatrixCharacters zIndex={51} />
                </>)
            case 'blue':
                return (<>
                    <BackgroundAnimatedCaustics 
                        zIndex={49}

                    />
                    <BackgroundHexagons zIndex={50} />
                    <BackgroundText zIndex={51} xScreenPercentage={0.7} />
                </>)
            default: 
                return null;
        }
    }

    return (
        <AnimatePresence mode="wait">
            {transitionState !== 'fadeIn' && (
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
                        overflow: 'hidden',
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