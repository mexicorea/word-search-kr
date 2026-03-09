import type { Position, PlacedWord, FoundWord } from '@/types/game'

// 두 Position 배열이 동일한 위치 집합인지 확인합니다
function positionsMatch(a: Position[], b: Position[]): boolean {
  if (a.length !== b.length) return false
  return a.every((pos, i) => pos.row === b[i].row && pos.col === b[i].col)
}

// 선택된 셀들이 배치된 단어와 일치하는지 검증합니다
export function validateSelection(
  selectedCells: Position[],
  placedWords: PlacedWord[],
  foundWords: FoundWord[]
): FoundWord | null {
  if (selectedCells.length < 2) return null

  const foundWordStrings = new Set(foundWords.map((fw) => fw.word))

  for (const placed of placedWords) {
    // 이미 찾은 단어는 제외
    if (foundWordStrings.has(placed.word)) continue

    // 순방향 또는 역방향으로 일치하는지 확인
    if (positionsMatch(selectedCells, placed.cells)) {
      return { word: placed.word, cells: placed.cells }
    }
    if (positionsMatch(selectedCells, [...placed.cells].reverse())) {
      return { word: placed.word, cells: placed.cells }
    }
  }
  return null
}

// 모든 단어를 찾았는지 확인합니다
export function isAllWordsFound(
  placedWords: PlacedWord[],
  foundWords: FoundWord[]
): boolean {
  if (placedWords.length === 0) return false
  return placedWords.length === foundWords.length
}
