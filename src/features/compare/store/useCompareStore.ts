import { create } from "zustand";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { compareItemsApi } from "../api/compareItemsApi";

const MAX_COMPARE_COUNT = 3;
const MIN_COMPARE_COUNT = 2;

interface CompareState {
  compareList: number[];
  // cityId -> cityName 캐시. 페이지마다 보여주는 도시 목록이 달라서, 칩 라벨을
  // 현재 페이지의 목록에서 찾으면 다른 페이지/탭으로 이동 시 못 찾아 사라짐 (칩 누락 버그)
  cityNames: Record<number, string>;
  isModalOpen: boolean;
  showMaxWarning: boolean;
  toggleCompare: (cityId: number, cityName: string) => Promise<void>;
  removeFromCompare: (cityId: number) => Promise<void>;
  setCompareList: (cityIds: number[]) => void;
  registerCityNames: (cities: { cityId: number; cityName: string }[]) => void;
  resetCompare: () => Promise<void>;
  openModal: () => void;
  closeModal: () => void;
  hideMaxWarning: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  compareList: [],
  cityNames: {},
  isModalOpen: false,
  showMaxWarning: false,

  toggleCompare: async (cityId, cityName) => {
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
    set((state) => ({
      compareList: [...state.compareList, cityId],
      cityNames: { ...state.cityNames, [cityId]: cityName },
    }));
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

  registerCityNames: (cities) =>
    set((state) => {
      const next = { ...state.cityNames };
      let changed = false;
      for (const { cityId, cityName } of cities) {
        if (next[cityId] !== cityName) {
          next[cityId] = cityName;
          changed = true;
        }
      }
      return changed ? { cityNames: next } : state;
    }),

  // 비교 모달을 X 버튼으로 닫을 때 비교 상태 자체를 초기화한다
  resetCompare: async () => {
    const { compareList } = get();
    if (useAuthStore.getState().isLoggedIn) {
      await Promise.allSettled(
        compareList.map((cityId) => compareItemsApi.remove(cityId)),
      );
    }
    set({ compareList: [], cityNames: {}, isModalOpen: false });
  },

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
