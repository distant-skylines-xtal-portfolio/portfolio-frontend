import {useState, useEffect} from 'react';
import { ViewportType } from '../types/Layout.types';
import { flushSync } from 'react-dom';


export function useViewport() {
    const [viewport, setViewport] = useState<ViewportType>(
        window.innerWidth < 768 ? 'mobile' : 'desktop'
    );


    useEffect(() => {
        const handleResize = () => {
            const newViewport = window.innerWidth < 768 ? 'mobile' : 'desktop';
            if (newViewport !== viewport) {
                setViewport(newViewport);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [viewport]);

    return {viewport, isMobile: viewport === 'mobile'};
}