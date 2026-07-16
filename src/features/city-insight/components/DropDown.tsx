import { useState } from 'react';
import ChevronDownIcon from '../../../shared/components/ChevronDownIcon';
import { twMerge } from 'tailwind-merge';

interface DropDownProps<T extends string = string> {
    title: string;
    options: T[];
    selectedOption?: T | null;
    onSelect?: (option: T) => void;
    className?: string
    triggerClassName?: string
}


export default function DropDown<T extends string>({ title, options, selectedOption, onSelect, className, triggerClassName }: DropDownProps<T>) {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

  return (
    <>
    <div className='relative'>
        <div className={twMerge('bg-gray-50 inline-flex justify-center items-center gap-1 rounded-2 py-1.5 px-2', triggerClassName)} onClick={handleOpen}>
            <p className='text-gray-600 body-03 cursor-pointer'>{title}</p>
            <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {isOpen && (
            <div className={twMerge('absolute top-10 z-1 bg-white w-32.5 flex flex-col justify-center items-center border border-gray-100 rounded-2 px-2 py-3 shadow-01', className)}>
                {options.map((option, index) => {
                    const isSelected = selectedOption === option
                    return (
                        <div key={index} className={`w-full flex justify-left items-center h-7.5 px-4 py-1.5 rounded-1 cursor-pointer ${isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}`} onClick={() => {onSelect(option); handleOpen()}}>
                            <p className={`body-04 ${isSelected ? 'text-primary-800' : 'text-gray-700'}`}>{option}</p>
                        </div>
                    )
                })}
            </div>
        )}
    </div>
    </>
  )
}
