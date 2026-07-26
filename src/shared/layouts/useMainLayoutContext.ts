import { useOutletContext } from 'react-router-dom';

export type MainLayoutContext = {
  openChat: () => void;
  closeChat: () => void;
};

export function useMainLayoutContext() {
  return useOutletContext<MainLayoutContext>();
}
