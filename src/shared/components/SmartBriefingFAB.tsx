import { useMainLayoutContext } from "../layouts/useMainLayoutContext"
import SmartBriefingIcon from "./SmartBriefingIcon"

export default function SmartBriefingFAB() {
  const { openChat } = useMainLayoutContext();
  return (
    <button onClick={() => openChat()} className="group h-16 overflow-hidden max-w-16 hover:max-w-[180px] px-5 bg-black rounded-[12px] flex justify-center items-center fixed bottom-10 right-[30px] z-50 transition-[max-width] duration-300 whitespace-nowrap">
      <SmartBriefingIcon type="white" />
      <span className="title-02 text-white overflow-hidden max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:pl-2.5 transition-all duration-300">
        스마트 브리핑
      </span>
    </button>
  )
}
