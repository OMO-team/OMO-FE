import { useState, useRef } from "react"
import RegionFilterIcon from "../../../shared/components/RegionFilterIcon"
import ChevronDownIcon from "../../../shared/components/ChevronDownIcon"
import searchIcon from '../../../assets/icons/icon-search[18].svg'
import { useCountriesByPurpose } from "../../home/hooks/useCountriesByPurpose"
import { useOutsideClick } from "../../../shared/hooks/useOutsideClick"
import type { Purpose } from "../../home/types/home"

interface RegionDropDownProps {
  purposeType?: Purpose['type'];
  onSelect: (codes: string[], names: string[]) => void;
  onReset: () => void;
}

export default function RegionDropDown({ purposeType, onSelect, onReset }: RegionDropDownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openContinents, setOpenContinents] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<{ name: string; code: string }[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  useOutsideClick(containerRef, () => setIsOpen(false))

  const { data: countries = [] } = useCountriesByPurpose(isOpen ? purposeType : undefined)

  const grouped = countries.reduce<Record<string, typeof countries>>((acc, country) => {
    const continent = country.continent ?? '기타'
    if (!acc[continent]) acc[continent] = []
    acc[continent].push(country)
    return acc
  }, {})

  const filteredGrouped = Object.entries(grouped).reduce<Record<string, typeof countries>>((acc, [continent, list]) => {
    const filtered = list.filter(c => c.name.includes(searchQuery))
    if (filtered.length > 0) acc[continent] = filtered
    return acc
  }, {})

  const toggleContinent = (continent: string) => {
    setOpenContinents(prev =>
      prev.includes(continent) ? prev.filter(v => v !== continent) : [...prev, continent]
    )
  }

  const toggleCountry = (name: string, code: string) => {
    setSelectedCountries(prev =>
      prev.some(c => c.code === code)
        ? prev.filter(c => c.code !== code)
        : [...prev, { name, code }]
    )
  }

  const handleApply = () => {
    onSelect(selectedCountries.map(c => c.code), selectedCountries.map(c => c.name))
    setIsOpen(false)
  }

  const handleReset = () => {
    setSelectedCountries([])
    setSearchQuery('')
    onReset()
    setOpenContinents([])
  }

  return (
    <div ref={containerRef} className="relative cursor-pointer">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="region-dropdown-panel"
        className={`inline-flex justify-center items-center gap-1 rounded-2 py-1.5 px-2 cursor-pointer ${isOpen ? 'bg-primary-500' : 'bg-gray-50 hover:bg-gray-100'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <RegionFilterIcon color={isOpen ? '#ffffff' : undefined} />
        <span className={`body-03 ${isOpen ? 'text-white' : 'text-gray-600'}`}>지역</span>
        <ChevronDownIcon color={isOpen ? '#ffffff' : undefined} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div id="region-dropdown-panel" className='absolute top-10 z-1 bg-white w-[340px] h-[340px] flex flex-col justify-start items-center border border-gray-100 rounded-2 pt-6 pb-4 shadow-01'>
          <div className="relative">
            <input
              type="text"
              placeholder="국가 검색"
              className="w-[294px] h-[34px] bg-gray-50 rounded-[10px] body-03 text-gray-400 px-3.25"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <img src={searchIcon} alt="search-icon" className="absolute top-2 right-3" />
          </div>
          <div className="mt-4 w-full border-b border-gray-100" />
          <div className="mt-4 w-full px-[30px] pb-14 overflow-y-auto">
            {Object.entries(filteredGrouped).map(([continent, countryList]) => {
              const isContinentOpen = openContinents.includes(continent)
              return (
                <div key={continent} className="mb-3">
                  <button type="button" className="h-6 w-full flex items-center justify-between cursor-pointer" onClick={() => toggleContinent(continent)}>
                    <div className="flex items-center">
                      <ChevronDownIcon className={`transition-transform duration-200 ${isContinentOpen ? 'rotate-0' : '-rotate-90'}`} />
                      <p className="ml-1 body-02 text-gray-800">{continent}</p>
                      <p className="ml-0.5 body-03 text-gray-300">({countryList.length})</p>
                    </div>
                    <div className={`flex justify-center items-center w-[39px] h-6  rounded-[6px] label-02 ${isContinentOpen ? 'bg-gray-200 text-gray-500' : 'bg-gray-20 text-gray-300'}`}>전체</div>
                  </button>
                  {isContinentOpen && (
                    <div className="mt-2 flex flex-col gap-2 pl-4">
                      {countryList.map(country => {
                        const isSelected = selectedCountries.some(c => c.code === country.code)
                        return (
                          <label key={country.countryId} className="flex gap-2 items-center cursor-pointer py-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCountry(country.name, country.code)}
                            />
                            <p className="body-05 text-gray-600">{country.name}</p>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="absolute w-full bg-white justify-center bottom-4 flex gap-1">
            <button onClick={handleReset} className="w-[110px] h-10 bg-gray-50 text-gray-400 rounded-[8px]">초기화</button>
            <button onClick={handleApply} className="w-[170px] h-10 bg-blue-500 text-white rounded-[8px]">적용하기</button>
          </div>
        </div>
      )}
    </div>
  )
}
