import type React from 'react';
import { useCallback, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import { uploadToS3 } from '../../../lib/s3';
import type { ITool } from '../../../types/app';
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
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [category, setCategory] = useState<AppCategoryType | ''>(
        currentCategory
    );
    const [downloadUrl, setDownloadUrl] = useState('');
    const [tooltip, setTooltip] = useState('');
    const [installCommand, setInstallCommand] = useState('');
    const [zshrcCommand, setZshrcCommand] = useState('');

    const [nameError, setNameError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);

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
        if (field === 'name') {
            setNameError(value.trim() === '');
        } else if (field === 'category') {
            setCategoryError(value === '');
        }
    };

    const handleBlur = (field: string, value: string) => {
        validateField(field, value);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        validateField('name', name);
        validateField('category', category);

        if (name.trim() === '' || category === '') {
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

        const newApp: ITool = {
            id: uuidv4(),
            name,
            category,
            ...(iconUrl && { icon: iconUrl }),
            ...(tooltip && { tooltip }),
            ...(installCommand && { installCommand }),
            ...(zshrcCommand && { zshrcCommand }),
            ...(downloadUrl && { downloadUrl }),
        };

        onSubmit(newApp);
        onClose();
    };

    const inputClassName = (error: boolean) =>
        `w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`;

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <div
                        {...getRootProps()}
                        className={`w-full h-32 border-2 border-dashed ${
                            isDragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex flex-col items-center justify-center`}
                    >
                        <input {...getInputProps()} />
                        {iconPreview ? (
                            <img
                                src={iconPreview || '/placeholder.svg'}
                                alt="Icon preview"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-gray-400">
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
                                <p className="mt-1 text-sm text-gray-600">
                                    아이콘 추가
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-span-2">
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
            </div>

            <div>
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
                    {categoryOptions
                        .filter((option) => !option.group)
                        .map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    <optgroup label="Advanced">
                        {categoryOptions
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

            <div>
                <label
                    htmlFor="downloadUrl"
                    className="block text-sm font-medium text-gray-700"
                >
                    다운로드 URL
                </label>
                <input
                    id="downloadUrl"
                    type="url"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    className={inputClassName(false)}
                />
            </div>

            <div>
                <label
                    htmlFor="tooltip"
                    className="block text-sm font-medium text-gray-700"
                >
                    툴팁
                </label>
                <input
                    id="tooltip"
                    type="text"
                    value={tooltip}
                    onChange={(e) => setTooltip(e.target.value)}
                    className={inputClassName(false)}
                />
            </div>

            <div>
                <label
                    htmlFor="installCommand"
                    className="block text-sm font-medium text-gray-700"
                >
                    설치 명령어
                </label>
                <input
                    id="installCommand"
                    type="text"
                    value={installCommand}
                    onChange={(e) => setInstallCommand(e.target.value)}
                    className={inputClassName(false)}
                />
            </div>

            <div>
                <label
                    htmlFor="zshrcCommand"
                    className="block text-sm font-medium text-gray-700"
                >
                    zshrc 추가 코드
                </label>
                <input
                    id="zshrcCommand"
                    type="text"
                    value={zshrcCommand}
                    onChange={(e) => setZshrcCommand(e.target.value)}
                    className={inputClassName(false)}
                />
            </div>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    닫기
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
