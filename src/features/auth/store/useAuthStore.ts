import { create } from 'zustand';

type ModalType = 'login' | 'signup' | 'forgot' | 'loginRequired' | null;

interface AuthState {
  isLoggedIn: boolean;
  userAvatarUrl?: string;
  modalType: ModalType;
  isSearchOpen: boolean;
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
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
