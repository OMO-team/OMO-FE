/**
 * 마지막 글자의 받침 번호를 돌려준다. 0이면 받침 없음.
 * 한글이 아니면(영문 도시명 등) 판단할 수 없어 null.
 */
function getFinalConsonant(word: string): number | null {
  const lastChar = word.trim().at(-1);
  if (!lastChar) return null;

  const code = lastChar.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;

  return code % 28;
}

/** 한글 단어의 마지막 글자 받침 유무에 따라 주격 조사(이/가)를 반환 */
export function getSubjectParticle(word: string): '이' | '가' {
  const final = getFinalConsonant(word);
  if (final == null) return '가';
  return final !== 0 ? '이' : '가';
}

/**
 * 방향 조사(으로/로)를 반환. 받침이 없으면 '로'인데,
 * ㄹ 받침도 "서울로"처럼 '로'를 쓴다.
 */
export function getDirectionParticle(word: string): '으로' | '로' {
  const final = getFinalConsonant(word);
  if (final == null) return '로';
  // 8은 ㄹ 받침
  return final === 0 || final === 8 ? '로' : '으로';
}
