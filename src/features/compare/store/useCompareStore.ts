import { create } from "zustand";

const MAX_COMPARE_COUNT = 3;
const MIN_COMPARE_COUNT = 2;

interface CompareState {
  compareList: string[];
  isModalOpen: boolean;
  showMaxWarning: boolean;
  toggleCompare: (cityId: string) => void;
  removeFromCompare: (cityId: string) => void;
  clearCompare: () => void;
  openModal: () => void;
  closeModal: () => void;
  hideMaxWarning: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  compareList: [],
  isModalOpen: false,
  showMaxWarning: false,

  toggleCompare: (cityId) => {
    const { compareList } = get();
    if (compareList.includes(cityId)) {
      set({ compareList: compareList.filter((id) => id !== cityId) });
      return;
    }
    if (compareList.length >= MAX_COMPARE_COUNT) {
      set({ showMaxWarning: true }); // 최대 3개 초과 시 추가 무시하고 경고만 표시
      return;
    }
    set({ compareList: [...compareList, cityId] });
  },

  hideMaxWarning: () => set({ showMaxWarning: false }),

  removeFromCompare: (cityId) => {
    const next = get().compareList.filter((id) => id !== cityId);
    // 모두 삭제되면 모달도 자동으로 닫힘
    set({
      compareList: next,
      isModalOpen: next.length === 0 ? false : get().isModalOpen,
    });
  },

  clearCompare: () => set({ compareList: [], isModalOpen: false }),

  openModal: () => {
    if (get().compareList.length >= MIN_COMPARE_COUNT)
      set({ isModalOpen: true });
  },

  closeModal: () => set({ isModalOpen: false }),
}));

// 파생 상태는 셀렉터 훅으로 분리해서 필요한 컴포넌트만 리렌더링되게 함
export const useIsMaxReached = () =>
  useCompareStore((s) => s.compareList.length >= MAX_COMPARE_COUNT);

export const useCanOpenModal = () =>
  useCompareStore((s) => s.compareList.length >= MIN_COMPARE_COUNT);
