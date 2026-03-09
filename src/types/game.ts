export type Direction =
  | 'right'
  | 'left'
  | 'down'
  | 'up'
  | 'down-right'
  | 'down-left'
  | 'up-right'
  | 'up-left'

export interface DirectionVector {
  dr: number
  dc: number
}

export interface Position {
  row: number
  col: number
}

export interface PlacedWord {
  word: string
  start: Position
  direction: Direction
  cells: Position[]
}

export interface Cell {
  syllable: string
  row: number
  col: number
}

export type Grid = Cell[][]

export interface GridConfig {
  cols: number
  rows: number
  wordCount: number
  timeSeconds: number
}

export type GridSize = '7x4' | '7x5' | '8x6' | '8x7' | '8x8'

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export interface FoundWord {
  word: string
  cells: Position[]
}

export interface GameState {
  grid: Grid
  placedWords: PlacedWord[]
  foundWords: FoundWord[]
  selectedCells: Position[]
  dragStart: Position | null
  dragDirection: Direction | null
  timeLeft: number
  status: GameStatus
  gridSize: GridSize
  hintLevel: 0 | 1 | 2
  justFoundCells: string[]
  showUnfound: boolean
}
