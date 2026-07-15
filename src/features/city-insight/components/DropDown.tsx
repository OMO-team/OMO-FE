import { useState } from 'react';
import dropDownIcon from '../../../assets/icons/dropdown-icon.svg'

interface DropDownProps {
    title: string;
    options: string[];
    onClick: (option: string | null) => void;
}

export default function DropDown({ title, options, onClick }: DropDownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

    const handleSelectOption = (option: string) => {
        const next = selectedOption === option ? null : option
        setSelectedOption(next)
        onClick(next)
    }
  return (
    <div className='relative'>
        <div className='bg-gray-50 inline-flex justify-center items-center gap-1 rounded-2 py-1.5 px-2' onClick={handleOpen}>
            <p className='text-gray-600 body-03'>{title}</p>
            <img src={dropDownIcon} alt="dropdown icon" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {isOpen && (
            <div className='absolute top-10 z-1 bg-white w-32.5 flex flex-col justify-center items-center border border-gray-100 rounded-2 px-2 py-3 shadow-01'>
                {options.map((option, index) => {
                    const isSelected = selectedOption === option
                    return (
                        <div key={index} className={`w-full flex justify-left items-center h-7.5 px-4 py-1.5 rounded-1 cursor-pointer ${isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}`} onClick={() => handleSelectOption(option)}>
                            <p className={`body-04 ${isSelected ? 'text-primary-800' : 'text-gray-700'}`}>{option}</p>
                        </div>
                    )
                })}
            </div>
        )}
    </div>
  )
}
