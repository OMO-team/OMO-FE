export const roadmapQueryKeys = {
  list: ['roadmaps'] as const,
  detail: (roadmapId: number) => ['roadmaps', roadmapId] as const,
};

export const taskQueryKeys = {
  detail: (taskId: number) => ['tasks', taskId] as const,
};

export const cityQueryKeys = {
  list: ['cities'] as const,
};

export const wishlistQueryKeys = {
  list: ['wishlist'] as const,
};
