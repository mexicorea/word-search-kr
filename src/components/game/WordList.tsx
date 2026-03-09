'use client'

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/game-store'
import { FOUND_COLORS } from './Cell'

function maskWord(word: string, hintLevel: 0 | 1 | 2): string {
  const syllables = [...word]
  if (hintLevel === 0) return syllables.map(() => '*').join('')
  if (hintLevel === 2) return word
  // hintLevel === 1: 첫·끝 음절만 마스킹, 중간 공개
  return syllables.map((ch, i) => (i === 0 || i === syllables.length - 1) ? '*' : ch).join('')
}

export function WordList() {
  const { placedWords, foundWords, hintLevel } = useGameStore()
  const foundSet = new Set(foundWords.map((fw) => fw.word))

  const prevHintLevel = useRef(hintLevel)
  const [blinkClass, setBlinkClass] = useState('')

  useEffect(() => {
    if (hintLevel !== prevHintLevel.current && hintLevel > 0) {
      prevHintLevel.current = hintLevel
      setBlinkClass(hintLevel === 1 ? 'animate-hint-amber' : 'animate-hint-red')
    }
  }, [hintLevel])

  const hintLabel =
    hintLevel === 1 ? '중간 글자 공개' :
    hintLevel === 2 ? '전체 공개' : null

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border-2 p-3 transition-colors ${blinkClass}`}
      onAnimationEnd={() => setBlinkClass('')}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          숨겨진 단어
        </h2>
        {hintLabel && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
            hintLevel === 2 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {hintLabel}
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-1.5">
        {placedWords.map((pw, idx) => {
          const isFound = foundSet.has(pw.word)
          const color = FOUND_COLORS[idx % FOUND_COLORS.length]
          const display = isFound ? pw.word : maskWord(pw.word, hintLevel)

          return (
            <li
              key={pw.word}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isFound
                  ? `${color} line-through opacity-70`
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isFound ? 'bg-white/30 text-inherit' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx + 1}
              </span>
              <span className="flex-1 tracking-widest font-mono">{display}</span>
              {isFound && <span>✓</span>}
            </li>
          )
        })}
      </ul>

      <div className="text-xs text-gray-400 mt-1">
        {foundWords.length} / {placedWords.length} 완료
      </div>
    </div>
  )
}
