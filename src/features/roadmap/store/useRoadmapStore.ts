import { create } from "zustand";
import { countryRoadmapGroups } from "../mocks/mockData";
import type { CityRoadmapData, CountryGroupData } from "../types/roadmap";

interface RemovedRecord {
  city: CityRoadmapData;
  countryName: string;
  index: number;
}

interface RoadmapState {
  countryGroups: CountryGroupData[];
  isCityInRoadmap: (cityName: string) => boolean;
  addCity: (city: CityRoadmapData) => void;
  removeCity: (countryName: string, cityName: string) => RemovedRecord | null;
  restoreCity: (record: RemovedRecord) => void;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  countryGroups: countryRoadmapGroups,

  isCityInRoadmap: (cityName) =>
    get().countryGroups.some((group) =>
      group.cities.some((city) => city.cityName === cityName),
    ),

  addCity: (city) => {
    if (get().isCityInRoadmap(city.cityName)) return;
    const { countryGroups } = get();
    const groupIndex = countryGroups.findIndex(
      (group) => group.countryName === city.countryName,
    );

    if (groupIndex === -1) {
      set({
        countryGroups: [
          ...countryGroups,
          { countryName: city.countryName, cityCount: 1, cities: [city] },
        ],
      });
      return;
    }

    set({
      countryGroups: countryGroups.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              cities: [...group.cities, city],
              cityCount: group.cityCount + 1,
            }
          : group,
      ),
    });
  },

  removeCity: (countryName, cityName) => {
    const group = get().countryGroups.find(
      (g) => g.countryName === countryName,
    );
    const index = group?.cities.findIndex((c) => c.cityName === cityName) ?? -1;
    if (!group || index === -1) return null;

    const city = group.cities[index];
    set({
      countryGroups: get().countryGroups.map((g) =>
        g.countryName === countryName
          ? {
              ...g,
              cities: g.cities.filter((c) => c.cityName !== cityName),
              cityCount: g.cityCount - 1,
            }
          : g,
      ),
    });
    return { city, countryName, index };
  },

  restoreCity: ({ city, countryName, index }) => {
    set({
      countryGroups: get().countryGroups.map((g) =>
        g.countryName === countryName
          ? {
              ...g,
              cities: [
                ...g.cities.slice(0, index),
                city,
                ...g.cities.slice(index),
              ],
              cityCount: g.cityCount + 1,
            }
          : g,
      ),
    });
  },
}));
