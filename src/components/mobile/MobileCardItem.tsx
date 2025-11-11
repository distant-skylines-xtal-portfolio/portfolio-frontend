import {AnimatePresence, motion} from 'framer-motion';

import type {JSX} from 'react';
import { useCardData } from '../../data/DetailCardData';

type MobileCardItemProps = {
    id: string;
    title: string;
    body?: string;
    isExpanded: boolean;
    onCardClick: () => void;
}

export default function MobileCardItem({
    id,
    title,
    body,
    isExpanded,
    onCardClick
}: MobileCardItemProps):JSX.Element {
    const cardDataMap = useCardData();
    const cardData = cardDataMap.get(id);
    
    return (
        <motion.div
            className='mobile-card-item'
            layout
            onClick={onCardClick}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
        >
            <motion.div
                className="mobile-card-header" layout="position"
            >
                <div className="mobile-card-title-content">
                    <h3>{title}</h3>
                    {body && <p className="mobile-card-body">{body}</p>}
                </div>
                <motion.span
                    className="mobile-card-arrow"
                    animate={{rotate: isExpanded ? 90 : 0}}
                    transition={{duration: 0.2}}
                >
                    ▶
                </motion.span>
            </motion.div>

            <AnimatePresence>
                {isExpanded && cardData && (
                    <motion.div
                        className="mobile-card-detail"
                        initial={{height: 0, opacity: 0}}
                        animate={{height: 'auto', opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.3, ease: 'linear'}}
                        style={{overflow: 'hidden'}}
                    >
                        <div className="mobile-card-detail-content">
                            {cardData.data}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}