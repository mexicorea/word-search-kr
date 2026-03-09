'use client'

import type { Position } from '@/types/game'

interface CellProps {
  syllable: string
  row: number
  col: number
  isSelected: boolean
  isFound: boolean
  foundColor?: string
  justFoundIndex?: number
  unfoundColor?: string
  unfoundDelay?: number
  onPointerDown: (pos: Position) => void
}

// 단어별 고정 색상 팔레트 (파스텔톤)
const FOUND_COLORS = [
  'bg-rose-200 text-rose-800',
  'bg-violet-200 text-violet-800',
  'bg-emerald-200 text-emerald-800',
  'bg-amber-200 text-amber-800',
  'bg-sky-200 text-sky-800',
  'bg-pink-200 text-pink-800',
  'bg-teal-200 text-teal-800',
]

export function Cell({
  syllable,
  row,
  col,
  isSelected,
  isFound,
  foundColor,
  justFoundIndex,
  unfoundColor,
  unfoundDelay,
  onPointerDown,
}: CellProps) {
  const pos: Position = { row, col }

  let cellClass =
    'flex items-center justify-center rounded-lg font-bold select-none cursor-pointer transition-all duration-100 aspect-square text-xl md:text-2xl lg:text-3xl '

  if (isFound && foundColor) {
    cellClass += foundColor
  } else if (unfoundColor) {
    cellClass += unfoundColor + ' animate-unfound-reveal'
  } else if (isSelected) {
    cellClass += 'bg-yellow-300 text-gray-900 scale-105 shadow-md'
  } else {
    cellClass += 'bg-white text-gray-800 hover:bg-blue-50 border border-gray-200'
  }

  if (justFoundIndex !== undefined) {
    cellClass += ' animate-cell-celebrate'
  }

  const style =
    justFoundIndex !== undefined
      ? { animationDelay: `${justFoundIndex * 60}ms` }
      : unfoundDelay !== undefined
        ? { animationDelay: `${unfoundDelay}ms` }
        : undefined

  return (
    <div
      className={cellClass}
      style={style}
      data-row={row}
      data-col={col}
      onPointerDown={(e) => {
        e.preventDefault()
        onPointerDown(pos)
      }}
    >
      {syllable}
    </div>
  )
}

export { FOUND_COLORS }
