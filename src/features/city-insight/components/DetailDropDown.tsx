import { useState, useEffect } from "react"
import FilterIcon from "../../../shared/components/FilterIcon"
import { DETAIL_OPTIONS } from "../constants/filterOptions"

interface DetailDropDownProps {
    selectedOptions: Record<string, string>;
    onSelect: (title: string, option: string) => void;
}

export default function DetailDropDown({ selectedOptions, onSelect }: DetailDropDownProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const allSelected = DETAIL_OPTIONS.every(item => selectedOptions[item.title])
        if (allSelected) 
            setIsOpen(false)
    }, [selectedOptions])

  return (
    <div className="relative cursor-pointer">
        <div className={`inline-flex justify-center items-center gap-1 rounded-2 py-1.5 px-2 cursor-pointer ${isOpen ? 'bg-primary-500' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={handleOpen}>
            <FilterIcon color={isOpen ? '#ffffff' : undefined}/>
            <p className={`body-03 ${isOpen ? 'text-white' : 'text-gray-600'}`}>상세필터</p>
        </div>
        {isOpen && (
        <div className='absolute top-10 z-1 bg-white w-[624px] h-[242px] flex flex-col justify-center items-center border border-gray-100 rounded-2 px-6 py-5 shadow-01'>
            {DETAIL_OPTIONS.map((item, index) => (
                <div key={item.title} className={`w-full flex items-center ${index !== DETAIL_OPTIONS.length - 1 ? 'mb-3' : ''}`}>
                    <div className="flex items-center w-25 shrink-0">
                        <p className="flex-1 text-gray-700 body-02">{item.title}</p>
                        <div className="w-px h-4 bg-gray-200" />
                    </div>
                    <div className="flex ml-5">
                        {item.options.map((option) => {
                            const isSelected = selectedOptions[item.title] === option
                            return (
                                <div key={option} className={`flex items-center pl-4 w-28.5 h-7.5 rounded-1 cursor-pointer ${isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}`} onClick={() => {onSelect(item.title, option)}}>
                                    <p className={`body-04 ${isSelected ? 'text-primary-800' : 'text-gray-700'}`}>{option}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
        )}
    </div>
  )
}
