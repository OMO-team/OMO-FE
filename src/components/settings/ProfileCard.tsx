import profileImage from "../../assets/icons/profile-image.svg";

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onEditProfile?: () => void;
}

export default function ProfileCard({
  name,
  email,
  avatarUrl,
  onEditProfile,
}: ProfileCardProps) {
  return (
    <div className="flex items-start gap-[30px] self-stretch rounded-4 bg-white px-10 py-[30px]">
      <div
        className="size-[86px] shrink-0 overflow-hidden rounded-full bg-gray-100"
        style={{ boxShadow: "0px 3px 8px 0 rgba(6,49,88,0.16)" }}
      >
        <img
          src={avatarUrl || profileImage}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex w-[107px] flex-col items-start justify-center gap-5">
        <div className="flex flex-col items-start gap-1">
          <p className="title-01 text-gray-900">{name}</p>
          <p className="title-03 text-gray-600">{email}</p>
        </div>
        <button
          type="button"
          onClick={onEditProfile}
          className="title-03 rounded-2 bg-primary-50 px-[18px] py-2 text-primary-700"
        >
          프로필 수정
        </button>
      </div>
    </div>
  );
}
