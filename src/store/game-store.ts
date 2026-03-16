import { create } from 'zustand'
import type { GameState, GridSize, Position, Direction, FoundWord } from '@/types/game'
import { getGridConfig } from '@/lib/game/scaler'
import { generateGrid } from '@/lib/game/grid-generator'
import { getMixedRandomWords } from '@/lib/words/dictionary'
import { validateSelection, isAllWordsFound } from '@/lib/game/validator'
import { getDirection, getDirectionFromAngle } from '@/lib/game/direction'
import { DIRECTION_VECTORS } from '@/lib/game/direction'

interface GameActions {
  initGame: (size?: GridSize) => void
  startDrag: (pos: Position) => void
  continueDrag: (pos: Position, pixelDelta?: { dx: number; dy: number }) => void
  endDrag: () => void
  tick: () => void
  setGridSize: (size: GridSize) => void
  toggleUnfound: () => void
}

type GameStore = GameState & GameActions

const DEFAULT_SIZE: GridSize = '7x4'

function buildInitialState(size: GridSize): Omit<GameState, 'grid' | 'placedWords'> {
  const config = getGridConfig(size)
  return {
    foundWords: [],
    selectedCells: [],
    dragStart: null,
    dragDirection: null,
    timeLeft: config.timeSeconds,
    status: 'idle',
    gridSize: size,
    hintLevel: 0,
    justFoundCells: [],
    showUnfound: false,
  }
}

// 방향이 고정된 상태에서 드래그 경로 계산
function computeDragCells(
  start: Position,
  current: Position,
  direction: Direction
): Position[] {
  const vec = DIRECTION_VECTORS[direction]
  const cells: Position[] = [start]

  let row = start.row + vec.dr
  let col = start.col + vec.dc

  while (true) {
    cells.push({ row, col })
    if (row === current.row && col === current.col) break
    // 현재 위치를 지나쳤는지 확인 (무한 루프 방지)
    const nextRow = row + vec.dr
    const nextCol = col + vec.dc
    const distCurr = Math.abs(current.row - row) + Math.abs(current.col - col)
    const distNext = Math.abs(current.row - nextRow) + Math.abs(current.col - nextCol)
    if (distNext >= distCurr) break
    row = nextRow
    col = nextCol
  }
  return cells
}

export const useGameStore = create<GameStore>((set, get) => ({
  grid: [],
  placedWords: [],
  ...buildInitialState(DEFAULT_SIZE),

  initGame: (size = DEFAULT_SIZE) => {
    const config = getGridConfig(size)
    const words = getMixedRandomWords(config.wordCount)
    const { grid, placedWords } = generateGrid(words, config)
    set({
      grid,
      placedWords,
      ...buildInitialState(size),
      gridSize: size,
      status: 'playing',
    })
  },

  setGridSize: (size) => {
    set({ gridSize: size })
  },

  startDrag: (pos) => {
    set({
      dragStart: pos,
      dragDirection: null,
      selectedCells: [pos],
    })
  },

  continueDrag: (pos, pixelDelta) => {
    const { dragStart, dragDirection } = get()
    if (!dragStart) return

    let direction = dragDirection
    if (!direction) {
      // 픽셀 델타가 있으면 각도 기반, 없으면 기존 셀 좌표 기반 (fallback)
      const newDir = pixelDelta
        ? getDirectionFromAngle(pixelDelta.dx, pixelDelta.dy)
        : getDirection(dragStart.row, dragStart.col, pos.row, pos.col)
      if (!newDir) return // 최소 거리 미달 → 아직 방향 미결정
      direction = newDir
    }

    const cells = computeDragCells(dragStart, pos, direction)
    set({ dragDirection: direction, selectedCells: cells })
  },

  endDrag: () => {
    const { selectedCells, placedWords, foundWords } = get()
    const found = validateSelection(selectedCells, placedWords, foundWords)

    if (found) {
      const newFoundWords: FoundWord[] = [...foundWords, found]
      const allFound = isAllWordsFound(placedWords, newFoundWords)
      const justFoundCells = found.cells.map((p) => `${p.row},${p.col}`)
      set({
        foundWords: newFoundWords,
        selectedCells: [],
        dragStart: null,
        dragDirection: null,
        status: allFound ? 'won' : 'playing',
        justFoundCells,
      })
      setTimeout(() => set({ justFoundCells: [] }), 600)
    } else {
      set({
        selectedCells: [],
        dragStart: null,
        dragDirection: null,
      })
    }
  },

  toggleUnfound: () => {
    set((state) => ({ showUnfound: !state.showUnfound }))
  },

  tick: () => {
    const { timeLeft, status } = get()
    if (status !== 'playing') return

    const newTime = timeLeft - 1
    const hintLevel: 0 | 1 | 2 = newTime <= 10 ? 2 : newTime <= 30 ? 1 : 0

    if (newTime <= 0) {
      set({ timeLeft: 0, status: 'lost', hintLevel: 2 })
    } else {
      set({ timeLeft: newTime, hintLevel })
    }
  },
}))
