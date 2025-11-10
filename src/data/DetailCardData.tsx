import { useTranslation } from "react-i18next";
import { ProjectInfo } from "../components/ProjectInfoContainer";

export {};

export function getCardData(cardId: string) {
    console.warn('getCardData deprecated');
    return null;
}

export function useCardData() {
    const { t } = useTranslation();

    const cardData = new Map([
        ['about', {
                data: (
                    <div className="card-data-about" style={{textAlign: 'left'}}>
                        <p className="body-text">
                            {t('cards.about.content')}
                        </p>
                    </div>
                )
        }],
        ['experience', {
                data: (
                    <div className="card-data-experience" style={{textAlign: 'left'}}>
                        <h3>{t('cards.experience.immerse.title')}</h3>
                        <p className="body-text">
                            {t('cards.experience.immerse.description')}
                        </p>
                        <span className='underline' style={{
                            display: 'inline-block',
                            width: '100%',
                            height: `${2}px`,
                            backgroundColor: 'white',
                        }}></span>
                        <h3>{t('cards.experience.symphony.title')}</h3>
                        <p className="body-text">
                            {t('cards.experience.symphony.description')}
                        </p>
                    </div>
                )
        }],
        ['contact', {
                data: (
                    <div className="card-data-contact" style={{textAlign: 'left'}}>
                        <div className="contact-block">
                            <h3>{t('cards.contact.email')} </h3>
                            <p className="body-text">evanmclay24@gmail.com</p>
                        </div>
                        <div className="contact-block">
                            <h3>{t('cards.contact.linkedin')} </h3>
                            <a href="https://www.linkedin.com/in/evan-mclay-3642a0106" target="_blank" rel="noopener noreferrer" className="body-text">
                                www.linkedin.com/in/evan-mclay-3642a0106
                            </a>
                        </div>
                        <div className="contact-block">
                            <h3>{t('cards.contact.github')} </h3>
                            <a href="https://github.com/Distant-Skyline-Xtal" target="_blank" rel="noopener noreferrer" className="body-text">
                                https://github.com/Distant-Skyline-Xtal
                            </a>
                        </div>
                    </div>
                )
        }],
        ['projects-webpages', {
            data: (
                <div className="card-data card-data-about" style={{textAlign: 'left'}}>
                    <ProjectInfo
                        title={t('cards.projectsWeb.gameRecommender.title')}
                        description={t('cards.projectsWeb.gameRecommender.body')}
                        links={[
                            { label: "Webpage", url: "https://evanmclay.dev/apps/game-recommender/" },
                            { label: "Github", url: "https://github.com/distant-skylines-xtal-portfolio/portfolio-game-recommender" }
                        ]}
                        technologies={[
                            "React Router",
                            "Next JS",
                            "TypeScript",
                            "Axios",
                            "Framer Motion"
                        ]}
                    />
                </div>
            )
        }],
        ['projects-threejs', {
            data: (
                <div className="card-data card-data-about" style={{textAlign: 'left'}}>
                    <p className="body-text">
                        To be added!
                    </p>
                </div>
            )
        }],
    ]);

    return cardData;
}

