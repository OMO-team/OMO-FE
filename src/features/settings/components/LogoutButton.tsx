interface LogoutButtonProps {
  iconSrc: string;
  onClick?: () => void;
}

export default function LogoutButton({ iconSrc, onClick }: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="title-01 flex w-full items-center justify-center gap-2 rounded-4 border border-red-100 bg-white px-[30px] py-5 text-[#FF2A14] transition-colors hover:bg-red-50"
    >
      <img src={iconSrc} alt="" className="size-icon-md" />
      로그아웃
    </button>
  );
}
