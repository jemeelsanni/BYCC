import React, { useState } from 'react';

interface RedCheckboxProps {
    label: string;
    onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<RedCheckboxProps> = ({ label, onChange }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        if (onChange) {
            onChange(checked);
        }
    };

    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                id={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="hidden"
            />
            <label
                htmlFor={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
                className="flex items-center cursor-pointer"
            >
                <div
                    className={`
            w-5 h-5 border-2 mr-2 flex items-center justify-center
            ${isChecked ? 'bg-[#D7000F] border-[#D7000F]' : 'border-gray-300'}
          `}
                >
                    {isChecked && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </div>
                <span>{label}</span>
            </label>
        </div>
    );
};

export default Checkbox;