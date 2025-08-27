import React from "react"
import type {JSX} from 'react'

import { Outlet } from "react-router-dom"

export default function Layout():JSX.Element {
    return (
        <div className="site-wrapper">
            <main>
                <Outlet />
            </main>
        </div>
    )
}