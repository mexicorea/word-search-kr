'use client'

import { useGameStore } from '@/store/game-store'
import { GRID_SIZE_LABELS } from '@/lib/game/scaler'
import type { GridSize } from '@/types/game'

const GRID_SIZES: GridSize[] = ['7x4', '7x5', '8x6', '8x7', '8x8']

export function OptionsPanel() {
  const { gridSize, setGridSize, initGame, status } = useGameStore()

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        그리드 크기
      </h2>
      <div className="flex flex-col gap-1.5">
        {GRID_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => setGridSize(size)}
            className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
              gridSize === size
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {GRID_SIZE_LABELS[size]}
          </button>
        ))}
      </div>
      <button
        onClick={() => initGame(gridSize)}
        className="mt-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors"
      >
        {status === 'idle' ? '게임 시작' : '새 게임'}
      </button>
    </div>
  )
}
