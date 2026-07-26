/** 한글 단어의 마지막 글자 받침 유무에 따라 주격 조사(이/가)를 반환 */
export function getSubjectParticle(word: string): '이' | '가' {
  const lastChar = word.trim().at(-1);
  if (!lastChar) return '가';

  const code = lastChar.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return '가';

  const hasBatchim = code % 28 !== 0;
  return hasBatchim ? '이' : '가';
}
