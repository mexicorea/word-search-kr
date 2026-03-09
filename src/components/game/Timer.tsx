'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/game-store'

export function Timer() {
  const { timeLeft, status, tick } = useGameStore()

  useEffect(() => {
    if (status !== 'playing') return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [status, tick])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const isUrgent = timeLeft <= 30 && timeLeft > 0
  const isExpired = timeLeft <= 0

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-500 mb-1 font-medium tracking-wide uppercase">
        남은 시간
      </span>
      <div
        className={`text-3xl font-bold tabular-nums transition-colors ${
          isExpired
            ? 'text-gray-400'
            : isUrgent
              ? 'text-red-500 animate-pulse'
              : 'text-blue-600'
        }`}
      >
        {timeStr}
      </div>
    </div>
  )
}
