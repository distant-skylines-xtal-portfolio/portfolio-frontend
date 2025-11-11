import { useRef, useState, createRef, useEffect} from "react"
import { Connection, ExpandableCardMethods, ExtraCardMethods } from "../types/ExpandableCard.types"
import ExpandableCard from "./ExpandableCard";
import LineConnectionSVG from "./LineConnectionSVG";
import RevealText from "./RevealText";
import { Point } from "framer-motion";
import { useCardData } from "../data/DetailCardData";
import ExtraCards from "./ExtraCards";
import { calculateDetailCardPosition, calculateDetailCardSize } from "../utils/cardPositioningUtils";
import { useTranslation } from "react-i18next";
import { useViewport } from "../hooks/useViewport";

type cardConnectionManagerProps = {
    children?: React.ReactNode,
}

type titleCard = {
    id: string;
    titleKey: string;
    bodyKey?: string;

    position: Point;
    size: {width: number; height: number};
};

export default function CardConnectionManager({children}: cardConnectionManagerProps) {
    const { t } = useTranslation();
    const [activeConnection, setActiveConnection] = useState<Connection | null>(null);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [detailCardPosition, setDetailCardPosition] = useState<Point>({x: 0, y: 0});
    const [detailCardSize, setDetailCardSize] = useState({width: 550, height: 600});

    //Card refs
    const titleCardRefs = useRef<Map<string, React.RefObject<ExpandableCardMethods | null>>>(new Map());
    const detailCardRef = useRef<ExpandableCardMethods>(null);
    const extraCardRef = useRef<ExtraCardMethods>(null);

    /*  
        Track if component is mounted to stop state updates after unmount, which can break
        framer animations. The window resize event subscription can cause issues because 
        of this. 
    */
    const isMountedRef = useRef(true);
    const {isMobile} = useViewport();
    
    //Title card dimensions
    const titleCardWidth = 300;
    const titleCardHeight = 75;
    const titleCardGap = 12;


    const titleCards: titleCard[] = [
        {
            id: 'about',
            titleKey: 'cards.about.title',
            position: getTitleCardPosition(0),
            size: {width: titleCardWidth, height: titleCardHeight},
        },
        {
            id: 'projects-webpages',
            titleKey: 'cards.projectsWeb.title',
            bodyKey: 'cards.projectsWeb.body',
            position: getTitleCardPosition(1),
            size: {width: titleCardWidth, height: titleCardHeight},
        },
        {
            id: 'projects-threeJS',
            titleKey: 'cards.projectsThree.title',
            bodyKey: 'cards.projectsThree.body',
            position: getTitleCardPosition(2),
            size: {width: titleCardWidth, height: titleCardHeight},
        },
        {
            id: 'experience',
            titleKey: 'cards.experience.title',
            bodyKey: 'cards.experience.body',
            position: getTitleCardPosition(3),
            size: {width: titleCardWidth, height: titleCardHeight},
        },
        {
            id: 'contact',
            titleKey: 'cards.contact.title',
            position: getTitleCardPosition(4),
            size: {width: titleCardWidth, height: titleCardHeight},
        },
    ]


    function getTitleCardPosition(index: number):Point {
        const x = 50;
        let y = (index + 1) * (titleCardHeight);
        y += index > 0 ? (index * titleCardGap) : 0;
        return {x, y};
    }

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        }
    }, []);



    // Use effect to calculate detail card position based on size of the card canvas
    useEffect(() => {
            const calculateDimensions = () => {
                if (!isMountedRef.current) {
                    return;
                }

                if (isMobile) {
                    return;
                }

                const canvasElement = document.getElementById('card-canvas');
                if (!canvasElement) {
                    return;
                }
                const canvasRect = canvasElement?.getBoundingClientRect();
                const newY = canvasRect ? canvasRect.height / 2 : window.innerHeight / 2;
                const newSize = calculateDetailCardSize(titleCardWidth);
                const newPosition = calculateDetailCardPosition(titleCardWidth, 
                    newY, newSize
                );

                setDetailCardPosition(newPosition);
                setDetailCardSize(newSize);
            }
    
            calculateDimensions();
            window.addEventListener('resize', calculateDimensions);
            
            return () => {window.removeEventListener('resize', calculateDimensions)};
    }, [isMobile]);


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
            setTimeout(() => {
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

    function handleDetailCardCloseButtonClick() {
        if (activeConnection !== null) {
            detailCardRef.current?.collapse();
            extraCardRef.current?.collapseAll();
            

            setActiveConnection(null);
        }
    }

    const cardDataMap = useCardData();

    function getDetailCardElements(cardId: string | null) {
        if (!cardId) {
            console.log('Selected card has no Id!');
            return <></>;
        }
        const cardData = cardDataMap.get(cardId);

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
                        style={{padding:"5px", pointerEvents:'none'}}
                        className='card-title-content'
                    >
                        <div className="card-title-text">
                            <RevealText text={t(titleCard.titleKey)}
                            textClass="card-title-text" 
                            autoStart={true}
                            durationPerChar={50}
                            durationNextChar={100}
                            initialDelay={5000}></RevealText>

                            {titleCard.bodyKey && <RevealText text={t(titleCard.bodyKey)} 
                            textClass="card-title-body" 
                            autoStart={true}
                            durationPerChar={50}
                            durationNextChar={100}
                            initialDelay={5000}></RevealText>}
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
            <button className="card-close-button" 
                id="button-detail-card-close"
                onClick={handleDetailCardCloseButtonClick}
            >
                    X
            </button>
            <div style={{
                padding: '20px', 
                paddingTop:'40px', 
                textAlign:'center', 
                height: '100%',
                overflowY: 'auto',
                }}>
                {selectedCard ? (<></>) : (<p>{t('common.noCardSelected')}</p>)}
                {selectedCard &&
                    getDetailCardElements(selectedCard)
                }
            </div>
        </ExpandableCard>
        
        <ExtraCards cardId={selectedCard} ref={extraCardRef}/>


        <LineConnectionSVG connections={activeConnection ? [activeConnection] : []} />
        </div>
    )
}