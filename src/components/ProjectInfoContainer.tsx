import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type ProjectLink = {
    label: string;
    url: string;
};

type ProjectInfoProps = {
    title: string;
    description: string;
    links: ProjectLink[];
    technologies: string[];
    animationDelay?: number;
};

export function ProjectInfo({
    title,
    description,
    links,
    technologies,
    animationDelay = 0
}: ProjectInfoProps) {
    const {t} = useTranslation();

    return (
        <motion.div
            className="project-info-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: animationDelay }}
        >
            <h3>{title}</h3>
            
            <p className="project-info-desc">
                {description}
            </p>
            
            <div className="project-info-links">
                <p className="project-info-header">{t('common.links')}</p>
                {links.map((link, index) => (
                    <div key={`${link.label}-${index}`} className="project-info-link">
                        <a 
                            href={link.url} 
                            rel="noreferrer" 
                            target="_blank" 
                            className="body-text-link"
                        >
                            {link.label}
                        </a>
                    </div>
                ))}
            </div>
            
            <div className="project-info-list">
                <p>{t('common.tech')}</p>
                {technologies.map((tech, index) => (
                    <span key={`${tech}-${index}`} className="project-info-pill">
                        {tech}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}