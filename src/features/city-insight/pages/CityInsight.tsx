import backArrow from '../../../assets/icons/back-arrow.svg'
import CategoryTab from "../../../shared/components/CategoryTab"
import CityInsightCard from "../components/CityInsightCard"
import SearchInputBar from '../../../shared/components/SearchInputBar'
import DetailDropDown from '../components/DetailDropDown'
import DropDown from '../components/DropDown'
import { DETAIL_OPTIONS } from '../constants/filterOptions'
import { CITY_INSIGHT_CARDS } from '../mocks/cityInsightCards'
import PageNavigation from '../../../shared/components/PageNavigation'
import RegionDropDown from '../components/RegionDropDown'
import filterResetIcon from '../../../assets/icons/icon-filter-reset.svg'
import FilterChip from '../components/FilterChip'
import { useState } from 'react'

export default function CityInsight() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([])
    const [resetKey, setResetKey] = useState(0)

    const handleSelect = (country: string) => {
        setSelectedFilters(prev =>
            prev.includes(country) ? prev : [...prev, country]
        )
    }

    const handleReset = () => {
        setSelectedFilters([])
        setResetKey(prev => prev + 1)
    }

  return (
    <div className='w-full flex flex-col items-center justify-center'>
        <div>
            <div className='flex gap-5 mb-6'>
                <img src={backArrow} alt="" />
                <h1 className='heading-05'>추천 도시</h1>
            </div>
            <div className='flex flex-col gap-4'>
                <CategoryTab categories={['워킹홀리데이','교환학생','인턴십']} activeIndex={0} onChange={()=>{}}/>
                <SearchInputBar placeholder='원하는 도시 조건을 입력해 보세요' width='w-[974px]'/>
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <DetailDropDown key={resetKey}/>
                        <RegionDropDown key={`region-${resetKey}`} onSelect={handleSelect} onReset={() => setSelectedFilters([])}/>
                        <div className='w-px h-7 bg-gray-300'></div>
                        {DETAIL_OPTIONS.map(({ title, options }) => (
                            <DropDown key={`${title}-${resetKey}`} title={title} options={options} onClick={() => {}} />
                        ))}
                    </div>
                    <button className='flex items-center gap-1' onClick={handleReset}>
                        <p className='body-03 text-gray-400'>필터 초기화</p>
                        <img src={filterResetIcon} alt="" />
                    </button>
                </div>
            </div>
            <div className='mt-3 flex gap-2'>
                {selectedFilters.map((filter) => (
                    <FilterChip key={filter} label={filter} onRemove={() => setSelectedFilters(prev => prev.filter(v => v !== filter))} />
                ))}
            </div>
            <div className='mt-11 grid grid-cols-2 gap-5'>
                {CITY_INSIGHT_CARDS.map((card) => (
                    <CityInsightCard key={card.cityName} {...card} onCompare={() => {}} onReport={() => {}} />
                ))}
            </div>
            <div className='mt-25 mb-[304px]'>
                <PageNavigation currentPage={1} totalPages={3}/>
            </div>
        </div>
    </div>
  )
}
