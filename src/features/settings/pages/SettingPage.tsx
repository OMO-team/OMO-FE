import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../../auth/api/authApi";
import { memberApi } from "../api/memberApi";
import TopAlertBanner from "../../../shared/components/TopAlertBanner";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";
import BackHeader from "../../../shared/components/BackHeader";
import ModalOverlay from "../../../shared/components/ModalOverlay";
import ProfileCard from "../components/ProfileCard";
import ProfileEditModal from "../components/ProfileEditModal";
import PasswordChangeModal from "../components/PasswordChangeModal";
import ForgotPasswordModal from "../../auth/components/ForgotPasswordModal";
import SettingsSectionHeader from "../components/SettingSectionHeader";
import SettingActionItem from "../components/SettingActionItem";
import ToggleSwitch from "../components/ToggleSwitch";
import LogoutButton from "../components/LogoutButton";
import ConfirmActionModal from "../../../shared/components/ConfirmActionModal";

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
  onNavigateToTerms?: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => Promise<void>;
  onPasswordChangeSuccess?: () => void;
}

export default function SettingsPage({
  onNavigateToTerms,
  onLogout,
  onDeleteAccount,
  onPasswordChangeSuccess,
}: SettingsPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuthStore();
  const locationState = location.state as Record<string, unknown> | null;
  const rawGoogleLinkResult = locationState?.googleLinkResult;
  const googleLinkResult =
    rawGoogleLinkResult === 'success' || rawGoogleLinkResult === 'error'
      ? rawGoogleLinkResult
      : null;
  const googleLinkError =
    typeof locationState?.googleLinkError === 'string'
      ? locationState.googleLinkError
      : null;

  const [activeModal, setActiveModal] = useState<
    "logout" | "delete" | "profile" | "password-change" | "password-find" | null
  >(null);

  // 프로필 데이터
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // 설정 데이터
  const [pushEnabled, setPushEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  // 소셜 연결 여부
  const [googleLinked, setGoogleLinked] = useState(false);

  // 일반 에러 배너
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // 구글 연결 배너
  const [googleLinkBanner, setGoogleLinkBanner] = useState<'success' | 'error' | null>(googleLinkResult);
  const [googleLinkErrorMessage, setGoogleLinkErrorMessage] = useState<string | null>(googleLinkError);
  const [isGoogleLinking, setIsGoogleLinking] = useState(false);

  useEffect(() => {
    if (!googleLinkResult) return;
    navigate(location.pathname + location.search + location.hash, { replace: true, state: null });
    // 마운트 시 1회만 실행한다. googleLinkResult는 초기 렌더의 값만 사용한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    let ignore = false;

    Promise.allSettled([
      memberApi.getMyInfo(),
      memberApi.getSettings(),
      memberApi.getSocialAccountStatus(),
    ]).then(([infoRes, settingsRes, socialRes]) => {
      if (ignore) return;
      if ([infoRes, settingsRes, socialRes].some((r) => r.status === 'rejected')) {
        setErrorBanner('일부 정보를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
      }
      if (infoRes.status === 'fulfilled') {
        setProfileName(infoRes.value.name);
        setProfileEmail(infoRes.value.email);
        setAvatarUrl(infoRes.value.profileImageUrl ?? undefined);
      }
      if (settingsRes.status === 'fulfilled') {
        setPushEnabled(settingsRes.value.pushNotification);
        setAutoSyncEnabled(settingsRes.value.autoSave);
      }
      if (socialRes.status === 'fulfilled') {
        setGoogleLinked(socialRes.value.googleLinked);
      }
    });

    return () => { ignore = true; };
  }, []);

  const handleTogglePush = async (next: boolean) => {
    if (isSavingSettings) return;
    const prev = pushEnabled;
    setPushEnabled(next);
    setIsSavingSettings(true);
    try {
      await memberApi.updateSettings({ pushNotification: next });
    } catch {
      setPushEnabled(prev);
      setErrorBanner('푸시 알림 설정 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleToggleAutoSync = async (next: boolean) => {
    if (isSavingSettings) return;
    const prev = autoSyncEnabled;
    setAutoSyncEnabled(next);
    setIsSavingSettings(true);
    try {
      await memberApi.updateSettings({ autoSave: next });
    } catch {
      setAutoSyncEnabled(prev);
      setErrorBanner('자동 동기화 설정 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleProfileSave = useCallback(async ({ name, avatarFile }: { name: string; avatarFile: File | null }) => {
    if (name !== profileName) {
      const result = await memberApi.updateProfile({ name });
      setProfileName(result.name);
    }

    if (avatarFile !== null) {
      const { uploadUrl, objectKey, contentType } = await memberApi.getProfileImageUploadUrl({
        fileName: avatarFile.name,
        contentType: avatarFile.type,
        fileSize: avatarFile.size,
      });
      const s3Res = await memberApi.uploadProfileImageToS3(uploadUrl, avatarFile, contentType);
      if (!s3Res.ok) throw new Error('S3 업로드 실패');
      await memberApi.updateProfileImage({ objectKey });
      const info = await memberApi.getMyInfo();
      const newUrl = info.profileImageUrl ?? undefined;
      signIn(newUrl);
      setAvatarUrl((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
        return newUrl ?? URL.createObjectURL(avatarFile);
      });
    }
  }, [profileName]);

  const handleDeleteAvatar = useCallback(async () => {
    await memberApi.deleteProfileImage();
    signIn(undefined);
    setAvatarUrl((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return undefined;
    });
  }, [signIn]);

  const handleUnlinkGoogle = useCallback(async () => {
    try {
      await memberApi.unlinkGoogle();
      setGoogleLinked(false);
    } catch (error) {
      if (axios.isAxiosError<{ code?: string }>(error)) {
        const code = error.response?.data?.code;
        if (code === 'AUTH409_5') {
          setErrorBanner('Google 계정이 유일한 로그인 수단이므로 연결을 해제할 수 없습니다.');
        } else if (code === 'AUTH404_2') {
          setGoogleLinked(false);
          setErrorBanner('이미 연결 해제된 Google 계정입니다.');
        } else {
          setErrorBanner('Google 계정 연결 해제에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setErrorBanner('Google 계정 연결 해제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }, []);

  const handleConnectGoogle = async () => {
    if (isGoogleLinking) return;
    setGoogleLinkBanner(null);
    setGoogleLinkErrorMessage(null);
    setIsGoogleLinking(true);
    try {
      const { authorizationUrl } = await authApi.getGoogleLinkUrl();
      window.location.href = authorizationUrl;
    } catch (error) {
      setIsGoogleLinking(false);
      if (axios.isAxiosError<{ code?: string }>(error) && error.response?.data?.code === 'AUTH409_3') {
        setGoogleLinked(true);
        setErrorBanner('이미 Google 계정이 연결되어 있습니다.');
      } else {
        setGoogleLinkBanner('error');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-20">
      <Header />

      <main className="mx-auto flex w-full max-w-content flex-col gap-[50px] px-[188px] pt-8">
        <BackHeader title="설정" onBack={() => window.history.back()} />

        {errorBanner && (
          <TopAlertBanner
            variant="red"
            message={errorBanner}
            onClose={() => setErrorBanner(null)}
          />
        )}
        {googleLinkBanner === 'success' && (
          <TopAlertBanner
            variant="teal"
            message="Google 계정이 성공적으로 연결되었어요."
            onClose={() => setGoogleLinkBanner(null)}
          />
        )}
        {googleLinkBanner === 'error' && (
          <TopAlertBanner
            variant="red"
            message={googleLinkErrorMessage ?? 'Google 계정 연결에 실패했습니다. 다시 시도해 주세요.'}
            onClose={() => { setGoogleLinkBanner(null); setGoogleLinkErrorMessage(null); }}
          />
        )}

        <ProfileCard
          name={profileName ? `${profileName} 님` : ''}
          email={profileEmail}
          avatarUrl={avatarUrl}
          onEditProfile={() => setActiveModal("profile")}
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
                right={<ToggleSwitch checked={pushEnabled} onChange={handleTogglePush} disabled={isSavingSettings} />}
              />
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-4 bg-white pb-[30px]">
            <SettingsSectionHeader iconSrc={shieldUserIcon} title="계정 및 보안" />
            <div className="flex w-full flex-col gap-6">
              <SettingActionItem
                iconSrc={keyIcon}
                iconBgClassName="bg-secondary-50"
                title="비밀번호 변경"
                description="안전한 계정 관리를 위해 비밀번호를 변경할 수 있어요."
                onClick={() => setActiveModal("password-change")}
              />
              <SettingActionItem
                iconSrc={refreshIcon}
                iconBgClassName="bg-secondary-50"
                title="자동 동기화 (백업)"
                description="저장한 정보를 자동으로 백업해 안전하게 보관해요."
                right={<ToggleSwitch checked={autoSyncEnabled} onChange={handleToggleAutoSync} disabled={isSavingSettings} />}
              />
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-4 bg-white pb-[30px]">
            <SettingsSectionHeader iconSrc={infoIcon} title="정보 및 지원" />
            <div className="flex w-full flex-col">
              <SettingActionItem
                title="1:1 문의하기"
                right={<img src={chevronRightIcon} alt="" className="h-3.5" />}
                onClick={() => navigate('/contact')}
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
                    <img src={chevronDownIcon} alt="" className="size-icon-xs" />
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

      {activeModal === "profile" && (
        <ProfileEditModal
          name={profileName}
          email={profileEmail}
          avatarUrl={avatarUrl}
          googleLinked={googleLinked}
          onClose={() => setActiveModal(null)}
          onSave={handleProfileSave}
          onDeleteAvatar={handleDeleteAvatar}
          onConnectGoogle={handleConnectGoogle}
          onUnlinkGoogle={handleUnlinkGoogle}
          isGoogleConnecting={isGoogleLinking}
        />
      )}

      {activeModal === "password-change" && (
        <PasswordChangeModal
          onClose={() => setActiveModal(null)}
          onForgotPassword={() => setActiveModal("password-find")}
          onSuccess={onPasswordChangeSuccess}
        />
      )}

      {activeModal === "password-find" && (
        <ForgotPasswordModal
          onClose={() => setActiveModal(null)}
          onSuccess={onPasswordChangeSuccess}
        />
      )}

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
            onCancel={async () => {
              setActiveModal(null);
              try {
                await onDeleteAccount?.();
              } catch {
                setErrorBanner('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
              }
            }}
            onConfirm={() => setActiveModal(null)}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
