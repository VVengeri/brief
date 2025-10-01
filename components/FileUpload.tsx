import React, { useCallback, useState } from 'react';
import { IFile } from '../types';

interface FileUploadProps {
    value: IFile[];
    onChange: (files: IFile[]) => void;
    hasError?: boolean;
    onEdit?: (file: IFile, path: string) => void;
    path: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ value: files, onChange, hasError, onEdit, path }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            processFiles(Array.from(selectedFiles));
        }
    };
    
    const processFiles = (fileList: File[]) => {
        const newFiles: Promise<IFile>[] = fileList.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({
                        name: file.name,
                        type: file.type,
                        content: e.target?.result as string,
                        annotations: [], // Initialize with empty annotations
                    });
                };
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newFiles).then(processedFiles => {
            onChange([...files, ...processedFiles]);
        });
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            processFiles(Array.from(event.dataTransfer.files));
            event.dataTransfer.clearData();
        }
    }, [files, onChange]);

    const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };


    const removeFile = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label 
                onDrop={handleDrop}
                onDragOver={handleDragEnter} // Same as enter
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                htmlFor={`file-upload-${path}`} 
                className={`flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer
                    ${hasError
                        ? 'border-red-500 dark:border-red-400'
                        : isDragging 
                            ? 'border-indigo-500 dark:border-wheat bg-indigo-100/50 dark:bg-wheat/20' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-wheat-400'}
                    transition-colors duration-200`}
            >
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <span className="relative font-medium text-indigo-600 dark:text-wheat-300">
                            <span>Загрузите файлы</span>
                            <input id={`file-upload-${path}`} name={`file-upload-${path}`} type="file" className="sr-only" multiple onChange={handleFileChange} />
                        </span>
                        <p className="pl-1">или перетащите их сюда</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, PDF</p>
                </div>
            </label>
            {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative group border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex flex-col justify-between">
                            {file.type.startsWith('image/') ? (
                                <img src={file.content} alt={file.name} className="w-full h-24 object-contain rounded-md" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-24 bg-gray-100 dark:bg-gray-800 rounded-md">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                </div>
                            )}
                             <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 truncate w-full">{file.name}</p>
                            
                            {file.type.startsWith('image/') && onEdit && (
                                <button
                                    onClick={() => onEdit(file, path)}
                                    className="mt-2 w-full text-sm text-center py-2 px-2 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-wheat dark:text-gray-900 dark:hover:bg-wheat-200 transition-colors"
                                >
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    <span>Редактировать</span>
                                </button>
                            )}
                            
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Удалить файл"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
