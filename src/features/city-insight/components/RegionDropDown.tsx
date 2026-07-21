import { useState } from "react"
import RegionFilterIcon from "../../../shared/components/RegionFilterIcon"
import ChevronDownIcon from "../../../shared/components/ChevronDownIcon"
import searchIcon from '../../../assets/icons/icon-search[18].svg'
import Chip from "../../../shared/components/Chip"
import { REGION_DATA } from '../mocks/regionData'


interface RegionDropDownProps {
  onSelect: (country: string) => void
  onReset: () => void
}

export default function RegionDropDown({ onSelect, onReset }:RegionDropDownProps) {
    const[isOpen, setIsOpen] = useState(false)
    const [openRegionIds, setOpenRegionIds] = useState<number[]>([])
    const [checkedCountries, setCheckedCountries] = useState<string[]>([])

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }

    const handleRegionOpen = (id: number) => {
      setOpenRegionIds(prev => 
        prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
      )
    }

    const handleCheck = (country: string) => {
      setCheckedCountries(prev =>
        prev.includes(country) ? prev.filter(v => v !== country) : [...prev, country]
      )
    }

  return (
    <div className="relative cursor-pointer">
            <div className={`inline-flex justify-center items-center gap-1 rounded-2 py-1.5 px-2 cursor-pointer ${isOpen ? 'bg-primary-500' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={handleOpen}>
                <RegionFilterIcon color={isOpen ? '#ffffff' : undefined}/>
                <p className={`body-03 ${isOpen ? 'text-white' : 'text-gray-600'}`}>지역</p>
                <ChevronDownIcon color={isOpen ? '#ffffff' : undefined} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
            <div className='absolute top-10 z-1 bg-white w-[340px] h-[340px] flex flex-col justify-start items-center border border-gray-100 rounded-2 pt-6 pb-4 shadow-01'>
                <div className="relative">
                  <input type="text" placeholder="국가 검색" className="w-[294px] h-[34px] bg-gray-50 rounded-[10px] body-03 text-gray-400 px-3.25" />
                  <img src={searchIcon} alt="search-icon" className="absolute top-2 right-3"/>
                </div>
                <div className="mt-4 w-full border-b border-gray-100"></div>
                <div className="mt-4 w-full px-[30px] pb-14 overflow-y-auto">
                  {REGION_DATA.map((region) => {
                    const isRegionOpen = openRegionIds.includes(region.id)
                    return (
                      <div key={region.id} className="mb-3">
                        <div className="flex justify-between">
                          <div className="h-6 flex items-center">
                            <ChevronDownIcon onClick={() => handleRegionOpen(region.id)} className={`transition-transform duration-200 ${isRegionOpen ? 'rotate-0' : '-rotate-90'}`} />
                            <p className="ml-1 body-02 text-gray-800">{region.title}</p>
                            <p className="ml-0.5 body-03 text-gray-300">({region.num})</p>
                          </div>
                          <Chip label="전체" className="label-02 bg-gray-20 px-2.5 py-[4.5px] text-gray-300"/>
                        </div>
                        {isRegionOpen && region.content && (
                          <div className="mt-2 flex flex-col gap-2.5 pl-4">
                            {region.content.map((country) => (
                              <div className="flex gap-1 items-center">
                                <input type="checkbox" checked={checkedCountries.includes(country)} onChange={() => handleCheck(country)}/>
                                <p key={country} className="body-05 text-gray-600">{country}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="absolute w-full h-10 bg-white justify-center  pb-4 bottom-4 flex gap-1">
                  <button onClick={() => { setCheckedCountries([]); onReset() }} className="w-[110px] h-10 bg-gray-50 text-gray-400 rounded-[8px]">초기화</button>
                  <button onClick={() => { checkedCountries.forEach(country => onSelect(country)); setIsOpen(false) }} className="w-[170px] h-10 bg-blue-500 text-white rounded-[8px]">적용하기</button>
                </div>
            </div>
            )}
        </div>
  )
}
