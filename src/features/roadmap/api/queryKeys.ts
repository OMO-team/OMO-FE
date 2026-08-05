/**
 * 로그인 상태를 키에 포함시켜, 로그인 성공 시 새로고침 없이 다시 조회되게 한다.
 * getQueryData/setQueryData는 키가 정확히 일치해야 동작하므로 조회와 같은 키(list)를 쓰고,
 * 무효화는 로그인 여부와 무관하게 걸도록 상위 키(all)를 쓴다.
 */
export const roadmapQueryKeys = {
  all: ['roadmaps'] as const,
  list: (isLoggedIn: boolean) => ['roadmaps', 'list', isLoggedIn] as const,
  detail: (roadmapId: number) => ['roadmaps', roadmapId] as const,
};

export const taskQueryKeys = {
  detail: (taskId: number) => ['tasks', taskId] as const,
};

export const cityQueryKeys = {
  list: ['cities'] as const,
};

export const wishlistQueryKeys = {
  all: ['wishlist'] as const,
  list: (isLoggedIn: boolean) => ['wishlist', 'list', isLoggedIn] as const,
};
