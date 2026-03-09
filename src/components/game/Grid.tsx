'use client'

import { useCallback, useRef } from 'react'
import { useGameStore } from '@/store/game-store'
import { Cell, FOUND_COLORS } from './Cell'
import type { Position } from '@/types/game'

export function Grid() {
  const {
    grid,
    selectedCells,
    foundWords,
    placedWords,
    status,
    justFoundCells,
    showUnfound,
    startDrag,
    continueDrag,
    endDrag,
  } = useGameStore()

  // 마지막으로 진입한 셀을 추적해 불필요한 continueDrag 호출 방지
  const lastCell = useRef<string | null>(null)

  const selectedSet = new Set(selectedCells.map((p) => `${p.row},${p.col}`))

  const foundCellColorMap = new Map<string, string>()
  foundWords.forEach((fw, idx) => {
    const color = FOUND_COLORS[idx % FOUND_COLORS.length]
    fw.cells.forEach((pos) => {
      foundCellColorMap.set(`${pos.row},${pos.col}`, color)
    })
  })

  const justFoundMap = new Map<string, number>()
  justFoundCells.forEach((key, idx) => {
    justFoundMap.set(key, idx)
  })

  // key → { color, delay } (단어 단위로 같은 delay → 단어 전체가 동시에 노출)
  const unfoundCellMap = new Map<string, { color: string; delay: number }>()
  if (showUnfound && status === 'lost') {
    const unfoundWords = placedWords.filter(
      (pw) => !foundWords.some((fw) => fw.word === pw.word)
    )
    unfoundWords.forEach((pw, idx) => {
      const color = FOUND_COLORS[(foundWords.length + idx) % FOUND_COLORS.length]
      const delay = idx * 500
      pw.cells.forEach((pos) => {
        unfoundCellMap.set(`${pos.row},${pos.col}`, { color, delay })
      })
    })
  }

  const handlePointerDown = useCallback(
    (pos: Position) => {
      if (status !== 'playing') return
      lastCell.current = `${pos.row},${pos.col}`
      startDrag(pos)
    },
    [status, startDrag]
  )

  // 모바일/데스크톱 통합: pointermove 시 elementFromPoint로 현재 셀 탐지
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (status !== 'playing' || e.buttons === 0) return

      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el) return

      // data-row, data-col 속성을 가진 셀 요소(또는 그 부모)를 찾음
      const cellEl = (el as HTMLElement).closest('[data-row]') as HTMLElement | null
      if (!cellEl) return

      const row = Number(cellEl.dataset.row)
      const col = Number(cellEl.dataset.col)
      const key = `${row},${col}`

      if (key === lastCell.current) return
      lastCell.current = key
      continueDrag({ row, col })
    },
    [status, continueDrag]
  )

  const handlePointerUp = useCallback(() => {
    if (status !== 'playing') return
    lastCell.current = null
    endDrag()
  }, [status, endDrag])

  if (!grid || grid.length === 0) return null

  const cols = grid[0].length

  return (
    <div
      className="touch-none select-none w-full"
      onPointerMove={handlePointerMove}
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
            const justFoundIndex = justFoundMap.get(key)
            const unfoundEntry = unfoundCellMap.get(key)
            return (
              <Cell
                key={key}
                syllable={cell.syllable}
                row={cell.row}
                col={cell.col}
                isSelected={isSelected}
                isFound={isFound}
                foundColor={foundColor}
                justFoundIndex={justFoundIndex}
                unfoundColor={unfoundEntry?.color}
                unfoundDelay={unfoundEntry?.delay}
                onPointerDown={handlePointerDown}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
