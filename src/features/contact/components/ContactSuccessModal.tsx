import contactIcon from '../../../assets/icons/icon-contact.svg'

interface ContactModalProps {
    onClick: () => void
}

export default function ContactSuccessModal({ onClick } :ContactModalProps) {
  return (
    <div className='p-15 flex flex-col justify-center items-center w-[610px] h-[514px] bg-white rounded-4'>
        <div className='mb-5 flex justify-center items-center w-[70px] h-[70px] bg-[#F1F8FF] rounded-full'>
            <img src={contactIcon} alt=""  />
        </div>
        <h1 className='heading-05 mb-2'>문의가 접수되었어요.</h1>
        <p className='body-01 text-gray-700'>답변은 입력하신 이메일에서 확인하실 수 있습니다.</p>
        
        <div className='mt-10 w-full h-[126px] bg-gray-50 rounded-[16px] px-10 py-8'>
            <p className='body-04 text-gray-500 mb-1.5'>문의 내용은 순차적으로 확인되며, 영업일 기준 1~3일 이내에 답변드릴 예정입니다</p>
            <p className='body-04 text-gray-500'>
                빠른 답변이 필요한 경우
                <br />고객센터 0000-0000으로 문의해 주세요.
            </p>
        </div>
        <button onClick={onClick} className='mt-10 w-full h-12 bg-blue-500 text-white title-02 rounded-2'>확인</button>
    </div>
  )
}
