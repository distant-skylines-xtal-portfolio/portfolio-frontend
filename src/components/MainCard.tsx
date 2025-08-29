import type {JSX} from 'react'
import { motion } from "framer-motion";
import ExpandableCard from './ExpandableCard';
import Underline from './Underline';

export default function MainCard():JSX.Element {
    return (
        <motion.div className="card-base"
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1, delay:1}}
        >
            <header>
                <Underline color="#242424">
                    <h1>Evan McLay | portfolio</h1>
                </Underline>
            </header>
            <div className="card-base-container">
                <div className="index-cards-container">
                    <ExpandableCard>
                        <p>Expandable card example!</p>
                    </ExpandableCard>
                </div>
            </div>
        </motion.div>
        
    )
}