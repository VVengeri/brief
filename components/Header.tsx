
import React, { useState } from 'react';
import { HelpModal } from './HelpModal';
import { LOGO_URL, STUDIO_NAME } from '../config';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    const [isHelpVisible, setIsHelpVisible] = useState(false);

    return (
        <>
            <header className="bg-white/80 dark:bg-[#212121]/80 shadow-md sticky top-0 z-40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-4">
                            <img src={LOGO_URL} alt={`${STUDIO_NAME} Logo`} className="h-10 w-10 rounded" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-wheat">Бриф на дизайн-проект</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Заполните анкету для создания идеального интерьера</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                             <a
                                href="https://t.me/studiodesignessence"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full text-gray-700 dark:text-wheat-200 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-wheat-400 transition"
                                title="Портфолио"
                            >
                                <PortfolioIcon />
                            </a>
                            <button
                                onClick={() => setIsHelpVisible(true)}
                                className="p-2 rounded-full text-gray-700 dark:text-wheat-200 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-wheat-400 transition"
                                title="Справка"
                            >
                                <HelpIcon />
                            </button>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-700 dark:text-wheat-200 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-wheat-400 transition"
                                title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
                            >
                                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            {isHelpVisible && <HelpModal onClose={() => setIsHelpVisible(false)} />}
        </>
    );
};

const PortfolioIcon: React.FC = () => (
    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);


const HelpIcon: React.FC = () => (
    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
    </svg>
);


const SunIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);

const MoonIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
);
