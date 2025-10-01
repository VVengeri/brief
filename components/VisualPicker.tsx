import React, { useState } from 'react';
import { IOption } from '../types';
import { DeepDiveInfoBox } from './StyleInfoBox';

interface VisualPickerProps {
    options: IOption[];
    selectedValue: string | string[];
    onChange: (newValue: string | string[]) => void;
    isMultiSelect: boolean;
    id: string;
    hasError?: boolean;
}

export const VisualPicker: React.FC<VisualPickerProps> = ({ options, selectedValue, onChange, isMultiSelect, hasError }) => {
    const [modalImage, setModalImage] = useState<string | null>(null);
    
    const handleSelect = (value: string) => {
        if (isMultiSelect) {
            const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
            const isSelected = currentValues.includes(value);

            if (isSelected) {
                // Remove item
                onChange(currentValues.filter(v => v !== value));
            } else {
                // Add item, but only if less than 3 are selected
                if (currentValues.length < 3) {
                    onChange([...currentValues, value]);
                } else {
                    // Optional: provide user feedback that limit is reached
                    // For now, it just prevents selection
                }
            }
        } else {
            onChange(value);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {options.map(option => {
                    if (option.isHeader) {
                        return (
                            <div key={option.value} className="col-span-full mt-4 first:mt-0">
                                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">{option.label}</h4>
                            </div>
                        )
                    }

                    const isSelected = isMultiSelect
                        ? Array.isArray(selectedValue) && selectedValue.includes(option.value)
                        : selectedValue === option.value;

                    return (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleSelect(option.value)}
                            className={`relative rounded-lg group border-2 transition-all duration-200 cursor-pointer ${
                                hasError
                                ? 'border-red-500 dark:border-red-400'
                                : isSelected 
                                    ? 'border-indigo-600 dark:border-wheat ring-2 ring-indigo-300 dark:ring-wheat/50' 
                                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-wheat-400'
                            }`}
                        >
                            <img 
                                src={option.image} 
                                alt={option.label} 
                                className="w-full h-24 object-cover rounded-md"
                            />
                            <div 
                                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-md"
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setModalImage(option.image || null);
                                    }}
                                    className="absolute top-2 left-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    title="Увеличить изображение"
                                >
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </button>
                                <span className="absolute bottom-2 left-3 right-3 text-white text-sm font-semibold text-center truncate pointer-events-none">{option.label}</span>
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 dark:bg-wheat rounded-full flex items-center justify-center text-white dark:text-gray-900 shadow">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {modalImage && (
                <div 
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setModalImage(null)}
                >
                    <img src={modalImage} alt="Enlarged view" className="max-w-full max-h-full object-contain rounded-lg" />
                     <button
                        onClick={() => setModalImage(null)}
                        className="absolute top-4 right-4 text-white text-2xl"
                    >
                        &times;
                    </button>
                </div>
            )}
        </>
    );
};