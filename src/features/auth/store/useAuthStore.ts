import { create } from 'zustand';

type ModalType = 'login' | 'signup' | 'forgot' | 'loginRequired' | null;
type AuthToastType = 'login' | 'signup' | null;

export type SignupDraft = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  isEmailVerified: boolean;
};

export type ResetPasswordDraft = {
  email: string;
  newPassword: string;
  confirmPassword: string;
  isEmailVerified: boolean;
};

interface AuthState {
  isLoggedIn: boolean;
  userAvatarUrl?: string;
  modalType: ModalType;
  isSearchOpen: boolean;
  signupDraft: SignupDraft | null;
  resetPasswordDraft: ResetPasswordDraft | null;
  authToast: AuthToastType;
  signIn: (userAvatarUrl?: string) => void;
  signOut: () => void;
  openModal: (type: NonNullable<ModalType>) => void;
  closeModal: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSignupDraft: (draft: SignupDraft) => void;
  markSignupEmailVerified: () => void;
  clearSignupDraft: () => void;
  setResetPasswordDraft: (draft: ResetPasswordDraft) => void;
  markResetPasswordEmailVerified: () => void;
  clearResetPasswordDraft: () => void;
  showAuthToast: (type: NonNullable<AuthToastType>) => void;
  clearAuthToast: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userAvatarUrl: undefined,
  modalType: null,
  isSearchOpen: false,
  signupDraft: null,
  resetPasswordDraft: null,
  authToast: null,
  signIn: (userAvatarUrl) => set({ isLoggedIn: true, userAvatarUrl }),
  signOut: () => set({ isLoggedIn: false, userAvatarUrl: undefined }),
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  setSignupDraft: (draft) => set({ signupDraft: draft }),
  markSignupEmailVerified: () =>
    set((state) => ({
      signupDraft: state.signupDraft ? { ...state.signupDraft, isEmailVerified: true } : state.signupDraft,
    })),
  clearSignupDraft: () => set({ signupDraft: null }),
  setResetPasswordDraft: (draft) => set({ resetPasswordDraft: draft }),
  markResetPasswordEmailVerified: () =>
    set((state) => ({
      resetPasswordDraft: state.resetPasswordDraft
        ? { ...state.resetPasswordDraft, isEmailVerified: true }
        : state.resetPasswordDraft,
    })),
  clearResetPasswordDraft: () => set({ resetPasswordDraft: null }),
  showAuthToast: (type) => set({ authToast: type }),
  clearAuthToast: () => set({ authToast: null }),
}));
