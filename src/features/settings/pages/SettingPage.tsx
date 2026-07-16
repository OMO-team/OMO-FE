import { useState } from "react";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";
import BackHeader from "../../../shared/components/BackHeader";
import ModalOverlay from "../../../shared/components/ModalOverlay";
import ProfileCard from "../components/ProfileCard";
import SettingsSectionHeader from "../components/SettingSectionHeader";
import SettingActionItem from "../components/SettingActionItem";
import ToggleSwitch from "../components/ToggleSwitch";
import LogoutButton from "../components/LogoutButton";
import ConfirmActionModal from "../components/ConfirmActionModal";

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
  onNavigateToTerms?: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

export default function SettingsPage({
  isLoggedIn = true,
  onNavigateToTerms,
  onLogout,
  onDeleteAccount,
}: SettingsPageProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [activeModal, setActiveModal] = useState<"logout" | "delete" | null>(null);

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
                onClick={onNavigateToTerms}
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
          <LogoutButton iconSrc={exitIcon} onClick={() => setActiveModal("logout")} />
          <button
            type="button"
            className="w-full text-center text-[16px] text-gray-600 underline"
            onClick={() => setActiveModal("delete")}
          >
            계정 탈퇴
          </button>
        </div>
      </main>

      <Footer />

      {activeModal === "logout" && (
        <ModalOverlay onClose={() => setActiveModal(null)}>
          <ConfirmActionModal
            title="로그아웃하시겠어요?"
            description={["현재 계정에서 로그아웃됩니다.", "다시 이용하려면 로그인해 주세요."]}
            infoTitle="로그아웃 전 확인해 주세요."
            infoDetail={[
              "로그아웃해도 저장된 국가, 로드맵, 계정 정보는 삭제되지 않습니다.",
              "다시 로그인하면 기존 정보를 그대로 확인할 수 있어요.",
            ]}
            cancelLabel="취소"
            confirmLabel="로그아웃 하기"
            onCancel={() => setActiveModal(null)}
            onConfirm={() => {
              setActiveModal(null);
              onLogout?.();
            }}
          />
        </ModalOverlay>
      )}

      {activeModal === "delete" && (
        <ModalOverlay onClose={() => setActiveModal(null)}>
          {/* Figma 원본 그대로: 회색(왼쪽) 버튼이 "탈퇴하기", 빨간(오른쪽) 버튼이 "취소" */}
          <ConfirmActionModal
            title="정말 탈퇴하시겠어요?"
            description={["탈퇴하면 계정 정보와 저장된 데이터가 삭제됩니다.", "삭제된 정보는 복구할 수 없어요."]}
            infoTitle="탈퇴 전 확인해 주세요."
            infoDetail={[
              "저장한 국가, 로드맵, 일정, 문의 내역 등 OMO에서 이용한 정보가 모두 삭제됩니다.",
              "계속 진행하려면 탈퇴하기 버튼을 눌러 주세요.",
            ]}
            cancelLabel="탈퇴하기"
            confirmLabel="취소"
            onCancel={() => {
              setActiveModal(null);
              onDeleteAccount?.();
            }}
            onConfirm={() => setActiveModal(null)}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
