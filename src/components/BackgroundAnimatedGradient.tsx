import type {JSX} from 'react';
import '../styles/AnimatedGradients.css';

type BackgroundAnimatedGradientProps = {
    zIndex?: number;
    animationSpeed: 'slow' | 'medium' | 'fast';
    gradientType?: 'waves' | 'radial' | 'mesh';
}

export default function BackgroundAnimatedGradient({
    zIndex = 1,
    animationSpeed = 'medium',
    gradientType = 'waves'
}: BackgroundAnimatedGradientProps):JSX.Element {

    function getAnimationDuration() {
        switch(animationSpeed) {
            case 'slow': return '20s';
            case 'medium': return '15s';
            case 'fast': return '10s';
            default: return '15s';
        }
    };

    return (
        <div
            className={`gradient-background gradient-${gradientType}`}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex,
                pointerEvents: 'none',
                animationDuration: getAnimationDuration(),
            }}
        >

        </div>
    ) 
}