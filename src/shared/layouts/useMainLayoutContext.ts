import { useOutletContext } from 'react-router-dom';

export type MainLayoutContext = {
  openChat: (initialMessage?: string) => void;
  closeChat: () => void;
  isChatOpen: boolean;
};

export function useMainLayoutContext() {
  return useOutletContext<MainLayoutContext>();
}
