import React from 'react';

interface ProgressBarProps {
    currentStep: number; // 0-based index
    totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    if (totalSteps === 0) return null;
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="w-full mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Шаг {currentStep + 1} из {totalSteps}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-indigo-600 dark:bg-wheat h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>
    );
};