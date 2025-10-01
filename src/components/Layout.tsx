import React from "react"
import type {JSX} from 'react'

import { Outlet } from "react-router-dom"

export default function Layout():JSX.Element {
    return (
        <div className="site-wrapper">
            <div id='background-canvas' className="background-canvas">
                <main>
                    <Outlet />
                </main>               
            </div>
        </div>
    )
}