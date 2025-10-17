import {createContext, useContext, useState, useEffect} from 'react';
import {JSX} from 'react';

export type ThemeType = 'default' | 'dark' | 'blue';

type TransitionState = 'idle' | 'fadeIn' | 'transitioning' | 'fadeOut';

type ThemeContextType = {
    currentTheme: ThemeType;
    setTheme: (theme:ThemeType) => void;
    transitionState: TransitionState;
};

type ThemeProviderProps = {
    children: React.ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}:ThemeProviderProps):JSX.Element {

    const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
    const [transitionState, setTransitionState] = useState<TransitionState>('idle');

    function setTheme(newTheme: ThemeType) {
        if (newTheme === currentTheme) return;

        setTransitionState('fadeIn');
        
        setTimeout(() => {
            setCurrentTheme(newTheme);
            setTransitionState('fadeOut');
            setTimeout(() => {
                setTransitionState('idle');
            }, 500)
        }, 500)
    }

    useEffect(() => {
        const root = document.documentElement;

        switch(currentTheme) {
            case 'default':
                root.style.setProperty('--color-background', 'hsl(0, 0%, 30%)');
                root.style.setProperty('--color-primary', 'hsl(0, 0%, 60%)');
                root.style.setProperty('--color-secondary', 'hsl(0, 0%, 80%)');
                root.style.setProperty('--color-text', 'hsl(0, 0%, 100%)');
                break;
            case 'dark':
                root.style.setProperty('--color-background', 'hsl(0, 0%, 10%)');
                root.style.setProperty('--color-primary', 'hsla(130, 100%, 11%, 1.00)');
                root.style.setProperty('--color-secondary', 'hsla(125, 100%, 12%, 1.00)');
                root.style.setProperty('--color-text', 'hsl(0, 0%, 90%)');
                break;
            case 'blue':
                root.style.setProperty('--color-background', 'hsl(210, 50%, 20%)');
                root.style.setProperty('--color-primary', 'hsl(210, 60%, 40%)');
                root.style.setProperty('--color-secondary', 'hsl(210, 70%, 60%)');
                root.style.setProperty('--color-text', 'hsl(210, 100%, 95%)');
                break;
        }
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={{
            currentTheme, setTheme, transitionState,
            }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}