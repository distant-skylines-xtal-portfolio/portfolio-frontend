import { useTranslation } from "react-i18next";
import { IoMdSettings } from "react-icons/io";
import Select, {SingleValue, ActionMeta, StylesConfig, components} from 'react-select';

type MobileSettingsProps = {
    onThemeChange: (theme:string) => void;
    onLanguageChange: (language:string) => void;
    initialTheme?: number;
    initialLanguage?: number;
}

interface Optiontype { 
    value: string;
    label: string;
}

export default function MobileSettings({
    onThemeChange,
    onLanguageChange,
    initialLanguage = 0,
    initialTheme = 2,
}:MobileSettingsProps) {
    const { t } = useTranslation();

    const themeOptions:Optiontype[] = [
        {value: t('themes.grey'), label: t('themes.grey')},
        {value: t('themes.dark'), label: t('themes.dark')},
        {value: t('themes.blue'), label: t('themes.blue')},
    ];

    const languageOptions:Optiontype[] = [
        {value: t('languages.english'), label: t('languages.english')},
        {value: t('languages.japanese'), label: t('languages.japanese')}
    ];

    function handleThemechange(newValue: SingleValue<Optiontype>, actionMeta:ActionMeta<Optiontype>) {
        if (newValue) {
            onThemeChange(newValue.value);
        }
    }

    function handleLanguageChange(newValue: SingleValue<Optiontype>, actionMeta:ActionMeta<Optiontype>) {
        if (newValue) {
            onLanguageChange(newValue.value);
        }
    }

    const customDropdownIndicator = (props:any) => {
        return (
            <components.DropdownIndicator {...props}>
                {<IoMdSettings />}
            </components.DropdownIndicator>
        )
    }

    const customStyling:StylesConfig<Optiontype, false> = {
        control: (provided, state) => ({
            ...provided,
            width: '100%',
            padding: '12px',
            fontSize: '1rem',
            border: '2px solid var(--color-secondary)',
            borderRadius: '4px',
            backgroundColor: 'var(--color-background)',
            cursor: 'pointer',
            borderColor: state.isFocused ? 'var(--color-text)' : provided.borderColor,
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: 'var(--color-text)',
        }),
        input: (provided, state) => ({
            ...provided,
            color: 'var(--color-text)',
        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: 'var(--color-background)',
            border: '2px solid var(--color-secondary)',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'var(--color-primary)' : 'var(--color-background)',
            color: 'var(--color-text)',
            padding: '12px',
        })

    }

    return (
        <div className="mobile-settings-dropdowns">
            <div className="mobile-select-group">
                <label htmlFor="theme-select" className="mobile-select-label">
                    {t('header.selectTheme')}:
                </label>
                <Select
                    id="theme-select"
                    className="mobile-select"
                    onChange={handleThemechange}
                    defaultValue={themeOptions[initialTheme]}
                    options={themeOptions}
                    styles={customStyling}
                    components={{DropdownIndicator: customDropdownIndicator}}
                />
            </div>

            <div className="mobile-select-group">
                <label htmlFor="language-select" className="mobile-select-label">
                    {t('header.selectLanguage')}:
                </label>
                <Select
                    id="language-select"
                    className="mobile-select"
                    onChange={handleLanguageChange}
                    defaultValue={languageOptions[initialLanguage]}
                    options={languageOptions}
                    styles={customStyling}
                    components={{DropdownIndicator: customDropdownIndicator}}
                />
            </div>
        </div>
    )
}