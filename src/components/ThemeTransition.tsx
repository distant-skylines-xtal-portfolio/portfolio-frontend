import {motion, AnimatePresence, animate} from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {JSX} from 'react'

export default function ThemeTransition():JSX.Element {
    const {isTransitioning} = useTheme();

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#000000',
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5, ease:'easeInOut'}}
                >

                </motion.div>
            )}
        </AnimatePresence>
    );
}