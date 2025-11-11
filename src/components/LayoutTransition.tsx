import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { ViewportType } from '../types/Layout.types';

type LayoutTransitionProps = {
    children: ReactNode,
    layoutKey: ViewportType;
};

export default function LayoutTransition({children, layoutKey}: LayoutTransitionProps) {



    return (
        <AnimatePresence mode='wait'>
            <motion.div
                key={layoutKey}
                style={{width: '100%', height: '100%', position: 'relative', top: 0, left: 0}}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.3, ease: 'easeInOut'}}
                exit={{opacity: 0}}
                onAnimationStart={() => console.log(`LayoutTransition: Animation started for ${layoutKey}`)}
                onAnimationComplete={() => console.log(`LayoutTransition: Animation complete for ${layoutKey}`)}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
