import React from "react"
import type {JSX} from 'react'
import { CSSProperties } from "styled-components";

type underlineProps = {
    children: React.ReactNode;
    thickness?: number;
    color?: string;
    duration?: number;
    trigger?: 'auto' | 'hover' | 'click';
    autoDelay?: number | null   
}

export default function Underline({
    children,
    thickness = 2,
    color = '#ffffffff',
    duration = 1,
    trigger = 'auto',
    autoDelay = 2000,
}: underlineProps):JSX.Element {
    
    const [displaying, setDisplaying] = React.useState(false);
    
    type Position = 'absolute' | 'relative' | 'fixed';
    let containerPosition: Position = 'relative';
    let underlinePosition: Position = 'absolute';

    //Timeout auto animation 
    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (autoDelay !== null && trigger === 'auto') {
            timer = setTimeout(() => {
                setDisplaying(true);
            }, autoDelay);
        }
        
        return () => clearTimeout(timer)
    }, [autoDelay, trigger])

    const combinedStyle = {
        underlineContainer: {
            display: 'inline-block',
            position: containerPosition,
            cursor: 'pointer',
        },
        underline: {
            position: underlinePosition,
            bottom: 0,
            left: 0,
            width: '100%',
            transformOrigin: 'left',
            transition: 'transform ease-out',
            transform: 'scaleX(0)', // default state
        },     
        underlineActive: {
            transform: 'scaleX(1)' // animated state
        }
    }

    const underlineFinalStyle: CSSProperties = {
        ...combinedStyle.underline,
            height: `${thickness}px`,
            backgroundColor: color,
            transitionDuration: `${duration}s`,
        ...(displaying ? combinedStyle.underlineActive : {}),
    }

    function handleMouseEnter() {
        if (trigger === 'hover') setDisplaying(true);
    }

    function handleMouseExit() {
        if (trigger === 'hover') setDisplaying(false);
    }

    function handleClick() {
        if (trigger === 'click') setDisplaying(true);
    }
     
    return (
        <span
            style={combinedStyle.underlineContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseExit}
            onClick={handleClick}
         >
            {children}
            <span style={underlineFinalStyle} />
        </span>
    )
}