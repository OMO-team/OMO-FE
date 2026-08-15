// react
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// assests
import backArrow from '../../../assets/icons/back-arrow.svg'
import cameraIcon from '../../../assets/icons/icon-camera.svg'

// components
import DropDown from '../../../shared/components/DropDown'
import ContactSuccessModal from '../components/ContactSuccessModal'

// constants
import { CONTACT_TYPE_OPTIONS, CONTACT_TYPE_MAP, type ContactType } from '../constants/contactOptions'

// hooks
import { useGetUploadUrls, useUploadFileToS3, usePostInquiry } from '../hooks/useInquiry'

export default function Contact() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [content, setContent] = useState('')
    const [contactType, setContactType] = useState<ContactType | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [preview, setPreview] = useState<string[]>([])
    const [files, setFiles] = useState<(File | null)[]>([null, null, null])

    const { mutateAsync: getUploadUrls } = useGetUploadUrls()
    const { mutateAsync: uploadFileToS3 } = useUploadFileToS3()
    const { mutateAsync: postInquiry } = usePostInquiry()

    const handeFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (!file) return
        setFiles(prev => {
            const next = [...prev]
            next[index] = file
            return next
        })
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
        setFiles(prev => {
            const next = [...prev]
            next[index] = null
            return next
        })
        setPreview(prev => {
            const next = [...prev]
            next[index] = ''
            return next
        })
    }

    const isValid = contactType !== null && name.trim() !== '' && email.trim() !== '' && content.trim().length >= 10 && content.trim().length <= 1000

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const validFiles = files.filter((f): f is File => f !== null)

            let uploadToken = ''
            let attachmentKeys: string[] = []

            if (validFiles.length > 0) {
                const { data } = await getUploadUrls({
                    files: validFiles.map(f => ({
                        fileName: f.name,
                        contentType: f.type,
                        fileSize: f.size,
                    })),
                })

                uploadToken = data.result.uploadToken
                attachmentKeys = data.result.uploads.map(u => u.objectKey)

                await Promise.all(
                    data.result.uploads.map((upload, i) =>
                        uploadFileToS3({ uploadUrl: upload.uploadUrl, file: validFiles[i] })
                    )
                )
            }

            await postInquiry({
                type: CONTACT_TYPE_MAP[contactType!],
                name,
                email,
                content,
                uploadToken,
                attachmentKeys,
            })

            setIsModalOpen(true)
        } catch (error) {
            console.error('문의 제출 중 오류가 발생했습니다.', error)
            alert('문의 제출 중 오류가 발생했습니다. 다시 시도해 주세요.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setContactType(null)
        setName('')
        setEmail('')
        setContent('')
        setFiles([null, null, null])
        setPreview([])
    }

  return (
    <div className='w-full'>
        {/* 좌우 여백을 Header와 동일한 구조로 맞춰, 창 폭이 줄어들어도 헤더 로고와 본문 왼쪽 경계선이
            항상 일치하게 한다. xl 미만에서 안쪽 max-w-[888px] + mx-auto가 Header.tsx의 모바일
            헤더와 똑같은 공식으로 거터를 32px→188px까지 서서히 늘리다가, xl 이상에서는 바깥
            px-[188px] 고정값으로 넘겨받는다 — 안쪽 없이 바깥만 xl:px-[188px]로 고정하면
            968~1280px 구간에서 헤더는 점점 벌어지는데 본문은 32px에 멈춰 있다가 1280px 경계에서
            갑자기 튀는 문제가 있었다 */}
        <div className='px-8 xl:px-[188px]'>
          <div className='mx-auto w-full max-w-[888px] xl:mx-0 xl:max-w-none'>
            {/* 헤더 */}
            <div className='mt-14 mb-14'>
                <div className='flex gap-5 mb-4.5'>
                    <button type="button" onClick={() => navigate('/setting')} aria-label="설정으로 돌아가기">
                        <img src={backArrow} alt="" />
                    </button>
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
                <div className='mt-5 px-5 py-3 bg-gray-100 rounded-[12px] flex flex-wrap gap-4 items-center'>
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
                    triggerClassName='w-full max-w-49'
                    className='w-full max-w-49 bg-gray-50 border border-gray-100'
                    />
                </div>

                {/* 이름 / 이메일 입력 */}
                <div className='mt-7.5 w-full flex flex-wrap items-center gap-14.5'>
                    <div className='flex flex-1 basis-0 min-w-60 flex-col gap-6.75'>
                        <p className='title-05'>이름<span className='text-red-500'>*</span></p>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='w-full max-w-100.5 border border-gray-100 rounded-[8px] px-4 py-3 body-03 text-gray-900 placeholder:text-gray-300' placeholder='이름을 입력해주세요' />
                    </div>

                    <div className='flex flex-1 basis-0 min-w-60 flex-col gap-2'>
                        <div className='flex flex-col gap-0.5'>
                            <p className='title-05'>이메일<span className='text-red-500'>*</span></p>
                            <p className='label-01 text-gray-600'>문의 답변은 입력한 이메일로 발송됩니다.</p>
                        </div>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className='w-full max-w-100 border border-gray-100 rounded-[8px] px-4 py-3 body-03 text-gray-900 placeholder:text-gray-300' placeholder='답변을 받을 이메일을 입력해주세요' />
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
                    <div className='flex flex-wrap gap-[14px]'>
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
                    <button disabled={!isValid || isSubmitting} onClick={handleSubmit} className='mt-20 w-full max-w-[282px] h-12 bg-gray-700 text-white rounded-[8px] title-02 disabled:bg-gray-400'>{isSubmitting ? '제출 중...' : '문의하기'}</button>
                </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
            <div className='bg-[#2B313B]/50 fixed inset-0 flex justify-center items-start pt-[142px]'>
                <ContactSuccessModal onClick={handleModalClose}/>
            </div>
        )}
    </div>
  )
}