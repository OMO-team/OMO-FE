import { useState, useRef, useId } from 'react';
import ChevronDownIcon from './ChevronDownIcon';
import { twMerge } from 'tailwind-merge';
import { useOutsideClick } from '../hooks/useOutsideClick';

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
    const containerRef = useRef<HTMLDivElement>(null)
    const panelId = useId()
    useOutsideClick(containerRef, () => setIsOpen(false))

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

  return (
    <>
    <div ref={containerRef} className='relative'>
        <button type="button" aria-expanded={isOpen} aria-controls={panelId} className={twMerge('bg-gray-50 inline-flex justify-center items-center gap-1 rounded-2 py-1.5 px-2 cursor-pointer', triggerClassName)} onClick={handleOpen}>
            <span className='text-gray-600 body-03'>{title}</span>
            <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
            <div id={panelId} className={twMerge('absolute top-10 z-1 bg-white w-32.5 flex flex-col justify-center items-center border border-gray-100 rounded-2 px-2 py-3 shadow-01', className)}>
                {options.map((option, index) => {
                    const isSelected = selectedOption === option
                    return (
                        <div key={index} className={`w-full flex justify-left items-center h-7.5 px-4 py-1.5 rounded-1 cursor-pointer ${isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}`} onClick={() => {onSelect?.(option); handleOpen()}}>
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
