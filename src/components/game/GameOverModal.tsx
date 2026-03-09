'use client'

import { useGameStore } from '@/store/game-store'

export function GameOverModal() {
  const { status, foundWords, placedWords, initGame, gridSize } = useGameStore()

  if (status !== 'won' && status !== 'lost') return null

  const isWon = status === 'won'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">{isWon ? '🎉' : '⏰'}</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {isWon ? '축하합니다!' : '시간 초과'}
        </h2>
        <p className="text-gray-500 mb-6">
          {isWon
            ? '모든 단어를 찾았습니다!'
            : `${foundWords.length} / ${placedWords.length}개를 찾았습니다.`}
        </p>

        {!isWon && placedWords.length > 0 && (
          <div className="mb-6 text-left bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">정답</p>
            <ul className="flex flex-col gap-1">
              {placedWords.map((pw) => {
                const wasFound = foundWords.some((fw) => fw.word === pw.word)
                return (
                  <li
                    key={pw.word}
                    className={`text-sm flex items-center gap-2 ${
                      wasFound ? 'text-emerald-600' : 'text-gray-600'
                    }`}
                  >
                    <span>{wasFound ? '✓' : '✗'}</span>
                    <span>{pw.word}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={() => initGame(gridSize)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            같은 크기로 다시
          </button>
          <button
            onClick={() => initGame('7x4')}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            기본 크기로 시작
          </button>
        </div>
      </div>
    </div>
  )
}
