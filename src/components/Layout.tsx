import type {JSX} from 'react'

import { Outlet } from "react-router-dom"
import BackgroundHexagons from "./BackgroundHexagons"
import BackgroundLinePatterns from "./BackgroundLinePatterns"
import BackroundText from "./BackgroundText"

export default function Layout():JSX.Element {
    return (
        <div className="site-wrapper">
            <div id='background-canvas' className="background-canvas">
                {/* Background layer */}
                <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1}}>
                    <BackgroundHexagons zIndex={1}/>
                    <BackgroundLinePatterns zIndex={2} yScreenPercentage={0.1}/>
                    <BackgroundLinePatterns zIndex={2} yScreenPercentage={0.8}/>
                    <BackroundText zIndex={3} xScreenPercentage={0.5} />
                </div>
                
                {/* Content layer */}
                <main style={{position: 'relative', zIndex: 10}}>
                    <Outlet />
                </main>               
            </div>
        </div>
    )
}