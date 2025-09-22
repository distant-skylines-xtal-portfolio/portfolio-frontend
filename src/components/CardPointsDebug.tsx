import { cardDimensionsType } from "../types/ExpandableCard.types"

type CardPointsDebugProps = {
    positions: cardDimensionsType | null,
    show?: boolean
}

export const CardPointsDebug = ({positions, show=true}: CardPointsDebugProps) => {
    if (!show || !positions) return null;

    const dotStyle = {
        position: 'absolute' as const,
        width: "8px",
        height: "8px",
        backgroundColor: 'red',
        borderRadius: '50%',
        zIndex: 1000,
        transform: 'translate(-50%, -50%)',

        pointerEvents: 'none' as const,
    };

    return (
        <>
        {/* Top */}
        <div 
            style={{
            ...dotStyle,
            left: positions.connectionPoints.top.x,
            top: positions.connectionPoints.top.y,
            }}
        />
        {/* Right */}
        <div 
            style={{
            ...dotStyle,
            left: positions.connectionPoints.right.x,
            top: positions.connectionPoints.right.y,
            }}
        />
        {/* Bottom */}
        <div 
            style={{
            ...dotStyle,
            left: positions.connectionPoints.bottom.x,
            top: positions.connectionPoints.bottom.y,
            }}
        />
        {/* Left */}
        <div 
            style={{
            ...dotStyle,
            left: positions.connectionPoints.left.x,
            top: positions.connectionPoints.left.y,
            }}
        />
        </>
    );
};
