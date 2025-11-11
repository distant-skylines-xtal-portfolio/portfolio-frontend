import { useTheme } from '../../contexts/ThemeContext';
import BackgroundHexagons from '../BackgroundHexagons';
import BackgroundAnimatedGradient from '../BackgroundAnimatedGradient';
import {motion, AnimatePresence} from 'framer-motion';

export default function MobileBackgroundComponentManager() {
    const {currentTheme, transitionState} = useTheme();

  function getMobileBackgroundComponents() {
    switch (currentTheme) {
      case 'grey':
        return (
          <>
            <BackgroundAnimatedGradient
              zIndex={48}
              animationSpeed='slow'
              gradientType='waves'
            />
            <BackgroundHexagons zIndex={50} />
          </>
        );
      case 'dark':
        return (
          <>
            <BackgroundAnimatedGradient
              zIndex={48}
              gradientType='mesh'
              animationSpeed='slow'
            />
          </>
        );
      case 'blue':
        return (
          <>
            <BackgroundHexagons zIndex={50} />
          </>
        );
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {getMobileBackgroundComponents()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}