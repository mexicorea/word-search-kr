'use client'

import type { Position, FoundWord } from '@/types/game'

interface CellProps {
  syllable: string
  row: number
  col: number
  isSelected: boolean
  isFound: boolean
  foundColor?: string
  onPointerDown: (pos: Position) => void
  onPointerEnter: (pos: Position) => void
}

// 단어별 고정 색상 팔레트
const FOUND_COLORS = [
  'bg-rose-400 text-white',
  'bg-violet-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-sky-500 text-white',
  'bg-pink-500 text-white',
  'bg-teal-500 text-white',
]

export function Cell({
  syllable,
  row,
  col,
  isSelected,
  isFound,
  foundColor,
  onPointerDown,
  onPointerEnter,
}: CellProps) {
  const pos: Position = { row, col }

  let cellClass =
    'flex items-center justify-center rounded-lg font-bold select-none cursor-pointer transition-all duration-100 aspect-square text-base md:text-lg '

  if (isFound && foundColor) {
    cellClass += foundColor
  } else if (isSelected) {
    cellClass += 'bg-yellow-300 text-gray-900 scale-105 shadow-md'
  } else {
    cellClass += 'bg-white text-gray-800 hover:bg-blue-50 border border-gray-200'
  }

  return (
    <div
      className={cellClass}
      onPointerDown={(e) => {
        e.preventDefault()
        onPointerDown(pos)
      }}
      onPointerEnter={(e) => {
        if (e.buttons > 0) onPointerEnter(pos)
      }}
    >
      {syllable}
    </div>
  )
}

export { FOUND_COLORS }
