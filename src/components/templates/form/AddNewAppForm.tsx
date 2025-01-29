import React, { useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { ITool } from '../../../types/app';
import { AppCategoryType } from '../../../types/category';

interface AddNewAppFormProps {
    onSubmit: (newApp: ITool) => void;
    onClose: () => void;
    currentCategory: AppCategoryType;
}

export const AddNewAppForm: React.FC<AddNewAppFormProps> = ({
    onSubmit,
    onClose,
    currentCategory,
}) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [tooltip, setTooltip] = useState('');
    const [installCommand, setInstallCommand] = useState('');
    const [zshrcCommand, setZshrcCommand] = useState('');
    const [description, setDescription] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [category, setCategory] = useState<AppCategoryType | ''>('');

    const [nameError, setNameError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);

    useEffect(() => {
        setCategory(currentCategory);
    }, [currentCategory]);

    const categoryOptions = [
        { value: AppCategoryType.General, label: 'General' },
        { value: AppCategoryType.Dev, label: 'Development' },
        {
            value: AppCategoryType.Requirement,
            label: 'Requirement',
            group: 'Advanced',
        },
        {
            value: AppCategoryType.ZshPlugin,
            label: 'ZshPlugin',
            group: 'Advanced',
        },
        {
            value: AppCategoryType.Additional,
            label: 'Additional',
            group: 'Advanced',
        },
    ];

    const sortedOptions = categoryOptions.sort((a, b) =>
        a.value === currentCategory ? -1 : b.value === currentCategory ? 1 : 0
    );

    const validateField = (field: string, value: string) => {
        if (field === 'name') {
            setNameError(value.trim() === '');
        } else if (field === 'category') {
            setCategoryError(value === '');
        }
    };

    const handleBlur = (field: string, value: string) => {
        validateField(field, value);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateField('name', name);
        validateField('category', category);

        if (name.trim() === '' || category === '') {
            return;
        }

        const newApp: ITool = {
            id: uuidv4(),
            name,
            category,
            ...(tooltip && { tooltip }),
            ...(icon && { icon }),
            ...(installCommand && { installCommand }),
            ...(zshrcCommand && { zshrcCommand }),
            ...(description && { description }),
            ...(downloadUrl && { downloadUrl }),
        };

        onSubmit(newApp);
        onClose();
    };

    const inputClassName = (error: boolean) =>
        `w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`;

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    앱 이름 <span className="text-red-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur('name', name)}
                    required
                    className={inputClassName(nameError)}
                />
                {nameError && (
                    <p className="text-red-500 text-xs mt-1">
                        앱 이름은 필수입니다.
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                >
                    카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value as AppCategoryType)
                    }
                    onBlur={() => handleBlur('category', category)}
                    required
                    className={inputClassName(categoryError)}
                >
                    <option value="">카테고리 선택</option>
                    {sortedOptions
                        .filter((option) => !option.group)
                        .map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    <optgroup label="Advanced">
                        {sortedOptions
                            .filter((option) => option.group === 'Advanced')
                            .map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                    </optgroup>
                </select>
                {categoryError && (
                    <p className="text-red-500 text-xs mt-1">
                        카테고리 선택은 필수입니다.
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="icon"
                    className="block text-sm font-medium text-gray-700"
                >
                    아이콘 (옵션)
                </label>
                <input
                    id="icon"
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="tooltip"
                    className="block text-sm font-medium text-gray-700"
                >
                    툴팁 (옵션)
                </label>
                <input
                    id="tooltip"
                    type="text"
                    value={tooltip}
                    onChange={(e) => setTooltip(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="installCommand"
                    className="block text-sm font-medium text-gray-700"
                >
                    설치 명령어 (옵션)
                </label>
                <input
                    id="installCommand"
                    type="text"
                    value={installCommand}
                    onChange={(e) => setInstallCommand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="zshrcCommand"
                    className="block text-sm font-medium text-gray-700"
                >
                    zshrc 명령어 (옵션)
                </label>
                <input
                    id="zshrcCommand"
                    type="text"
                    value={zshrcCommand}
                    onChange={(e) => setZshrcCommand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                >
                    설명 (옵션)
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                />
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="downloadUrl"
                    className="block text-sm font-medium text-gray-700"
                >
                    다운로드 URL (옵션)
                </label>
                <input
                    id="downloadUrl"
                    type="url"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    취소
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    저장
                </button>
            </div>
        </form>
    );
};
