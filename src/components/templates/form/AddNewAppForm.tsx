'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useDropzone } from 'react-dropzone';

import { uploadToS3 } from '../../../lib/s3';
import { useCategoryStore } from '../../../stores/categoryStore';
import { AppCategoryType, SubCategoryType } from '../../../types/category';
import { ITool } from '../../../types/item';

type FieldConfig = {
    [key in AppCategoryType]: {
        required: string[];
        optional: string[];
        hidden: string[];
    };
};

interface AddNewAppFormProps {
    onSubmit: (newApp: Omit<ITool, 'id' | 'starCount' | 'userId'>) => void;
    onClose: (e?: React.MouseEvent) => void;
}

export const AddNewAppForm: React.FC<AddNewAppFormProps> = ({
    onSubmit,
    onClose,
}) => {
    const [name, setName] = useState('');
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const { category, selectedSubCategory } = useCategoryStore();
    const [localCategory, setLocalCategory] =
        useState<AppCategoryType>(category);
    const [subCategory, setSubCategory] = useState<SubCategoryType | null>(
        selectedSubCategory
    );
    const [url, setDownloadUrl] = useState('');
    const [tooltip, setTooltip] = useState('');
    const [installCommand, setInstallCommand] = useState('');
    const [zshrcCommand, setZshrcCommand] = useState('');
    const [formTouched, setFormTouched] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (category === AppCategoryType.Advanced) {
            // "Advanced"일 때 subCategory를 기본값으로 설정
            setSubCategory(selectedSubCategory || SubCategoryType.Requirement);
        } else {
            setSubCategory(null); // "Advanced" 아닌 카테고리에서는 subCategory를 null
        }
    }, [category, selectedSubCategory]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as AppCategoryType;
        setLocalCategory(newCategory);

        if (newCategory === AppCategoryType.Advanced) {
            setSubCategory(SubCategoryType.Requirement); // Advanced일 때 기본적으로 Requirement 설정
        } else {
            setSubCategory(null); // Advanced가 아닌 카테고리에서는 subCategory를 null로 설정
        }
    };

    const handleSubCategoryChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSubCategory(e.target.value as SubCategoryType);
    };

    const categoryOptions = [
        { value: AppCategoryType.General, label: 'General' },
        { value: AppCategoryType.Dev, label: 'Development' },
        {
            value: AppCategoryType.Advanced,
            label: 'Advanced',
        },
    ];

    const subCategoryOptions = [
        { value: SubCategoryType.Requirement, label: 'Requirement' },
        { value: SubCategoryType.ZshPlugin, label: 'Zsh Plugin' },
        { value: SubCategoryType.Additional, label: 'Additional' },
    ];

    const fieldConfig: FieldConfig = useMemo(
        () => ({
            [AppCategoryType.Home]: {
                required: ['name'],
                optional: [
                    'icon',
                    'tooltip',
                    'downloadUrl',
                    'installCommand',
                    'zshrcCommand',
                ],
                hidden: [],
            },
            [AppCategoryType.General]: {
                required: ['name', 'downloadUrl'],
                optional: ['icon', 'tooltip'],
                hidden: ['installCommand', 'zshrcCommand'],
            },
            [AppCategoryType.Dev]: {
                required: ['name', 'downloadUrl'],
                optional: ['icon', 'tooltip'],
                hidden: ['installCommand', 'zshrcCommand'],
            },
            [AppCategoryType.ZshPlugin]: {
                required: ['name', 'installCommand'],
                optional: ['icon', 'tooltip', 'downloadUrl', 'zshrcCommand'],
                hidden: [],
            },
            [AppCategoryType.Requirement]: {
                required: ['name', 'installCommand'],
                optional: ['icon', 'tooltip', 'downloadUrl', 'zshrcCommand'],
                hidden: [],
            },
            [AppCategoryType.Additional]: {
                required: ['name', 'installCommand'],
                optional: ['icon', 'tooltip', 'downloadUrl', 'zshrcCommand'],
                hidden: [],
            },
            [AppCategoryType.Advanced]: {
                required: ['name', 'installCommand'],
                optional: ['icon', 'tooltip', 'downloadUrl', 'zshrcCommand'],
                hidden: [],
            },
        }),
        []
    );

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setIconFile(file);
            setIconPreview(URL.createObjectURL(file));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        multiple: false,
    });

    const validateField = (field: string, value: string) => {
        if (formTouched && fieldConfig[category].required.includes(field)) {
            setErrors((prev) => ({ ...prev, [field]: value.trim() === '' }));
        }
    };

    useEffect(() => {
        fieldConfig[category].required.forEach((field) => {
            const value =
                field === 'name'
                    ? name
                    : field === 'downloadUrl'
                      ? url
                      : field === 'installCommand'
                        ? installCommand
                        : field === 'zshrcCommand'
                          ? zshrcCommand
                          : '';

            validateField(field, value);
        });
    }, [category, url, installCommand, zshrcCommand, name]);

    const isFormValid = useMemo(() => {
        return fieldConfig[category].required.every((field) => {
            const value =
                field === 'name'
                    ? name
                    : field === 'downloadUrl'
                      ? url
                      : field === 'installCommand'
                        ? installCommand
                        : field === 'zshrcCommand'
                          ? zshrcCommand
                          : '';

            return value.trim() !== '' && !errors[field];
        });
    }, [errors, category, name, url, installCommand, zshrcCommand]);

    const handleBlur = (field: string, value: string) => {
        setFormTouched(true);
        validateField(field, value);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormTouched(true);
        const newErrors: Record<string, boolean> = {};

        fieldConfig[category].required.forEach((field) => {
            const value =
                field === 'name'
                    ? name
                    : field === 'downloadUrl'
                      ? url
                      : field === 'installCommand'
                        ? installCommand
                        : '';
            if (value.trim() === '') {
                newErrors[field] = true;
            }
        });

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        let iconUrl = '';
        if (iconFile) {
            try {
                iconUrl = await uploadToS3(iconFile);
            } catch (error) {
                console.error('Image upload failed:', error);
                return;
            }
        }

        const newItem: Omit<ITool, 'id' | 'starCount' | 'userId'> = {
            name,
            category: AppCategoryType.Advanced, // category는 항상 'Advanced'
            subCategory: subCategory || null, // subCategory는 선택한 값
            icon: iconUrl || undefined,
            tooltip: tooltip || undefined,
            installCommand: installCommand || undefined,
            zshrcCommand: zshrcCommand || undefined,
            url: url || undefined,
        };

        onSubmit(newItem);
    };

    const inputClassName = (hasError: boolean) =>
        `w-full px-2 py-1 text-xs text-gray-700 border ${
            hasError ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white`;

    const renderField = (
        field: string,
        label: string,
        value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        type = 'text'
    ) => {
        if (fieldConfig[category].hidden.includes(field)) {
            return null;
        }

        const isRequired = fieldConfig[category].required.includes(field);

        return (
            <div className="mb-4">
                <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}{' '}
                    {isRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                    id={field}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={() => handleBlur(field, value)}
                    required={isRequired}
                    className={inputClassName(!!errors[field])}
                />
                {formTouched && errors[field] && (
                    <p className="text-red-500 text-xs mt-1">
                        {label} is required.
                    </p>
                )}
            </div>
        );
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <div
                        {...getRootProps()}
                        className={`w-32 h-32 border-2 border-dashed ${
                            isDragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex flex-col items-center justify-center 
                        transition-colors duration-200 mx-auto`}
                    >
                        <input {...getInputProps()} />
                        {iconPreview ? (
                            <img
                                src={iconPreview || '/placeholder.svg'}
                                alt="Icon preview"
                                className="w-full h-full object-contain rounded-md"
                            />
                        ) : (
                            <div className="text-gray-400 text-center">
                                <svg
                                    className="mx-auto h-12 w-12"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <p className="mt-1 text-xs text-gray-600">
                                    Insert Image
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-span-2">
                    {renderField('name', 'Name', name, (e) =>
                        setName(e.target.value)
                    )}
                </div>
            </div>

            <div className="mb-4">
                <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Category <span className="text-red-500">*</span>
                </label>
                <select
                    id="category"
                    value={localCategory}
                    onChange={handleCategoryChange}
                    required
                    className={inputClassName(!!errors.category)}
                >
                    {categoryOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {localCategory === AppCategoryType.Advanced && (
                <div className="mb-4">
                    <label
                        htmlFor="subCategory"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Subcategory <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="subCategory"
                        value={subCategory || ''}
                        onChange={handleSubCategoryChange}
                        required
                        className={inputClassName(!!errors.subCategory)}
                    >
                        {subCategoryOptions.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {renderField(
                'downloadUrl',
                'URL',
                url,
                (e) => setDownloadUrl(e.target.value),
                'url'
            )}
            {renderField('tooltip', 'Tooltip', tooltip, (e) =>
                setTooltip(e.target.value)
            )}
            {renderField(
                'installCommand',
                'Install Command',
                installCommand,
                (e) => setInstallCommand(e.target.value)
            )}
            {renderField(
                'zshrcCommand',
                'Install Code for zshrc',
                zshrcCommand,
                (e) => setZshrcCommand(e.target.value)
            )}

            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-[4px] hover:bg-gray-50 
                    focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors shadow-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`px-3 py-1 text-xs rounded-[4px] transition-colors shadow-sm ${
                        isFormValid
                            ? 'bg-[#007AFF] text-white hover:bg-[#0063CC] focus:ring-1 focus:ring-blue-400'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Save
                </button>
            </div>
        </form>
    );
};
