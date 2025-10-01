import React from 'react';
import { IOption } from '../types';

interface DeepDiveInfoBoxProps {
    selectedOptions: IOption[];
}

const keyMappings: { [key: string]: string } = {
    keyElements: 'Ключевые элементы',
    palette: 'Цветовая палитра',
    lighting: 'Освещение',
    description: 'Описание',
    combination: 'Сочетание',
    mood: 'Настроение'
};

const formatKey = (key: string) => {
    return keyMappings[key] || key;
}

export const DeepDiveInfoBox: React.FC<DeepDiveInfoBoxProps> = ({ selectedOptions }) => {
    if (!selectedOptions.length) {
        return null;
    }

    return (
        <div className="mt-6 space-y-4">
            {selectedOptions.map(option => {
                if (!option.deepDive) return null;
                return (
                    <div key={option.value} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-white/5">
                        <h4 className="text-md font-bold text-gray-800 dark:text-wheat">{option.label}</h4>
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                           {Object.entries(option.deepDive).map(([key, value]) => (
                                <p key={key}><strong>{formatKey(key)}:</strong> {value}</p>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
