import type { GridConfig, GridSize } from '@/types/game'

export const GRID_CONFIGS: Record<GridSize, GridConfig> = {
  '7x4': { cols: 7, rows: 4, wordCount: 3, timeSeconds: 60 },
  '7x5': { cols: 7, rows: 5, wordCount: 4, timeSeconds: 75 },
  '8x6': { cols: 8, rows: 6, wordCount: 5, timeSeconds: 90 },
  '8x7': { cols: 8, rows: 7, wordCount: 6, timeSeconds: 105 },
  '8x8': { cols: 8, rows: 8, wordCount: 7, timeSeconds: 120 },
}

export function getGridConfig(size: GridSize): GridConfig {
  return GRID_CONFIGS[size]
}

export function getDefaultGridSize(): GridSize {
  return '7x4'
}

export const GRID_SIZE_LABELS: Record<GridSize, string> = {
  '7x4': '7×4 (쉬움)',
  '7x5': '7×5 (보통)',
  '8x6': '8×6 (어려움)',
  '8x7': '8×7 (매우 어려움)',
  '8x8': '8×8 (최고 난이도)',
}
