import React from 'react';

interface NavigationProps {
    onPrev: () => void;
    onNext: () => void;
    hasPrev: boolean;
    hasNext: boolean;
    onHtmlExport?: () => void;
    onTelegramSend?: () => void;
    globalError?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onPrev, onNext, hasPrev, hasNext, onHtmlExport, onTelegramSend, globalError }) => {
    return (
        <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-wheat-200 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Назад
                </button>
                
                <div className="flex items-center justify-end flex-grow">
                    {hasNext ? (
                        <button
                            type="button"
                            onClick={onNext}
                            className="h-12 w-40 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-900 bg-wheat hover:bg-wheat-200 transition-all duration-400 cursor-pointer hover:shadow-glow-wheat"
                        >
                            Далее
                        </button>
                    ) : (
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onHtmlExport}
                                    className="h-12 w-48 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-900 bg-green-400 hover:bg-green-500 transition-all duration-400 cursor-pointer hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    <span>Скачать файл</span>
                                </button>
                                {onTelegramSend && (
                                    <button
                                        type="button"
                                        onClick={onTelegramSend}
                                        className="h-12 w-48 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 transition-all duration-400 cursor-pointer hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                        </svg>
                                        <span>Отправить в Telegram</span>
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-right text-gray-500 dark:text-gray-400 max-w-96">
                                Скачайте файл или отправьте бриф напрямую в Telegram дизайнеру
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {globalError && (
                <div role="alert" className="mt-4 text-center text-sm text-red-500 dark:text-red-400">
                    {globalError}
                </div>
            )}
        </div>
    );
};
