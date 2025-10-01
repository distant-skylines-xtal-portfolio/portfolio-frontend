import { useRef, useState, createRef} from "react"
import { Connection, ExpandableCardMethods, ExtraCardMethods } from "../types/ExpandableCard.types"
import ExpandableCard from "./ExpandableCard";
import LineConnectionSVG from "./LineConnectionSVG";
import RevealText from "./RevealText";
import { Point } from "framer-motion";
import { getCardData } from "../data/DetailCardData";
import ExtraCards from "./ExtraCards";

type cardConnectionManagerProps = {
    children?: React.ReactNode,
}

type titleCard = {
    id: string;
    title: string;
    body: string;

    position: Point;
    size: {width: number; height: number};
};

export default function CardConnectionManager({children}: cardConnectionManagerProps) {
    const [activeConnection, setActiveConnection] = useState<Connection | null>(null);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    //Card refs
    const titleCardRefs = useRef<Map<string, React.RefObject<ExpandableCardMethods | null>>>(new Map());
    const detailCardRef = useRef<ExpandableCardMethods>(null);
    const extraCardRef = useRef<ExtraCardMethods>(null);

    function getTitleCardPosition(index: number, height: number):Point {
        const x = 50;
        const y = (index + 1) * (height + 25);
        return {x, y};
    }

    const titleCards: titleCard[] = [
        {
            id: 'about',
            title: 'About',
            body: '',
            position: getTitleCardPosition(0, 75),
            size: {width: 300, height: 75},
        },
        {
            id: 'projects-webpages',
            title: 'projects - webpages',
            body: 'See webpages/webapps',
            position: getTitleCardPosition(1, 75),
            size: {width: 300, height: 75},
        },
        {
            id: 'projects-threeJS',
            title: 'projects - threeJS',
            body: 'See experiments/components made in threeJS',
            position: getTitleCardPosition(2, 75),
            size: {width: 300, height: 75},
        },
        {
            id: 'experience',
            title: 'Past Experience',
            body: 'See past work',
            position: getTitleCardPosition(3, 75),
            size: {width: 300, height: 75},
        },
        {
            id: 'contact',
            title: 'Contact',
            body: '',
            position: getTitleCardPosition(4, 75),
            size: {width: 300, height: 75},
        },
    ]

    //TODO: take into account window size changing
    const detailCardPosition = {x: 700, y: 50};
    const detailCardSize = {width: 550, height: 600};


    //Get connection point for card
    function getConnectionPoint(elementId: string, side: 'left' | 'right') {
        const element = document.getElementById(elementId);
        if (!element) return {x: 0, y: 0};

        const rect = element.getBoundingClientRect();
        const container = element.closest('.card-canvas');
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
            extraCardRef.current?.collapseAll();
            

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

    function getDetailCardElements(cardId: string | null) {
        if (!cardId) {
            console.log('Selected card has no Id!');
            return <></>;
        }
        const cardData = getCardData(cardId);

        if (!cardData) {
            console.log('Selected card has no data!');
            return <></>
        } else {
            return cardData.data;
        }
    }

    return (
        <div className="card-container"
            style={{position: 'relative', 
                width: '100%', 
                height: '100%',
                overflow: 'hidden'}}>
        {
            titleCards.map((titleCard) => (
                <ExpandableCard
                    key={titleCard.id}
                    id={titleCard.id}
                    ref={getProjectRef(titleCard.id)}
                    x={titleCard.position.x}
                    y={titleCard.position.y}
                    width={titleCard.size.width}
                    height={titleCard.size.height}
                    autoExpand={true}
                    animDelay={0.5}
                    onCardClick={() => handleProjectClick(titleCard.id)}
                    className='title-card'
                >
                    <div 
                        style={{padding:"2px", pointerEvents:'none'}}
                        className='card-title-content'
                    >
                        <div className="card-title-text">
                            <RevealText text={titleCard.title} 
                            textClass="card-title-text" 
                            autoStart={true}
                            durationPerChar={50}
                            durationNextChar={100}
                            initialDelay={5000}></RevealText>

                            <RevealText text={titleCard.body} 
                            textClass="card-title-body" 
                            autoStart={true}
                            durationPerChar={50}
                            durationNextChar={100}
                            initialDelay={5000}></RevealText>
                        </div>
                        <div className='card-title-arrow'>
                            <span>▶</span>
                        </div>
                    </div>
                </ExpandableCard>
            ))
        }

        <ExpandableCard
            id="detail-card"
            ref={detailCardRef}
            x={detailCardPosition.x}
            y={detailCardPosition.y}
            width={detailCardSize.width}
            height={detailCardSize.height}
            autoExpand={false}
            usePointerEvents={false}
            className="detail-card"
        >
            <div style={{padding: '20px', textAlign:'center'}}>
                {selectedCard ? (<></>) : (<p>No Card Selected</p>)}
                {
                    getDetailCardElements(selectedCard)
                }
            </div>
        </ExpandableCard>
        
        <ExtraCards cardId={selectedCard} ref={extraCardRef}/>


        <LineConnectionSVG connections={activeConnection ? [activeConnection] : []} />
        </div>
    )
}