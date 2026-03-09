import wordsData from '@/data/words.json'

type WordsData = {
  '3음절': string[]
  '4음절': string[]
}

const data = wordsData as WordsData

// 음절 수별 단어 목록 반환
export function getWordsByLength(syllableCount: 3 | 4): string[] {
  const key = `${syllableCount}음절` as keyof WordsData
  return data[key] ?? []
}

// 특정 음절 수의 단어 중 n개 랜덤 선택
export function getRandomWords(syllableCount: 3 | 4, count: number): string[] {
  const words = getWordsByLength(syllableCount)
  const shuffled = [...words].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 3음절과 4음절 섞어서 n개 반환
export function getMixedRandomWords(count: number): string[] {
  const threeChar = getWordsByLength(3)
  const fourChar = getWordsByLength(4)
  const all = [...threeChar, ...fourChar]
  const shuffled = all.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 단어의 실제 음절 수 반환 (한글 기준)
export function getSyllableCount(word: string): number {
  return [...word].length
}
