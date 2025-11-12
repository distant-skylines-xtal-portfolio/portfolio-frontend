import type {JSX} from 'react'

import { Outlet } from "react-router-dom"
import BackgroundComponentManager from './BackgroundComponentManager'
import ThemeTransition from './ThemeTransition'
import { useViewport } from '../hooks/useViewport';

export default function Layout():JSX.Element {
    const {isMobile} = useViewport();
    return (
        <div className="site-wrapper">
            <ThemeTransition />
            <div id='background-canvas' className={ isMobile ? "background-canvas-mobile" : "background-canvas"}>
                {/* Background layer */}
                <BackgroundComponentManager />

                {/* Content layer */}
                <main style={{position: 'relative', zIndex: 10}}>
                    <Outlet />
                </main>               
            </div>
        </div>
    )
}