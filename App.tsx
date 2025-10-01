
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
    initialFormData, 
    formSections, 
    bathroomSectionTemplate, 
    bedroomSectionTemplate, 
    childRoomSectionTemplate, 
    officeSectionTemplate,
    livingRoomSectionTemplate,
    hallwaySectionTemplate,
    wardrobeSectionTemplate,
    laundrySectionTemplate,
    pantrySectionTemplate,
    balconySectionTemplate,
    kitchenSectionTemplate,
    kitchenLivingSectionTemplate,
    confirmationSection, 
    summarySection 
} from './constants';
import { IFormData, ISection, IRoomConfig, IField, IFile, IWardrobe, IKitchenDetails, IAnnotation, IKitchenLiving } from './types';
import { generateHtml, generateHtmlContent } from './services/htmlService';
import { TelegramService } from './services/telegramService';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { Navigation } from './components/Navigation';
import { LoginScreen } from './components/LoginScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { PlanEditor } from './components/PlanEditor';
import { FormSection } from './components/FormSection';
import { STUDIO_NAME } from './config';

type Theme = 'light' | 'dark';

const LOCAL_STORAGE_KEY = 'interior_design_brief_data';
const SESSION_STORAGE_KEY = 'brief_authenticated';

const getValueFromPath = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => {
        if (acc === null || acc === undefined) return undefined;
        const index = parseInt(part, 10);
        if (!isNaN(index) && Array.isArray(acc)) {
            return acc[index];
        }
        return acc[part];
    }, obj);
};

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return window.sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
    });
    
    const [formData, setFormData] = useState<IFormData>(() => {
        try {
            const savedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // Deep merge to ensure all nested properties from initialFormData are present
                const mergedData = { 
                    ...initialFormData, 
                    ...parsedData, 
                    project: { ...initialFormData.project, ...(parsedData.project || {}) },
                    client: { ...initialFormData.client, ...(parsedData.client || {}) },
                    household: { ...initialFormData.household, ...(parsedData.household || {}) },
                    goals: { ...initialFormData.goals, ...(parsedData.goals || {}) },
                    style: { ...initialFormData.style, ...(parsedData.style || {}) },
                    budget: { ...initialFormData.budget, ...(parsedData.budget || {}) },
                    replanning: { ...initialFormData.replanning, ...(parsedData.replanning || {}) },
                    room_config: { ...initialFormData.room_config, ...(parsedData.room_config || {}) },
                    kitchen_details: parsedData.kitchen_details ? { ...initialFormData.kitchen_details, ...parsedData.kitchen_details } as IKitchenDetails : initialFormData.kitchen_details,
                    kitchen_living: parsedData.kitchen_living ? { ...initialFormData.kitchen_living, ...parsedData.kitchen_living } as IKitchenLiving : initialFormData.kitchen_living,
                    electrics_general: { ...initialFormData.electrics_general, ...(parsedData.electrics_general || {}) },
                    additional: { ...initialFormData.additional, ...(parsedData.additional || {}) },
                    confirmation: { ...initialFormData.confirmation, ...(parsedData.confirmation || {}) },
                    ventilation: { ...initialFormData.ventilation, ...(parsedData.ventilation || {}) },
                };
                 // Files are not saved, so they will start empty, which is correct.
                mergedData.replanning.bti_plan = [];
                mergedData.style.references_files = [];
                mergedData.electrics_general.electrics_plan = [];
                return mergedData;
            }
        } catch (error) {
            console.error("Failed to parse saved form data:", error);
        }
        return initialFormData;
    });
    
    const [currentStep, setCurrentStep] = useState(0);
    const [theme, setTheme] = useState<Theme>('light');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string>('');
    const [editingFile, setEditingFile] = useState<{ file: IFile; path: string, mode: 'electrics' | 'annotate' } | null>(null);
    const [isSendingToTelegram, setIsSendingToTelegram] = useState(false);
    const formTopRef = useRef<HTMLDivElement>(null);
    const prevRoomConfigRef = useRef<IRoomConfig>(formData.room_config);

    useEffect(() => {
        try {
            // Create a deep copy of the form data to avoid mutating the state
            const dataToSave = JSON.parse(JSON.stringify(formData));

            // Function to remove large base64 content from file arrays to avoid quota errors
            const cleanFilesForStorage = (files: IFile[] | undefined): IFile[] => {
                if (Array.isArray(files)) {
                    // We only need to save file metadata, not the content which can be huge
                    return files.map(file => ({ name: file.name, type: file.type, content: '', annotations: file.annotations }));
                }
                return [];
            };

            // Clean known file fields
            if (dataToSave.replanning) {
                dataToSave.replanning.bti_plan = cleanFilesForStorage(dataToSave.replanning.bti_plan);
            }
            if (dataToSave.style) {
                dataToSave.style.references_files = cleanFilesForStorage(dataToSave.style.references_files);
            }
             if (dataToSave.electrics_general) {
                dataToSave.electrics_general.electrics_plan = cleanFilesForStorage(dataToSave.electrics_general.electrics_plan);
            }

            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
                 console.warn("Could not save form data to local storage: Quota exceeded. This is expected if large files are attached and is handled by stripping file content.");
            } else {
                console.error("Failed to save form data:", error);
            }
        }
    }, [formData]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const initialTheme = savedTheme ? savedTheme : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
    
    useEffect(() => {
        // Use a timeout to ensure the scroll happens after any conditional rendering has completed
        // which might affect the section's height.
        setTimeout(() => {
            if (formTopRef.current) {
                formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }, [currentStep]);

    // Effect to synchronize room detail arrays with room_config counts
    useEffect(() => {
        const countableRooms: (keyof Omit<IRoomConfig, 'living_room' | 'hallway' | 'laundry' | 'pantry' | 'kitchen' | 'kitchen_living'>)[] = ['bedrooms', 'child_rooms', 'offices', 'bathrooms', 'wardrobes', 'balconies'];
        
        const roomInitializers = {
            bedrooms: { functions: [], bed_size: '', storage_needs: '', notes: '', electrics_notes: '', electrics_points: [], heated_floor_type: '', lighting_types: [], lighting_controls: [], lighting_cct: '', wall_finishes: [], ceiling_finishes: [], floor_finishes: [] },
            child_rooms: { age: '', gender: '', zones: [], notes: '', electrics_notes: '', electrics_points: [], heated_floor_type: '', lighting_types: [], lighting_controls: [], lighting_cct: '', wall_finishes: [], ceiling_finishes: [], floor_finishes: [] },
            offices: { work_type: '', equipment: [], storage_needs: '', notes: '', electrics_notes: '', electrics_points: [], heated_floor_type: '', lighting_types: [], lighting_controls: [], lighting_cct: '', wall_finishes: [], ceiling_finishes: [], floor_finishes: [] },
            bathrooms: { equipment: [], finishes: [], engineering_notes: '', electrics_notes: '', electrics_points: [], heated_floor_type: '', lighting_types: [], lighting_controls: [], lighting_cct: '', wall_finishes: [], ceiling_finishes: [], floor_finishes: [] },
            wardrobes: { hanging_storage: [], shelving_needs: [], drawer_needs: [], shoe_storage: '', shoe_count: '', notes: '', electrics_notes: '', electrics_points: [], heated_floor_type: '', lighting_types: [], lighting_controls: [], lighting_cct: '', wall_finishes: [], ceiling_finishes: [], floor_finishes: [] } as IWardrobe,
            balconies: { type: '', purpose: [], notes: '', electrics_notes: '', electrics_points: [], heated_floor_type: '', lighting_types: [], lighting_controls: [], lighting_cct: '', wall_finishes: [], ceiling_finishes: [], floor_finishes: [] },
        };

        let changes: Partial<IFormData> = {};
        
        countableRooms.forEach(roomType => {
            const newCount = Number(formData.room_config[roomType]); // Handles '' -> 0
            const prevCount = Number(prevRoomConfigRef.current[roomType]);
            
            if (newCount !== prevCount) {
                 const key = roomType as keyof IFormData;
                 const currentRooms = (formData[key] as any[]) || [];
                 const newRooms = [...currentRooms];

                 if (newCount > currentRooms.length) {
                    for (let i = currentRooms.length; i < newCount; i++) {
                        newRooms.push(roomInitializers[roomType] || {});
                    }
                } else if (newCount < currentRooms.length) {
                    newRooms.length = newCount;
                }
                changes[key] = newRooms as any;
            }
        });
        
        if (Object.keys(changes).length > 0) {
            setFormData(prev => ({ ...prev, ...changes }));
        }

        prevRoomConfigRef.current = formData.room_config;
    }, [formData.room_config]);

    const checkCondition = useCallback((condition: ((data: IFormData, fullFieldPath?: string) => boolean) | undefined, fullFieldPath?: string): boolean => {
        if (!condition) return true;
        return condition(formData, fullFieldPath);
    }, [formData]);

    const memoizedSections = useMemo(() => {
        let dynamicSections: ISection[] = [];
        
        const generateSectionsForCount = (count: number | '', template: ISection, type: string, titlePrefix: string) => {
            const numericCount = Number(count); // Treats '' as 0
            if (isNaN(numericCount) || numericCount <= 0) return [];
            
            const sections: ISection[] = [];
            for (let i = 0; i < numericCount; i++) {
                const newSection = JSON.parse(JSON.stringify(template));
                newSection.id = `${type}_${i}`;
                newSection.title = `${titlePrefix} ${i + 1}`;
                newSection.fields.forEach((field: any) => {
                    const originalIdParts = field.id.split('.');
                    const originalFieldName = originalIdParts.pop();
                    const originalRoomType = originalIdParts[0];
                    field.id = `${originalRoomType}.${i}.${originalFieldName}`;
                });
                if (newSection.subSections) {
                    newSection.subSections.forEach((sub: ISection) => {
                        sub.fields.forEach((field: IField) => {
                             const originalIdParts = field.id.split('.');
                             const originalFieldName = originalIdParts.pop();
                             const originalRoomType = originalIdParts[0];
                             field.id = `${originalRoomType}.${i}.${originalFieldName}`;
                        })
                    })
                }
                sections.push(newSection);
            }
            return sections;
        };
        
        const config = formData.room_config;

        if (config.kitchen) dynamicSections.push(kitchenSectionTemplate);
        if (config.kitchen_living) dynamicSections.push(kitchenLivingSectionTemplate);
        if (config.living_room) dynamicSections.push(livingRoomSectionTemplate);
        if (config.hallway) dynamicSections.push(hallwaySectionTemplate);
        
        dynamicSections = [
            ...dynamicSections,
            ...generateSectionsForCount(config.bedrooms, bedroomSectionTemplate, 'bedrooms', 'Детализация: Спальня'),
            ...generateSectionsForCount(config.child_rooms, childRoomSectionTemplate, 'child_rooms', 'Детализация: Детская'),
            ...generateSectionsForCount(config.offices, officeSectionTemplate, 'offices', 'Детализация: Кабинет'),
            ...generateSectionsForCount(config.bathrooms, bathroomSectionTemplate, 'bathrooms', 'Детализация: Санузел'),
            ...generateSectionsForCount(config.wardrobes, wardrobeSectionTemplate, 'wardrobes', 'Детализация: Гардеробная'),
            ...generateSectionsForCount(config.balconies, balconySectionTemplate, 'balconies', 'Детализация: Балкон/Лоджия'),
        ];

        if (config.laundry) dynamicSections.push(laundrySectionTemplate);
        if (config.pantry) dynamicSections.push(pantrySectionTemplate);
        
        const baseSections = formSections.filter(sec => sec.id !== 'dynamic_rooms_placeholder');
        
        const placeholderIndex = baseSections.findIndex(sec => sec.id === 'goals'); // Insert after goals
        
        let finalSections = [...baseSections];
        if (placeholderIndex !== -1) {
            finalSections.splice(placeholderIndex + 1, 0, ...dynamicSections);
        } else {
            finalSections = [...finalSections, ...dynamicSections];
        }

        return [...finalSections, summarySection, confirmationSection];

    }, [formData.room_config, checkCondition]);

    useEffect(() => {
        const currentSection = memoizedSections[currentStep];

        // Intelligent pre-filling for child's age
        if (currentSection && currentSection.id.startsWith('child_rooms_')) {
            const roomIndexStr = currentSection.id.split('_')[1]; // Adjusted index
            if (roomIndexStr === undefined) return;
            
            const roomIndex = parseInt(roomIndexStr, 10);
            if (isNaN(roomIndex)) return;

            const householdMembers = formData.household.members;
            
            if (typeof householdMembers === 'string' && householdMembers.trim() !== '') {
                // Regex to find numbers within parentheses, e.g., (7), (7 лет)
                const ageRegex = /\((\d+)/g;
                let match;
                const ages = [];
                while ((match = ageRegex.exec(householdMembers)) !== null) {
                    ages.push(parseInt(match[1], 10));
                }
                
                if (ages.length > roomIndex) {
                    const childAge = ages[roomIndex];
                    const targetFieldPath = `child_rooms.${roomIndex}.age`;
                    const currentAgeValue = getValueFromPath(formData, targetFieldPath);

                    if ((currentAgeValue === '' || currentAgeValue === null || currentAgeValue === undefined) && !isNaN(childAge)) {
                        setFormData(prevData => {
                            const newChildRooms = [...(prevData.child_rooms || [])];
                            if(newChildRooms[roomIndex]) {
                                newChildRooms[roomIndex] = { ...newChildRooms[roomIndex], age: childAge };
                            }
                            return { ...prevData, child_rooms: newChildRooms };
                        });
                    }
                }
            }
        }
    }, [currentStep, memoizedSections, formData.household.members]);

    const handleLoginSuccess = () => {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
        setIsAuthenticated(true);
    };

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const visibleSections = useMemo(() => {
        return memoizedSections.filter(section => checkCondition(section.condition, section.id));
    }, [checkCondition, memoizedSections]);
    
    const jumpToStep = (sectionId: string) => {
        const stepIndex = memoizedSections.findIndex(s => s.id === sectionId);
        if (stepIndex !== -1) {
            setCurrentStep(stepIndex);
        }
    };
    
    const validateStep = (stepIndex: number): Record<string, string> => {
        const section = memoizedSections[stepIndex];
        const newErrors: Record<string, string> = {};

        const checkFields = (fields: IField[]) => {
            fields.forEach(field => {
                if (!checkCondition(field.condition, field.id)) return;
                if (field.required) {
                    const value = getValueFromPath(formData, field.id);
                    let isEmpty = false;
                    if (Array.isArray(value)) {
                        isEmpty = value.length === 0;
                    } else if (typeof value === 'boolean') {
                        // For a simple required checkbox, `value` must be true.
                        isEmpty = !value;
                    } else {
                        isEmpty = value === null || value === undefined || String(value).trim() === '';
                    }

                    if (isEmpty) {
                        newErrors[field.id] = field.validation_error_message || 'Это поле обязательно для заполнения';
                    } else if (field.type === 'email') {
                         if (String(value).trim() !== '') { // only validate if not empty
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(String(value))) {
                                newErrors[field.id] = 'Введите корректный email адрес';
                            }
                        }
                    }
                }
            });
        };

        if (section) {
            checkFields(section.fields);
            if (section.subSections) {
                section.subSections.forEach(sub => {
                    if (checkCondition(sub.condition, sub.id)) {
                        checkFields(sub.fields);
                    }
                });
            }
        }
        return newErrors;
    };


    const handleNext = useCallback(() => {
        setGlobalError('');
        const stepErrors = validateStep(currentStep);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            const firstErrorKey = Object.keys(stepErrors)[0];
            const currentSection = memoizedSections[currentStep];

            let errorField: IField | undefined;
            
            const findField = (fields: IField[]): IField | undefined => fields.find(f => f.id === firstErrorKey);
            
            if (currentSection) {
                 errorField = findField(currentSection.fields);
                 if (!errorField && currentSection.subSections) {
                     for (const sub of currentSection.subSections) {
                         if (sub.condition && !sub.condition(formData, sub.id)) continue;
                         errorField = findField(sub.fields);
                         if (errorField) break;
                     }
                 }
            }

            if (errorField) {
                setGlobalError(`Пожалуйста, заполните поле '${errorField.label}', чтобы продолжить.`);
            } else {
                 setGlobalError('Пожалуйста, заполните все обязательные поля, чтобы продолжить.'); // Fallback message
            }
            return;
        }
        setErrors({});

        const nextStepIndex = memoizedSections.findIndex((s, i) => i > currentStep && checkCondition(s.condition, s.id));
        if (nextStepIndex !== -1) setCurrentStep(nextStepIndex);
    }, [currentStep, checkCondition, memoizedSections, formData]);

    const handlePrev = useCallback(() => {
        setGlobalError('');
        const prevStepIndex = [...memoizedSections].reverse().findIndex((s, i) => {
            const originalIndex = memoizedSections.length - 1 - i;
            return originalIndex < currentStep && checkCondition(s.condition, s.id);
        });
        if (prevStepIndex !== -1) {
            setCurrentStep(memoizedSections.length - 1 - prevStepIndex);
        }
    }, [currentStep, checkCondition, memoizedSections]);
    
    const totalVisibleSteps = visibleSections.length;
    const currentSection = memoizedSections[currentStep];
    const currentVisibleIndex = visibleSections.findIndex(s => s.id === currentSection?.id);
    
    const hasNext = useMemo(() => {
        return memoizedSections.findIndex((s, i) => i > currentStep && checkCondition(s.condition, s.id)) !== -1;
    }, [currentStep, checkCondition, memoizedSections]);
    
    const hasPrev = useMemo(() => {
        const reversedSections = [...memoizedSections].reverse();
        const reversedCurrentIndex = memoizedSections.length - 1 - currentStep;
        return reversedSections.findIndex((s, i) => i > reversedCurrentIndex && checkCondition(s.condition, s.id)) !== -1;
    }, [currentStep, checkCondition, memoizedSections]);

    const handleDataChange = (path: string, value: any) => {
        if (errors[path]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[path];
                return newErrors;
            });
        }
        setGlobalError('');

        setFormData(prevData => {
            const keys = path.split('.');
            let current = { ...prevData };
            let currentLevel: any = current;

            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                const nextKey = keys[i + 1];
                const isNextKeyNumeric = !isNaN(Number(nextKey));

                if (!currentLevel[key] || typeof currentLevel[key] !== 'object') {
                    currentLevel[key] = isNextKeyNumeric ? [] : {};
                }
                currentLevel[key] = isNextKeyNumeric ? [...(currentLevel[key] || [])] : { ...(currentLevel[key] || {}) };
                currentLevel = currentLevel[key];
            }
            currentLevel[keys[keys.length - 1]] = value;

            // New logic for kitchen/living room mutual exclusion
            if (path === 'room_config.kitchen_living' && value === true) {
                current.room_config.kitchen = false;
                current.room_config.living_room = false;
            }
            if (((path === 'room_config.kitchen' && value === true) || (path === 'room_config.living_room' && value === true)) && current.room_config.kitchen_living) {
                current.room_config.kitchen_living = false;
            }

            return current;
        });
    };

    const handleEditFile = (file: IFile, path: string, mode: 'electrics' | 'annotate') => {
        setEditingFile({ file, path, mode });
    };

    const handleSaveAnnotatedFile = (path: string, newContent: string, annotations: IAnnotation[]) => {
        setFormData(prevData => {
            const files: IFile[] = getValueFromPath(prevData, path) || [];
            const fileIndex = files.findIndex(f => f.content === editingFile?.file.content);
            if (fileIndex !== -1) {
                const newFiles = [...files];
                newFiles[fileIndex] = {
                    ...newFiles[fileIndex],
                    content: newContent,
                    annotations: annotations,
                };
                
                const keys = path.split('.');
                let current = { ...prevData };
                let currentLevel: any = current;
                for (let i = 0; i < keys.length - 1; i++) {
                    currentLevel = currentLevel[keys[i]];
                }
                currentLevel[keys[keys.length - 1]] = newFiles;
                
                return current;
            }
            return prevData;
        });
        setEditingFile(null);
    };

    
    const handleHtmlExport = () => {
        const allErrors = memoizedSections.reduce((acc, _, index) => {
            return { ...acc, ...validateStep(index) };
        }, {});

        if(Object.keys(allErrors).length > 0) {
            alert("Пожалуйста, заполните все обязательные поля перед экспортом. Вы можете проверить их на экране сводки.");
            const firstErrorSectionId = Object.keys(allErrors)[0].split('.').slice(0, 2).join('_');
            const firstErrorSection = memoizedSections.find(s => s.id === firstErrorSectionId || s.id.startsWith(firstErrorSectionId.split('_')[0]));
            if(firstErrorSection) {
               jumpToStep(firstErrorSection.id);
            }
            setErrors(allErrors);
            return;
        }

        generateHtml(formData, memoizedSections);
    };

    const handleTelegramSend = async () => {
        const allErrors = memoizedSections.reduce((acc, _, index) => {
            return { ...acc, ...validateStep(index) };
        }, {});

        if(Object.keys(allErrors).length > 0) {
            alert("Пожалуйста, заполните все обязательные поля перед отправкой. Вы можете проверить их на экране сводки.");
            const firstErrorSectionId = Object.keys(allErrors)[0].split('.').slice(0, 2).join('_');
            const firstErrorSection = memoizedSections.find(s => s.id === firstErrorSectionId || s.id.startsWith(firstErrorSectionId.split('_')[0]));
            if(firstErrorSection) {
               jumpToStep(firstErrorSection.id);
            }
            setErrors(allErrors);
            return;
        }

        if (!TelegramService.isConfigured()) {
            alert("Telegram сервис не настроен. Обратитесь к администратору для настройки бота.");
            return;
        }

        setIsSendingToTelegram(true);
        setGlobalError('');

        try {
            // Генерируем HTML контент
            const htmlContent = generateHtmlContent(formData, memoizedSections);
            
            // Отправляем в Telegram
            const success = await TelegramService.sendBriefToTelegram(htmlContent, formData);
            
            if (success) {
                alert("Бриф успешно отправлен в Telegram!");
            } else {
                setGlobalError("Ошибка при отправке в Telegram. Попробуйте скачать файл и отправить вручную.");
            }
        } catch (error) {
            console.error("Ошибка при отправке в Telegram:", error);
            setGlobalError("Произошла ошибка при отправке в Telegram. Попробуйте скачать файл и отправить вручную.");
        } finally {
            setIsSendingToTelegram(false);
        }
    };

    if (!isAuthenticated) {
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen text-gray-800 dark:text-wheat-100">
            {editingFile && (
                <PlanEditor 
                    file={editingFile.file}
                    mode={editingFile.mode}
                    onSave={(newContent, annotations) => handleSaveAnnotatedFile(editingFile.path, newContent, annotations)}
                    onClose={() => setEditingFile(null)}
                />
            )}
            <Header 
                theme={theme}
                toggleTheme={toggleTheme}
            />
            
            <main className="max-w-4xl mx-auto p-4 sm:p-8 scroll-mt-24">
                <div ref={formTopRef} className="bg-white dark:bg-gradient-to-b from-[#424242] to-[#212121] p-6 sm:p-10 rounded-2xl shadow-lg dark:shadow-2xl">
                    <ProgressBar currentStep={currentVisibleIndex} totalSteps={totalVisibleSteps} />
                    
                    {currentSection ? (
                        currentSection.id === 'summary' ? (
                            <SummaryScreen 
                                formData={formData}
                                sections={memoizedSections}
                                onEdit={jumpToStep}
                            />
                        ) : (
                            <FormSection
                                key={currentSection.id}
                                section={currentSection}
                                formData={formData}
                                onDataChange={handleDataChange}
                                checkCondition={checkCondition}
                                errors={errors}
                                onEditFile={handleEditFile}
                            />
                        )
                    ) : (
                        <div className="text-center py-10">
                            <h2 className="text-2xl font-bold">Анкета завершена!</h2>
                            <p className="mt-4">Спасибо за предоставленную информацию. Вы можете экспортировать свои ответы в HTML или JSON с помощью кнопок вверху.</p>
                        </div>
                    )}

                    <Navigation
                        onPrev={handlePrev}
                        onNext={handleNext}
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                        onHtmlExport={handleHtmlExport}
                        onTelegramSend={TelegramService.isConfigured() ? handleTelegramSend : undefined}
                        globalError={globalError}
                    />
                </div>
            </main>
             <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} {STUDIO_NAME}. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default App;
