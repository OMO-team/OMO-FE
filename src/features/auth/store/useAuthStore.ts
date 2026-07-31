import { create } from 'zustand';

type ModalType = 'login' | 'signup' | 'forgot' | 'loginRequired' | null;

export type SignupDraft = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  isEmailVerified: boolean;
};

interface AuthState {
  isLoggedIn: boolean;
  userAvatarUrl?: string;
  modalType: ModalType;
  isSearchOpen: boolean;
  signupDraft: SignupDraft | null;
  signIn: (userAvatarUrl?: string) => void;
  signOut: () => void;
  openModal: (type: NonNullable<ModalType>) => void;
  closeModal: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSignupDraft: (draft: SignupDraft) => void;
  markSignupEmailVerified: () => void;
  clearSignupDraft: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userAvatarUrl: undefined,
  modalType: null,
  isSearchOpen: false,
  signupDraft: null,
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
}));
