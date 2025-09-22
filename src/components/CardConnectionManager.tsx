import { useRef, useState, createRef, RefObject, ReactNode } from "react"
import { Connection, cardDimensionsType, ExpandableCardMethods } from "../types/ExpandableCard.types"
import ExpandableCard from "./ExpandableCard";
import LineConnectionSVG from "./LineConnectionSVG";
import RevealText from "./RevealText";

type cardConnectionManagerProps = {
    children?: React.ReactNode,
}

type titleCard = {
    id: string;
    title: string;

    position: {x: number; y: number};
};

export default function CardConnectionManager({children}: cardConnectionManagerProps) {
    const [activeConnection, setActiveConnection] = useState<Connection | null>(null);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    //Card refs
    const titleCardRefs = useRef<Map<string, React.RefObject<ExpandableCardMethods | null>>>(new Map());
    const detailCardRef = useRef<ExpandableCardMethods>(null);

    const titleCards: titleCard[] = [
        {
            id: 'about',
            title: 'About',
            position: {x: 50, y: 100},
        },
        {
            id: 'projects',
            title: 'Projects',
            position: {x: 50, y: 250},
        },
        {
            id: 'contact',
            title: 'Contact',
            position: {x: 50, y: 400},
        },
    ]

    //TODO: take into account window size changing
    const detailCardPosition = {x: 600, y: 250};
    const detailCardSize = {x: 400, y: 300};


    //Get connection point for card
    function getConnectionPoint(elementId: string, side: 'left' | 'right') {
        const element = document.getElementById(elementId);
        if (!element) return {x: 0, y: 0};

        const rect = element.getBoundingClientRect();
        const container = element.closest('.card-container');
        const containerRect = container?.getBoundingClientRect();

        if (!containerRect) return {x: 0, y: 0};

        let relativeTop = rect.top - containerRect.top;
        let relativeLeft = rect.left - containerRect.left;

        if (side === 'left') {
            relativeLeft = detailCardPosition.x;
        }

        return {
            x: side === 'left' ? relativeLeft : relativeLeft + rect.width,
            y: relativeTop + rect.height / 2,
        };
    };

    function playConnectionAnim(cardId: string) {
        setTimeout(() => {
            const fromPoint = getConnectionPoint(cardId, 'right');
            const toPoint = getConnectionPoint('detail-card', 'left');

            setActiveConnection({
                from: fromPoint,
                to: toPoint,
                animated: true,
                onComplete: () => {
                    detailCardRef.current?.expand();
                    setSelectedCard(cardId);
                }
            })
        }, 100)
    }

    function handleProjectClick(cardId: string) {
        
        if (activeConnection !== null) {
            detailCardRef.current?.collapse();
            setActiveConnection(null);
            const timer = setTimeout(() => {
                playConnectionAnim(cardId);
            }, 500)
            return;
        }

        setActiveConnection(null);

        if (!titleCardRefs.current.has(cardId)) {
            titleCardRefs.current.set(cardId, createRef<ExpandableCardMethods>());
        }

        playConnectionAnim(cardId);
    };

    function getProjectRef(cardId: string) {
        if (!titleCardRefs.current.has(cardId)) {
            titleCardRefs.current.set(cardId, createRef<ExpandableCardMethods>());
        }

        return titleCardRefs.current.get(cardId);
    }

    return (
        <div className="card-container"
            style={{position: 'relative', 
                width: '100%', 
                height: '100vh',
                overflow: 'hidden'}}>
        {
            titleCards.map((titleCard) => (
                <ExpandableCard
                    key={titleCard.id}
                    id={titleCard.id}
                    ref={getProjectRef(titleCard.id)}
                    x={titleCard.position.x}
                    y={titleCard.position.y}
                    width={300}
                    height={120}
                    autoExpand={true}
                    animDelay={0.5}
                    onCardClick={() => handleProjectClick(titleCard.id)}
                    className='title-card'
                >
                    <div style={{padding:"20px"}}>
                        <RevealText text={titleCard.title} 
                        textClass="card-title-text" 
                        autoStart={true}
                        durationPerChar={50}
                        durationNextChar={100}
                        initialDelay={5000}></RevealText>
                        <h3 style={{margin:'0'}}></h3>
                    </div>
                </ExpandableCard>
            ))
        }

        <ExpandableCard
            id="detail-card"
            ref={detailCardRef}
            x={detailCardPosition.x}
            y={detailCardPosition.y}
            width={400}
            height={300}
            autoExpand={false}
            className="detail-card"
        >
            <div style={{padding: '20px', textAlign:'center'}}>
                {selectedCard ? (<p>{`Card ${selectedCard}`}</p>) : (<p>No Card Selected</p>)}
            </div>
        </ExpandableCard>

        <LineConnectionSVG connections={activeConnection ? [activeConnection] : []} />
        </div>
    )
}