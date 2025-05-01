import React from 'react';

interface TimePeriodSelectorProps {
    selectedPeriod: string;
    onPeriodChange: (period: string) => void;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
    selectedPeriod,
    onPeriodChange
}) => {
    const periods = ['daily', 'weekly', 'monthly', 'yearly'];

    return (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <label htmlFor="time-period" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0 sm:mr-4">
                Select Time Period
            </label>
            <div className="relative w-full sm:w-auto">
                <select
                    id="time-period"
                    value={selectedPeriod}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    className="block w-full sm:w-48 md:w-64 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A] sm:text-sm rounded-md appearance-none bg-white"
                >
                    {periods.map((period) => (
                        <option key={period} value={period}>
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default TimePeriodSelector;