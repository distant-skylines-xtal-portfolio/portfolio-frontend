import React from "react"
import type {JSX} from 'react'

import { Outlet } from "react-router-dom"
import BackgroundHexagons from "./BackgroundHexagons"
import BackgroundLinePatterns from "./BackgroundLinePatterns"
import BackroundText from "./BackgroundText"

export default function Layout():JSX.Element {
    return (
        <div className="site-wrapper">
            <div id='background-canvas' className="background-canvas">
                <BackgroundHexagons zIndex={50}/>
                <BackgroundLinePatterns zIndex={49} yScreenPercentage={0.1}/>
                <BackgroundLinePatterns zIndex={49} yScreenPercentage={0.7}/>
                <BackroundText zIndex={51} xScreenPercentage={0.5} />
                <main>
                    <Outlet />
                </main>               
            </div>
        </div>
    )
}