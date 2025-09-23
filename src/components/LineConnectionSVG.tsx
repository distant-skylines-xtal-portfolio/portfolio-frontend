import {motion} from "framer-motion";
import { Connection, Point } from "../types/ExpandableCard.types";

type LineConnectionSVGProps = {
    connections: Connection[];
}

export default function LineConnectionSVG({
    connections
}:LineConnectionSVGProps) {

    function CalculatePath(from: Point, to: Point): string {
        
        const isAligned = Math.abs(from.y - to.y) < 10;
        if (isAligned) {
            return `M ${from.x} ${from.y} L ${to.x} ${to.y}`; 
        } else {
            const midX = from.x + (to.x - from.x) / 2;
            return `M ${from.x} ${from.y} 
                    L ${midX} ${from.y} 
                    L ${midX} ${to.y} 
                    L ${to.x} ${to.y}`;
        }
    };

    return (
        <svg 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 5,
        }}>
            {
                connections.map((connection, index) => {
                    const pathData = CalculatePath(connection.from, connection.to);
                    return (
                        <motion.path
                            key={`connection-${index}`}
                            d={pathData}
                            stroke="black"
                            strokeWidth={2}
                            fill="none"
                            initial={{pathLength: 0}}
                            animate={{pathLength: connection.animated ? 1 : 0}}
                            transition={{
                                duration: connection.animated ? 1: 0,
                                ease: "easeOut",
                                onComplete: connection.onComplete
                            }}
                        />
                    )
                })
            }    
        </svg>
    )
}