import React from 'react';
import { IFormData, ISection, IField, IFile } from '../types';

interface SummaryScreenProps {
    formData: IFormData;
    sections: ISection[];
    onEdit: (sectionId: string) => void;
}

const getValueFromPath = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => {
        const index = parseInt(part, 10);
        if (acc === null || acc === undefined) return undefined;
        if (!isNaN(index) && Array.isArray(acc)) {
            return acc[index];
        }
        return acc[part];
    }, obj);
};

const formatValueForDisplay = (value: any, field: IField): string => {
     if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        return `<span class="opacity-60 italic">Не заполнено</span>`;
    }

    if (field.type === 'file' && Array.isArray(value)) {
        const files = value as IFile[];
        if (files.length === 0) return `<span class="opacity-60 italic">Файлы не загружены</span>`;
        const fileItems = files.map(file => `<li>${file.name}</li>`).join('');
        return `<ul>${fileItems}</ul>`;
    }

    if (Array.isArray(value)) {
        const items = value.map(itemValue => {
            const option = field.options?.find(opt => opt.value === itemValue);
            return `<li>${option ? option.label : String(itemValue)}</li>`;
        }).join('');
        return `<ul class="list-disc pl-5">${items}</ul>`;
    }

    if ((field.type === 'enum' || field.type === 'radio' || field.type.startsWith('visual')) && field.options) {
        const option = field.options.find(opt => opt.value === value);
        if (option) return option.label;
    }
    
    if (typeof value === 'boolean') {
        return value ? 'Да' : 'Нет';
    }
    
    return String(value).replace(/\n/g, '<br>');
}


export const SummaryScreen: React.FC<SummaryScreenProps> = ({ formData, sections, onEdit }) => {
    const renderSection = (section: ISection) => {
        if (!section.fields.length && !section.subSections?.length) return null;
        if (section.id === 'summary' || section.id === 'confirmation') return null;
        if (section.condition && !section.condition(formData)) return null;

        return (
            <div key={section.id} className="mb-8 p-6 bg-white/5 dark:bg-black/10 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-wheat-200">{section.title}</h3>
                    <button 
                        onClick={() => onEdit(section.id)}
                        className="text-sm text-indigo-600 dark:text-wheat-300 hover:underline"
                    >
                        Изменить
                    </button>
                </div>
                <div className="space-y-4">
                    {section.fields.map(field => {
                        if (field.condition && !field.condition(formData)) return null;
                        const value = getValueFromPath(formData, field.id);
                        return (
                             <div key={field.id}>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{field.label}</p>
                                <div className="text-md mt-1" dangerouslySetInnerHTML={{ __html: formatValueForDisplay(value, field) }} />
                            </div>
                        )
                    })}
                     {section.subSections?.map(sub => renderSection(sub))}
                </div>
            </div>
        )
    }

    const summarySection = sections.find(s => s.id === 'summary');

    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-wheat">{summarySection?.title}</h2>
            {summarySection?.description && <p className="mt-2 text-md text-gray-600 dark:text-gray-400">{summarySection.description}</p>}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                {sections.map(section => renderSection(section))}
            </div>
        </section>
    );
};
