import React, { useEffect, useRef, createRef } from "react"
import type {JSX} from 'react'
import LiteYouTubeEmbed from "react-lite-youtube-embed"; 
import ExpandableCard from "./ExpandableCard";
import type {ExpandableCardMethods, ExtraCardMethods, Point} from '../types/ExpandableCard.types';

type ExtraCardsProps = {
    cardId: string | null,
     ref?: React.RefObject<ExtraCardMethods | null>;
}

export default function ExtraCards({cardId, ref}:ExtraCardsProps):JSX.Element {

    const extraCardRefs = useRef<Map<string, React.RefObject<ExpandableCardMethods | null>>>(new Map());
    const videoCardWidth = 360;
    //Expose internal methods
    useEffect(() => {
        if (ref && 'current' in ref) {
            ref.current = {
                collapseAll: () => collapseCards(),
            };
        };
    })

    function collapseCards() {
        extraCardRefs.current.forEach((card) => {
            card.current?.collapse();
        })
    }

    function calculateCardPosition(desiredY: number):Point {
        const cardCanvas = document.getElementById('card-canvas');
        if (!cardCanvas) {
            return {x: 0, y: 0};
        }

        const boundingRect = cardCanvas?.getBoundingClientRect();
        let position = {x: 0, y: desiredY};
        
        if (boundingRect.width >= 1800) {
            position.x = 600;
        } else if (boundingRect.width >= 1000) {
            position.x = 0;
        } else {
            
        }
        
        return position;
    }

    useEffect(() => {
        const handleResize = () => {
            const cardCanvas = document.getElementById('card-canvas');
            const boundingRect = cardCanvas?.getBoundingClientRect();

            console.log(`canvas rect width ${boundingRect?.width}, height: ${boundingRect?.height}`);
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [])


    function getExtraElements():JSX.Element{
        switch(cardId) {
            case 'experience':
                const videoCardId = "immerse-showreel-video";

                if (!extraCardRefs.current.has(videoCardId)) {
                    extraCardRefs.current.set(videoCardId, createRef<ExpandableCardMethods>());
                }
                const videoCardPos = calculateCardPosition(100);
                return (
                    <ExpandableCard
                        id={videoCardId}
                        x={videoCardPos.x}
                        y={videoCardPos.y}
                        zIndex={150}
                        width={videoCardWidth}
                        height={videoCardWidth * 0.57}
                        autoExpand={true}
                        usePointerEvents={false}
                        className="extra-card"
                        ref={extraCardRefs.current.get(videoCardId)}
                    >
                        <LiteYouTubeEmbed
                            id="Bxhcfn1v62o"
                            title="Immerse Showreel Video"
                            poster="hqdefault"
                        />
                    </ExpandableCard>
                )
        }

        return (<React.Fragment />)
    }
    

    return (
        cardId !== '' ? getExtraElements() : <React.Fragment />
    )
}