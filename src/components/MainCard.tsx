import type {JSX} from 'react'
import { motion } from "framer-motion";
import Underline from './Underline';
import CardConnectionManager from './CardConnectionManager';
import DropdownCard from './DropdownCard';
import MobileCardList from './mobile/MobileCardList';
import { ThemeType, useTheme } from '../contexts/ThemeContext';
import { Point } from '../types/ExpandableCard.types';
import { useTranslation } from 'react-i18next';
import { useViewport } from '../hooks/useViewport';
import LayoutTransition from './LayoutTransition';

export default function MainCard():JSX.Element {
    const {t, i18n} = useTranslation();
    const {setTheme} = useTheme();
    const {viewport, isMobile} = useViewport();

    const dropdownCardWidth = 150;
    const dropdownCardGap = 25;

    function handleThemeChange(translatedTheme: string) {

        const themeMap: Record<string, ThemeType> = {
            [t('themes.grey')]: 'grey',
            [t('themes.dark')]: 'dark',
            [t('themes.blue')]: 'blue',
        }

        const newTheme = themeMap[translatedTheme];
        if (newTheme) {
            setTheme(newTheme as ThemeType);
        }
    }

    function handleLanguageChange(language: string) {
        console.log(`handleLanguageChanged: ${language}`)
        const langCode = language === 'English' ? 'en' : 'ja';
        i18n.changeLanguage(langCode);
    }

    function calculateDropdownPosition(index:number):Point {
        
        let xPos = ((index) * dropdownCardWidth);
        xPos += index > 0 ? (index * dropdownCardGap) + 100 : 0;

        return {x: xPos, y: 10};
    }

    return (
        <motion.div 
            className={`card-base ${isMobile ? 'card-base-mobile' : ''}`}
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1, delay:1}}
        >
            <header className={isMobile ? 'header-mobile' : ''}>
                <div className='header-title' style={{zIndex:100}}>
                    <Underline color="hsl(0, 0%, 100%)">
                        <h1>Evan McLay | Portfolio</h1>                    
                    </Underline>
                    <div className='latest-container'>
                    <h3>{t('header.latestProject.title')}</h3>
                        <div className="latest-link">
                            <a 
                                href='https://evanmclay.dev/apps/game-recommender/'
                                rel="noreferrer" 
                                target="_blank" 
                                className="latest-link-text"
                            >
                                {t('header.latestProject.body')}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="dropdown-container">
                    <DropdownCard
                        cardKey='theme-dropdown'
                        options={[
                            t('themes.grey'), 
                            t('themes.dark'), 
                            t('themes.blue')
                        ]}
                        position={calculateDropdownPosition(0)}
                        cardWidth={250}
                        defaultText={t('header.selectTheme')}
                        initialSelectedOption={2}
                        alwaysDisplayDefaultText={true}
                        onOptionSelect={handleThemeChange}
                    ></DropdownCard>
                    <DropdownCard
                        cardKey='language-dropdown'
                        options={[
                            t('languages.english'), 
                            t('languages.japanese')
                        ]}
                        position={calculateDropdownPosition(1)}
                        cardWidth={dropdownCardWidth}
                        initialSelectedOption={0}
                        onOptionSelect={handleLanguageChange}
                    ></DropdownCard>       
                </div>
            </header>
            <div className=
                {`card-base-container ${isMobile ? 'card-base-container-mobile' : ''}`}
            >
                <LayoutTransition layoutKey={viewport}>
                    {isMobile ? (
                        <MobileCardList />
                    ) : (
                        <div className="card-canvas" id="card-canvas">
                            <CardConnectionManager></CardConnectionManager>
                        </div>
                    )}
                </LayoutTransition>
            </div>
        </motion.div>
        
    )
}