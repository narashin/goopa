import type React from 'react';
import { useCallback, useMemo, useState } from 'react';

import { nanoid } from 'nanoid';
import { useDropzone } from 'react-dropzone';

import { uploadToS3 } from '../../../lib/s3';
import type { ITool } from '../../../types/app';
import { AppCategoryType } from '../../../types/category';

// fieldConfig에 대한 타입 정의
type FieldConfig = {
    [key in AppCategoryType]: {
        required: string[];
        optional: string[];
        hidden: string[];
    };
};

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
    const [category, setCategory] = useState<AppCategoryType>(currentCategory);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [tooltip, setTooltip] = useState('');
    const [installCommand, setInstallCommand] = useState('');
    const [zshrcCommand, setZshrcCommand] = useState('');

    const [errors, setErrors] = useState<Record<string, boolean>>({});

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
        if (fieldConfig[category].required.includes(field)) {
            setErrors((prev) => ({ ...prev, [field]: value.trim() === '' }));
        }
    };

    const handleBlur = (field: string, value: string) => {
        validateField(field, value);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, boolean> = {};

        fieldConfig[category].required.forEach((field) => {
            const value =
                field === 'name'
                    ? name
                    : field === 'downloadUrl'
                      ? downloadUrl
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

        const newApp: ITool = {
            id: nanoid(),
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
            <div>
                <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700"
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
                {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">
                        {label}은(는) 필수입니다.
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
                        className={`w-full h-32 border-2 border-dashed ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex flex-col items-center justify-center`}
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
                    {renderField('name', '앱 이름', name, (e) =>
                        setName(e.target.value)
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
                    required
                    className={inputClassName(false)}
                >
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
            </div>

            {renderField(
                'downloadUrl',
                '다운로드 URL',
                downloadUrl,
                (e) => setDownloadUrl(e.target.value),
                'url'
            )}
            {renderField('tooltip', '툴팁', tooltip, (e) =>
                setTooltip(e.target.value)
            )}
            {renderField('installCommand', '설치 명령어', installCommand, (e) =>
                setInstallCommand(e.target.value)
            )}
            {renderField('zshrcCommand', 'zshrc 추가 코드', zshrcCommand, (e) =>
                setZshrcCommand(e.target.value)
            )}

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
