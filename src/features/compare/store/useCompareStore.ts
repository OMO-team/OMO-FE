import { create } from "zustand";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { compareItemsApi } from "../api/compareItemsApi";

const MAX_COMPARE_COUNT = 3;
const MIN_COMPARE_COUNT = 2;

interface CompareState {
  compareList: number[];
  isModalOpen: boolean;
  showMaxWarning: boolean;
  toggleCompare: (cityId: number) => Promise<void>;
  removeFromCompare: (cityId: number) => Promise<void>;
  setCompareList: (cityIds: number[]) => void;
  clearCompare: () => void;
  openModal: () => void;
  closeModal: () => void;
  hideMaxWarning: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  compareList: [],
  isModalOpen: false,
  showMaxWarning: false,

  toggleCompare: async (cityId) => {
    const { compareList } = get();
    if (compareList.includes(cityId)) {
      await get().removeFromCompare(cityId);
      return;
    }
    if (compareList.length >= MAX_COMPARE_COUNT) {
      set({ showMaxWarning: true }); // 최대 3개 초과 시 추가 무시하고 경고만 표시
      return;
    }
    if (useAuthStore.getState().isLoggedIn) {
      try {
        await compareItemsApi.add(cityId);
      } catch {
        return; // 담기 실패 시 로컬 상태는 바꾸지 않음
      }
    }
    set({ compareList: [...get().compareList, cityId] });
  },

  hideMaxWarning: () => set({ showMaxWarning: false }),

  removeFromCompare: async (cityId) => {
    if (useAuthStore.getState().isLoggedIn) {
      try {
        await compareItemsApi.remove(cityId);
      } catch {
        return; // 삭제 실패 시 로컬 상태는 바꾸지 않음
      }
    }
    const next = get().compareList.filter((id) => id !== cityId);
    // 모두 삭제되면 모달도 자동으로 닫힘 (F-414)
    set({
      compareList: next,
      isModalOpen: next.length === 0 ? false : get().isModalOpen,
    });
  },

  setCompareList: (cityIds) => set({ compareList: cityIds }),

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
