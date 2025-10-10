import type {JSX} from 'react'

import { Outlet } from "react-router-dom"
import BackgroundHexagons from "./BackgroundHexagons"
import BackgroundLinePatterns from "./BackgroundLinePatterns"
import BackroundText from "./BackgroundText"
import BackgroundComponentManager from './BackgroundComponentManager'
import ThemeTransition from './ThemeTransition'

export default function Layout():JSX.Element {
    return (
        <div className="site-wrapper">
            <ThemeTransition />
            <div id='background-canvas' className="background-canvas">
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