import { useState } from "react";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";
import BackHeader from "../../../shared/components/BackHeader";
import ProfileCard from "../components/ProfileCard";
import SettingsSectionHeader from "../components/SettingSectionHeader";
import SettingActionItem from "../components/SettingActionItem";
import ToggleSwitch from "../components/ToggleSwitch";
import LogoutButton from "../components/LogoutButton";

import bellIcon from "../../../assets/icons/bell.svg";
import settingIcon from "../../../assets/icons/setting.svg";
import keyIcon from "../../../assets/icons/key.svg";
import refreshIcon from "../../../assets/icons/refresh.svg";
import shieldUserIcon from "../../../assets/icons/shield-user.svg";
import infoIcon from "../../../assets/icons/info.svg";
import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import chevronDownIcon from "../../../assets/icons/chevron-down.svg";
import exitIcon from "../../../assets/icons/exit.svg";

interface SettingsPageProps {
  isLoggedIn?: boolean;
}

export default function SettingsPage({ isLoggedIn = true }: SettingsPageProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-gray-20">
      <Header isLoggedIn={isLoggedIn} userAvatarUrl={undefined} />

      <main className="mx-auto flex w-full max-w-content flex-col gap-[50px] px-[188px] pt-8">
        <BackHeader title="설정" onBack={() => window.history.back()} />

        <ProfileCard
          name="OMO 님"
          email="omo@naver.com"
          onEditProfile={() => {}}
        />

        <div className="flex flex-col gap-[30px]">
          <section className="flex flex-col gap-4 rounded-4 bg-white pb-[30px]">
            <SettingsSectionHeader iconSrc={settingIcon} title="앱 설정" />
            <div className="w-full">
              <SettingActionItem
                iconSrc={bellIcon}
                iconBgClassName="bg-primary-50"
                title="푸쉬 알림"
                description="로드맵 일정과 주요 업데이트를 알림으로 받아볼 수 있어요."
                right={
                  <ToggleSwitch
                    checked={pushEnabled}
                    onChange={setPushEnabled}
                  />
                }
              />
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-4 bg-white pb-[30px]">
            <SettingsSectionHeader
              iconSrc={shieldUserIcon}
              title="계정 및 보안"
            />
            <div className="flex w-full flex-col gap-6">
              <SettingActionItem
                iconSrc={keyIcon}
                iconBgClassName="bg-secondary-50"
                title="비밀번호 변경"
                description="안전한 계정 관리를 위해 비밀번호를 변경할 수 있어요."
                onClick={() => {}}
              />
              <SettingActionItem
                iconSrc={refreshIcon}
                iconBgClassName="bg-secondary-50"
                title="자동 동기화 (백업)"
                description="저장한 정보를 자동으로 백업해 안전하게 보관해요."
                right={
                  <ToggleSwitch
                    checked={autoSyncEnabled}
                    onChange={setAutoSyncEnabled}
                  />
                }
              />
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-4 bg-white pb-[30px]">
            <SettingsSectionHeader iconSrc={infoIcon} title="정보 및 지원" />
            <div className="flex w-full flex-col">
              <SettingActionItem
                title="1:1 문의하기"
                right={<img src={chevronRightIcon} alt="" className="h-3.5" />}
                onClick={() => {}}
              />
              <SettingActionItem
                title="이용약관 및 정책"
                right={<img src={chevronRightIcon} alt="" className="h-3.5" />}
                onClick={() => {}}
              />
              <SettingActionItem
                title="앱 버전"
                right={
                  <span className="title-03 flex items-center gap-1 rounded-2 bg-primary-50 py-2 pl-[18px] pr-3 text-primary-700">
                    v1.0.0 (최신버전)
                    <img
                      src={chevronDownIcon}
                      alt=""
                      className="size-icon-xs"
                    />
                  </span>
                }
              />
            </div>
          </section>
        </div>

        <div className="mb-[300px] flex flex-col gap-[30px]">
          <LogoutButton iconSrc={exitIcon} onClick={() => {}} />
          <button
            type="button"
            className="w-full text-center text-[16px] text-gray-600 underline"
            onClick={() => {}}
          >
            계정 탈퇴
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
