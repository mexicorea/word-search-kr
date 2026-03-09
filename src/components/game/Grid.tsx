'use client'

import { useCallback } from 'react'
import { useGameStore } from '@/store/game-store'
import { Cell, FOUND_COLORS } from './Cell'
import type { Position } from '@/types/game'

export function Grid() {
  const { grid, selectedCells, foundWords, status, startDrag, continueDrag, endDrag } =
    useGameStore()

  const selectedSet = new Set(selectedCells.map((p) => `${p.row},${p.col}`))

  // foundWords 각 단어별 색상 인덱스를 매핑
  const foundCellColorMap = new Map<string, string>()
  foundWords.forEach((fw, idx) => {
    const color = FOUND_COLORS[idx % FOUND_COLORS.length]
    fw.cells.forEach((pos) => {
      foundCellColorMap.set(`${pos.row},${pos.col}`, color)
    })
  })

  const handlePointerDown = useCallback(
    (pos: Position) => {
      if (status !== 'playing') return
      startDrag(pos)
    },
    [status, startDrag]
  )

  const handlePointerEnter = useCallback(
    (pos: Position) => {
      if (status !== 'playing') return
      continueDrag(pos)
    },
    [status, continueDrag]
  )

  const handlePointerUp = useCallback(() => {
    if (status !== 'playing') return
    endDrag()
  }, [status, endDrag])

  if (!grid || grid.length === 0) return null

  const cols = grid[0].length

  return (
    <div
      className="touch-none select-none w-full"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {grid.map((row) =>
          row.map((cell) => {
            const key = `${cell.row},${cell.col}`
            const isSelected = selectedSet.has(key)
            const foundColor = foundCellColorMap.get(key)
            const isFound = !!foundColor
            return (
              <Cell
                key={key}
                syllable={cell.syllable}
                row={cell.row}
                col={cell.col}
                isSelected={isSelected}
                isFound={isFound}
                foundColor={foundColor}
                onPointerDown={handlePointerDown}
                onPointerEnter={handlePointerEnter}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
