import type { Grid, GridConfig, PlacedWord, Position, Direction, Cell } from '@/types/game'
import { DIRECTION_VECTORS, ALL_DIRECTIONS } from './direction'
import { randomCommonSyllable } from '@/lib/words/syllable-utils'

// 단어를 그리드에 배치할 수 있는지 검사합니다
export function canPlaceWord(
  grid: (string | null)[][],
  word: string,
  start: Position,
  direction: Direction,
  rows: number,
  cols: number
): boolean {
  const syllables = [...word]
  const vec = DIRECTION_VECTORS[direction]

  for (let i = 0; i < syllables.length; i++) {
    const row = start.row + vec.dr * i
    const col = start.col + vec.dc * i

    // 경계 체크
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false

    // 충돌 체크 (같은 음절이면 교차 허용)
    const existing = grid[row][col]
    if (existing !== null && existing !== syllables[i]) return false
  }
  return true
}

// 단어를 그리드에 배치합니다
export function placeWord(
  grid: (string | null)[][],
  word: string,
  start: Position,
  direction: Direction
): Position[] {
  const syllables = [...word]
  const vec = DIRECTION_VECTORS[direction]
  const cells: Position[] = []

  for (let i = 0; i < syllables.length; i++) {
    const row = start.row + vec.dr * i
    const col = start.col + vec.dc * i
    grid[row][col] = syllables[i]
    cells.push({ row, col })
  }
  return cells
}

// 단어를 랜덤한 위치와 방향에 배치 시도합니다 (최대 maxAttempts회)
function tryPlaceWord(
  grid: (string | null)[][],
  word: string,
  rows: number,
  cols: number,
  maxAttempts = 100
): PlacedWord | null {
  const directions = [...ALL_DIRECTIONS].sort(() => Math.random() - 0.5)

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const direction = directions[attempt % directions.length]
    const vec = DIRECTION_VECTORS[direction]
    const syllableCount = [...word].length

    // 배치 가능한 시작 위치 계산
    const rowRange = rows - Math.abs(vec.dr) * (syllableCount - 1)
    const colRange = cols - Math.abs(vec.dc) * (syllableCount - 1)

    if (rowRange <= 0 || colRange <= 0) continue

    const startRow = (vec.dr < 0 ? Math.abs(vec.dr) * (syllableCount - 1) : 0) + Math.floor(Math.random() * rowRange)
    const startCol = (vec.dc < 0 ? Math.abs(vec.dc) * (syllableCount - 1) : 0) + Math.floor(Math.random() * colRange)
    const start: Position = { row: startRow, col: startCol }

    if (canPlaceWord(grid, word, start, direction, rows, cols)) {
      const cells = placeWord(grid, word, start, direction)
      return { word, start, direction, cells }
    }
  }
  return null
}

// 빈 셀을 자주 쓰이는 한글 음절로 채웁니다
function fillEmptyCells(grid: (string | null)[][], rows: number, cols: number): void {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = randomCommonSyllable()
      }
    }
  }
}

export interface GenerateGridResult {
  grid: Grid
  placedWords: PlacedWord[]
}

// 단어 목록을 받아 그리드를 생성합니다 (최대 3회 재시도)
export function generateGrid(
  words: string[],
  config: GridConfig,
  maxRetries = 3
): GenerateGridResult {
  const { rows, cols } = config

  for (let retry = 0; retry < maxRetries; retry++) {
    const rawGrid: (string | null)[][] = Array.from({ length: rows }, () =>
      Array(cols).fill(null)
    )

    // 긴 단어부터 배치
    const sortedWords = [...words].sort((a, b) => [...b].length - [...a].length)
    const placedWords: PlacedWord[] = []
    let allPlaced = true

    for (const word of sortedWords) {
      const placed = tryPlaceWord(rawGrid, word, rows, cols)
      if (!placed) {
        allPlaced = false
        break
      }
      placedWords.push(placed)
    }

    if (!allPlaced) continue

    fillEmptyCells(rawGrid, rows, cols)

    const grid: Grid = rawGrid.map((row, r) =>
      row.map((syllable, c): Cell => ({
        syllable: syllable!,
        row: r,
        col: c,
      }))
    )

    return { grid, placedWords }
  }

  // 마지막 시도 실패 시 빈 그리드라도 반환
  const rawGrid: (string | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  )
  fillEmptyCells(rawGrid, rows, cols)
  const grid: Grid = rawGrid.map((row, r) =>
    row.map((syllable, c): Cell => ({
      syllable: syllable!,
      row: r,
      col: c,
    }))
  )
  return { grid, placedWords: [] }
}
