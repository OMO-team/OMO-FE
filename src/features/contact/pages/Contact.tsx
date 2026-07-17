import { useState } from 'react'
import backArrow from '../../../assets/icons/back-arrow.svg'
import cameraIcon from '../../../assets/icons/icon-camera.svg'
import DropDown from '../../city-insight/components/DropDown'
import ContactSuccessModal from '../components/ContactSuccessModal'
import { CONTACT_TYPE_OPTIONS, type ContactType } from '../constants/contactOptions'

export default function Contact() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [content, setContent] = useState('')
    const [contactType, setContactType] = useState<ContactType | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [preview, setPreview] = useState<string[]>([])

    const handeFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (!file)
            return 
        const url = URL.createObjectURL(file)
        setPreview(prev => {
            const next = [...prev]
            next[index] = url
            return next
        })
    }

    const handleRemovePreview = (e: React.MouseEvent, index: number) => {
        e.preventDefault()
        e.stopPropagation()
        setPreview(prev => {
            const next = [...prev]
            next[index] =''
            return next
        })
    }

    const isValid = contactType !== null && name.trim() !== '' && email.trim() !== '' && content.trim() !== ''

    const handleSubmit = () => {
        setIsModalOpen(true) 
    }

    const handleModalClosse = () => {
        setIsModalOpen(false) 
        setContactType(null)
        setName('')
        setEmail('')
        setContent('')
    }

  return (
    <div className='w-full flex flex-col items-center justify-center'>
        <div>
            {/* 헤더 */}
            <div className='mb-14'>
                <div className='flex gap-5 mb-4.5'>
                    <img src={backArrow} alt="" />
                    <h1 className='heading-05'>1:1 문의하기</h1>
                </div>
                <p className='body-03 text-gray-600'>서비스 이용 중 궁금한 점이나 도움이 필요한 내용을 남겨주세요. 확인 후 빠르게 답변을 드리겠습니다.</p>
            </div>
            
            {/* 문의하기 기능 소개 */}
            <div>
                <h1 className='heading-05 mb-6'>
                    1:1 문의 접수를 위해
                    <br />아래 정보를 입력해 주세요.
                </h1>
                <p className='body-03 text-gray-800 mb-4'>서비스 이용 중 궁금한 점이나 도움이 필요한 내용을 남겨주세요.
                <br />문의 내용은 담당자가 확인한 후 입력하신 이메일로 답변드릴게요.</p>
                <p className='body-03 text-gray-800'>
                    정확한 확인을 위해 문의 유형과 내용을 자세히 작성해 주세요.
                    <br />오류 문의의 경우 화면 캡처를 함께 첨부하면 더 빠른 확인이 가능해요.
                </p>
                {/* 고객센터 정보 */}
                <div className='mt-5 px-5 py-3 bg-gray-100 rounded-[12px] flex gap-4 items-center'>
                    <div className='flex gap-2 items-center'>
                        <h3 className='body-01'>고객센터</h3>
                        <h3 className='body-01'>omo@omo.com</h3>
                    </div>
                    <p className='label-01 text-gray-500'>평일 00:00 - 00:00 운영됩니다.</p>
                </div>
            </div>

            
            <div className='mt-14.5'>

                {/* 문의 유형 드롭다운 */}
                <div className='flex flex-col gap-3.25'>
                    <p className='title-05'>문의 유형<span className='text-red-500'>*</span></p>
                    <DropDown 
                    title={contactType ?? '문의 유형을 선택해 주세요.'}
                    options={[...CONTACT_TYPE_OPTIONS]}
                    onSelect={(option) => setContactType(option)}
                    triggerClassName='w-49'
                    className='w-49 bg-gray-50 border border-gray-100'
                    />
                </div>

                {/* 이름 / 이메일 입력 */}
                <div className='mt-7.5 w-full flex items-center gap-14.5'>
                    <div className='flex flex-col gap-6.75'>
                        <p className='title-05'>이름<span className='text-red-500'>*</span></p>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='w-100.5 border border-gray-100 rounded-[8px] px-4 py-3 body-03 text-gray-900 placeholder:text-gray-300' placeholder='이름을 입력해주세요' />
                    </div>
                    
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-0.5'>
                            <p className='title-05'>이메일<span className='text-red-500'>*</span></p>
                            <p className='label-01 text-gray-600'>문의 답변은 입력한 이메일로 발송됩니다.</p>
                        </div>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className='w-100 border border-gray-100 rounded-[8px] px-4 py-3 body-03 text-gray-900 placeholder:text-gray-300' placeholder='답변을 받을 이메일을 입력해주세요' />
                    </div>
                </div>

                {/* 문의 내용 작성*/}
                <div className='mt-[30px]'>
                    <div className='mb-5 flex flex-col gap-0.5'>
                        <p className='title-05'>문의 내용<span className='text-red-500'>*</span></p>
                        <p className='label-01 text-gray-600'>
                            상황을 자세히 적어주시면 더 정확한 답변을 받을 수 있어요.
                            <br />문의 내용은 최소 10자 이상, 최대 1,000자 이하로 작성해 주세요.
                        </p>
                    </div>
                    <div className='relative'>
                        <textarea   
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className='w-full h-107 bg-gray-20 rounded-[16px] p-[30px] whitespace-pre-line body-03 text-gray-900 resize-none placeholder:text-gray-300'
                            placeholder={`문의하실 내용을 자세히 입력해 주세요\n예: 저장한 국가가 보이지 않아요 / 로드맵 일정이 수정되지 않아요 / 이메일 인증이 오지 않아요`}/>
                        <p className='absolute bottom-[30px] right-[30px] label-01 text-gray-600'>{content.length} / 1,000</p>
                    </div>
                </div>

                {/* 첨부파일 업로드*/}
                <div className='mt-[30px]'>
                    <div className='mb-6 flex flex-col gap-0.5'>
                        <p className='title-05'>첨부 파일</p>
                        <p className='label-01 text-gray-600'>
                            이미지는 최대 3개까지 첨부할 수 있어요.  PDF, JPG/JPEG, PNG 최대 5MB 이하
                        </p>
                    </div>
                    <div className='flex gap-[14px]'>
                        {[0,1,2].map((index) => (
                            <label key={index}>
                                <input type="file" className='hidden' accept='image/*' onChange={(e) => handeFileChange(e, index)} />
                                <div className='relative w-35 h-35 bg-gray-20 rounded-[12px]'>
                                    {preview[index] 
                                        ? <img src={preview[index]} alt="" className="w-full h-full object-cover rounded-[12px] overflow-hidden'" />
                                        : <div className='w-full h-full flex justify-center items-center'>
                                            <div className='bg-gray-100 rounded-full w-12 h-12 flex justify-center items-center'>
                                                <img src={cameraIcon} alt="" className=''/>
                                            </div>
                                        </div>
                                    }
                                    {preview[index] && <div onClick={(e) => handleRemovePreview(e, index)} className='absolute -top-2.5 -right-2.5 w-5 h-5 bg-warning-400 rounded-full flex justify-center items-center text-white'>-</div>}
                                </div>
                            </label>
                        ))}                        
                    </div>
                </div>

                {/* 문의하기 버튼 */}
                <div className='w-full flex justify-end mb-[300px]'>
                    <button disabled={!isValid} onClick={handleSubmit} className='mt-20 w-[282px] h-12 bg-gray-700 text-white rounded-[8px] title-02 disabled:bg-gray-400'>문의하기</button>
                </div>
            </div>
        </div>

        {isModalOpen && (
            <div className='bg-[#2B313B]/50 fixed inset-0 flex justify-center items-start pt-[142px]'>
                <ContactSuccessModal onClick={handleModalClosse}/>
            </div>
        )}
    </div>
  )
}