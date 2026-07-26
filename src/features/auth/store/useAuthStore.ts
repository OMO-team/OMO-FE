import { create } from 'zustand';

type ModalType = 'login' | 'signup' | 'forgot' | 'loginRequired' | null;

interface AuthState {
  isLoggedIn: boolean;
  userAvatarUrl?: string;
  modalType: ModalType;
  isSearchOpen: boolean;
  signIn: (userAvatarUrl?: string) => void;
  signOut: () => void;
  openModal: (type: NonNullable<ModalType>) => void;
  closeModal: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userAvatarUrl: undefined,
  modalType: null,
  isSearchOpen: false,
  signIn: (userAvatarUrl) => set({ isLoggedIn: true, userAvatarUrl }),
  signOut: () => set({ isLoggedIn: false, userAvatarUrl: undefined }),
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
