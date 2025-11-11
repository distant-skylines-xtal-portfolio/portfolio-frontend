
import {useState, type JSX} from 'react';
import { useTranslation } from 'react-i18next';
import MobileCardItem from './MobileCardItem';

type MobileCard = {
    id: string,
    titleKey: string;
    bodyKey?: string;
}

export default function MobileCardList(): JSX.Element {
    const { t } = useTranslation();
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

    const cards: MobileCard[] = [
        { id: 'about', titleKey: 'cards.about.title' },
        { id: 'projects-webpages', titleKey: 'cards.projectsWeb.title', bodyKey: 'cards.projectsWeb.body' },
        { id: 'projects-threeJS', titleKey: 'cards.projectsThree.title', bodyKey: 'cards.projectsThree.body' },
        { id: 'experience', titleKey: 'cards.experience.title', bodyKey: 'cards.experience.body' },
        { id: 'contact', titleKey: 'cards.contact.title' },
    ]

    function handleCardClick(cardID: string) {
        console.log(`handleCardClick: ${cardID}`);
        setExpandedCardId(expandedCardId === cardID ? null: cardID);
    }

    console.log('rendering mobile card list!');

    return (
        <div
            className="mobile-card-list"
        >
            {cards.map((card) => (
                <MobileCardItem
                    key={`mobile-card-item-${card.id}`}
                    id={card.id}
                    isExpanded={expandedCardId !== null && expandedCardId === card.id}
                    onCardClick={() => handleCardClick(card.id)}
                    title={t(card.titleKey)}
                    body={card.bodyKey ? t(card.bodyKey) : undefined}

                />
            ))}
        </div>
    )
}