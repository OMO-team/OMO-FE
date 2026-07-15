import type { CompareCity } from "../types/compare";

export const mockCities: CompareCity[] = [
  {
    id: "berlin",
    name: "베를린",
    countryName: "독일",
    imageUrl: "https://images.unsplash.com/photo-1560930950-5cc20e80e392?w=400",
    rating: 4.0,
    monthlyCost: "180만원",
    costPercent: 60,
    keyMetrics: [
      { id: "internet", label: "인터넷", percentage: 85, barColor: "gradient" },
      { id: "safety", label: "치안", percentage: 75, barColor: "gradient" },
      {
        id: "preference",
        label: "선호도",
        percentage: 70,
        barColor: "gradient",
      },
    ],
  },
  {
    id: "sydney",
    name: "시드니",
    countryName: "호주",
    imageUrl:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400",
    rating: 5.0,
    monthlyCost: "280만원",
    costPercent: 90,
    keyMetrics: [
      { id: "internet", label: "인터넷", percentage: 90, barColor: "gradient" },
      { id: "safety", label: "치안", percentage: 90, barColor: "gradient" },
      {
        id: "preference",
        label: "선호도",
        percentage: 85,
        barColor: "gradient",
      },
    ],
  },
  {
    id: "tokyo",
    name: "도쿄",
    countryName: "일본",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
    rating: 4.6,
    monthlyCost: "220만원",
    costPercent: 75,
    keyMetrics: [
      { id: "internet", label: "인터넷", percentage: 95, barColor: "gradient" },
      { id: "safety", label: "치안", percentage: 95, barColor: "gradient" },
      {
        id: "preference",
        label: "선호도",
        percentage: 80,
        barColor: "gradient",
      },
    ],
  },
];
