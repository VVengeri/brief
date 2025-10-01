import React from 'react';
import { IFormData, ISection, IRoomConfig, IFile } from '../types';
import { FormField } from './FormField';

interface FormSectionProps {
    section: ISection;
    formData: IFormData;
    onDataChange: (path: string, value: any) => void;
    checkCondition: (condition: ((data: IFormData, fullFieldPath?: string) => boolean) | undefined, fullFieldPath?: string) => boolean;
    errors: Record<string, string>;
    onEditFile: (file: IFile, path: string, mode: 'electrics' | 'annotate') => void;
}

export const FormSection: React.FC<FormSectionProps> = ({ section, formData, onDataChange, checkCondition, errors, onEditFile }) => {
    return (
        <section id={section.id} className="border-t border-gray-200 dark:border-gray-700 pt-8 first:border-t-0 first:pt-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-wheat">{section.title}</h2>
            {section.description && <p className="mt-2 text-md text-gray-600 dark:text-gray-400">{section.description}</p>}
            <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {section.fields.map(field => {
                    const isElectricsPlan = field.id === 'electrics_general.electrics_plan';
                    const annotationMode = isElectricsPlan ? 'electrics' : 'annotate';

                    return checkCondition(field.condition, field.id) && (
                        <FormField
                            key={field.id}
                            field={field}
                            path={field.id}
                            formData={formData}
                            onDataChange={onDataChange}
                            error={errors[field.id]}
                            onEditFile={(file, path) => onEditFile(file, path, annotationMode)}
                        />
                    )
                })}
            </div>
            {section.subSections && section.subSections.map(subSection =>
                checkCondition(subSection.condition, subSection.id) && (
                    <div key={subSection.id} className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                         <h3 className="text-xl font-semibold text-gray-800 dark:text-wheat-200">{subSection.title}</h3>
                         {subSection.description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subSection.description}</p>}
                         <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            {subSection.fields.map(field =>
                                checkCondition(field.condition, field.id) && (
                                     <FormField
                                        key={field.id}
                                        field={field}
                                        path={field.id}
                                        formData={formData}
                                        onDataChange={onDataChange}
                                        error={errors[field.id]}
                                        onEditFile={(file, path) => onEditFile(file, path, 'annotate')}
                                    />
                                )
                            )}
                         </div>
                    </div>
                )
            )}
        </section>
    );
};
