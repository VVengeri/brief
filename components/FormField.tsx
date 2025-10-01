import React from 'react';
import { IField, IFormData, IOption, IRoomConfig, IFile } from '../types';
import { VisualPicker } from './VisualPicker';
import { FileUpload } from './FileUpload';
import { DeepDiveInfoBox } from './StyleInfoBox';
// FIX: Import `initialFormData` to resolve TypeScript error.
import { initialFormData } from '../constants';

interface FormFieldProps {
    field: IField;
    path: string;
    formData: IFormData;
    onDataChange: (path: string, value: any) => void;
    error?: string;
    onEditFile: (file: IFile, path: string) => void;
}

const getValueFromPath = (obj: any, path:string) => {
    return path.split('.').reduce((acc, part) => {
        const index = parseInt(part, 10);
        if (!isNaN(index) && Array.isArray(acc) && acc) {
            return acc[index];
        }
        return acc && acc[part];
    }, obj);
};

export const FormField: React.FC<FormFieldProps> = ({ field, path, formData, onDataChange, error, onEditFile }) => {
    const value = getValueFromPath(formData, path) ?? '';
    const hasError = !!error;

    const inputClasses = `block w-full px-1 py-2 bg-transparent border-0 border-b ${
        hasError 
        ? 'border-red-500 dark:border-red-400' 
        : 'border-gray-400 dark:border-wheat focus:ring-0 focus:border-indigo-500 dark:focus:border-wheat-300'
    } sm:text-sm text-gray-900 dark:text-wheat placeholder:text-gray-500 dark:placeholder:text-gray-400 transition`;

    const radioCheckboxClasses = `h-4 w-4 text-indigo-600 dark:text-wheat-500 focus:ring-indigo-500 dark:focus:ring-wheat-400 bg-transparent ${
        hasError ? 'border-red-500' : 'border-gray-400 dark:border-wheat'
    }`;


    const renderInput = () => {
        switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
            case 'email':
            case 'tel':
                return (
                    <input
                        type={field.type}
                        id={path}
                        name={path}
                        value={value}
                        onChange={(e) => onDataChange(path, e.target.value)}
                        placeholder={field.placeholder}
                        className={inputClasses}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${path}-error` : undefined}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        id={path}
                        name={path}
                        rows={4}
                        value={value}
                        onChange={(e) => onDataChange(path, e.target.value)}
                        placeholder={field.placeholder}
                        className={`${inputClasses} rounded-md hover:bg-gray-100 dark:hover:bg-white/5`}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${path}-error` : undefined}
                    />
                );
            case 'enum':
                return (
                    <select
                        id={path}
                        name={path}
                        value={value}
                        onChange={(e) => onDataChange(path, e.target.value)}
                        className={`${inputClasses}`}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${path}-error` : undefined}
                    >
                        <option value="" className="text-gray-800">Выберите...</option>
                        {field.options?.map((option: IOption) => (
                            <option key={option.value} value={option.value} className="text-gray-800">{option.label}</option>
                        ))}
                    </select>
                );
            case 'radio':
                return (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                        {field.options?.map((option: IOption) => (
                            <div key={option.value} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`${path}-${option.value}`}
                                    name={path}
                                    value={option.value}
                                    checked={value === option.value}
                                    onChange={(e) => onDataChange(path, e.target.value)}
                                    className={radioCheckboxClasses}
                                />
                                <label htmlFor={`${path}-${option.value}`} className="ml-2 block text-sm">{option.label}</label>
                            </div>
                        ))}
                    </div>
                );
            case 'checkbox':
                return (
                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                type="checkbox"
                                id={path}
                                name={path}
                                checked={!!value}
                                onChange={(e) => onDataChange(path, e.target.checked)}
                                className={`${radioCheckboxClasses} rounded`}
                                aria-invalid={hasError}
                                aria-describedby={hasError ? `${path}-error` : undefined}
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor={path} className="font-medium">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        </div>
                    </div>
                );
            case 'multi-enum': {
                 const selectedValues = Array.isArray(value) ? value : [];
                 const isPalettePicker = field.options?.every(opt => Array.isArray(opt.colors));

                 if (isPalettePicker) {
                     return (
                         <div className="space-y-3">
                             {field.options?.map((option: IOption) => {
                                 const isSelected = selectedValues.includes(option.value);
                                 return (
                                     <div
                                         key={option.value}
                                         onClick={() => {
                                             const newValues = isSelected
                                                 ? selectedValues.filter(v => v !== option.value)
                                                 : [...selectedValues, option.value];
                                             onDataChange(path, newValues);
                                         }}
                                         className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all ${
                                             isSelected
                                                 ? 'border-indigo-500 dark:border-wheat ring-2 ring-indigo-200 dark:ring-wheat/30 bg-indigo-50 dark:bg-wheat/10'
                                                 : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-wheat-400'
                                         }`}
                                     >
                                         <span className="font-medium">{option.label}</span>
                                         <div className="flex space-x-1.5">
                                             {(option.colors || []).map((color, index) => (
                                                 <div key={index} className="w-5 h-5 rounded-full border border-white/50" style={{ backgroundColor: color }}></div>
                                             ))}
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                     );
                 }

                 return (
                    <div className="space-y-2 pt-2">
                        {field.options?.map((option: IOption) => (
                            <div key={option.value} className="relative flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        type="checkbox"
                                        id={`${path}-${option.value}`}
                                        value={option.value}
                                        checked={selectedValues.includes(option.value)}
                                        onChange={(e) => {
                                            const newValues = e.target.checked
                                                ? [...selectedValues, option.value]
                                                : selectedValues.filter(v => v !== option.value);
                                            onDataChange(path, newValues);
                                        }}
                                        className={`${radioCheckboxClasses} rounded`}
                                    />
                                </div>
                                <div className="ml-3 text-sm flex items-center">
                                    <label htmlFor={`${path}-${option.value}`}>{option.label}</label>
                                    {option.info && (
                                        <span className="relative group ml-2">
                                            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                            </svg>
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                {option.info}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                 );
            }
            case 'multi-text':
                 return (
                     <textarea
                        id={path}
                        name={path}
                        rows={3}
                        value={value}
                        onChange={(e) => onDataChange(path, e.target.value)}
                        placeholder={field.placeholder}
                        className={`${inputClasses} rounded-md hover:bg-gray-100 dark:hover:bg-white/5`}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${path}-error` : undefined}
                    />
                 );
             case 'visual-multi':
             case 'visual-single':
                 return (
                     <VisualPicker
                        id={path}
                        options={field.options || []}
                        selectedValue={value}
                        onChange={(newValue) => onDataChange(path, newValue)}
                        isMultiSelect={field.type === 'visual-multi'}
                        hasError={hasError}
                     />
                 );
             case 'room-toggle-counter': {
                const isToggle = field.roomType ? typeof(initialFormData.room_config[field.roomType]) === 'boolean' : false;
                const isSelected = isToggle ? value : value > 0 || value === '';
                 return (
                    <div className="flex items-center space-x-4">
                         <input
                            type="checkbox"
                            id={`${path}-toggle`}
                            checked={isSelected}
                            onChange={(e) => {
                                if (isToggle) {
                                     onDataChange(path, e.target.checked)
                                } else {
                                     onDataChange(path, e.target.checked ? 1 : 0);
                                }
                            }}
                            className={`${radioCheckboxClasses} rounded`}
                        />
                        <label htmlFor={`${path}-toggle`} className="font-medium flex-grow">{field.label}</label>
                        {!isToggle && (
                             <input
                                type="number"
                                id={path}
                                name={path}
                                min="0"
                                value={value}
                                disabled={!isSelected}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') {
                                        onDataChange(path, '');
                                    } else {
                                        const num = parseInt(val, 10);
                                        if (!isNaN(num) && num >= 0) {
                                            onDataChange(path, num);
                                        }
                                    }
                                }}
                                className={`${inputClasses} w-20 text-center disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                        )}
                    </div>
                 )
             }
            case 'file':
                return (
                    <FileUpload
                        path={path}
                        value={value || []}
                        onChange={(files) => onDataChange(path, files)}
                        onEdit={onEditFile}
                        hasError={hasError}
                    />
                );
            default:
                return null;
        }
    };
    
    const isFullWidth = field.type === 'textarea' || field.type === 'multi-text' || field.type.startsWith('visual') || field.type === 'file' || field.id === 'style.palettes' || field.id === 'style.palette_notes';
    const isCheckbox = field.type === 'checkbox';
    const isRoomToggle = field.type === 'room-toggle-counter';

    const isDeepDiveField = field.id === 'style.styles' || field.id === 'style.palettes';
    const selectedOptionsWithDeepDive = isDeepDiveField && Array.isArray(value)
        ? (field.options || []).filter(opt => value.includes(opt.value) && opt.deepDive)
        : [];

    return (
        <div className={isFullWidth || isRoomToggle ? 'sm:col-span-2' : 'sm:col-span-1'}>
            {!isCheckbox && !isRoomToggle && (
                 <label htmlFor={path} className="flex items-center text-sm font-medium">
                    <span>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                    {field.info && (
                         <span className="relative group ml-2">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {field.info}
                            </span>
                        </span>
                    )}
                </label>
            )}
            <div className={isCheckbox ? 'pt-4' : 'mt-1'}>
                {renderInput()}
            </div>
            {hasError && <p id={`${path}-error`} className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
            
            {isDeepDiveField && selectedOptionsWithDeepDive.length > 0 && (
                <DeepDiveInfoBox selectedOptions={selectedOptionsWithDeepDive} />
            )}
        </div>
    );
};
