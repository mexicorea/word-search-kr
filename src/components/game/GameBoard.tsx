'use client'

import { useGameStore } from '@/store/game-store'
import { Grid } from './Grid'
import { Timer } from './Timer'
import { WordList } from './WordList'
import { GameOverModal } from './GameOverModal'
import { OptionsPanel } from '@/components/ui/OptionsPanel'

export function GameBoard() {
  const { status } = useGameStore()

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <header className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              한글 낱말 찾기
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              숨겨진 한글 단어를 드래그하여 찾아보세요
            </p>
          </header>

          {status === 'idle' ? (
            /* 시작 전 화면 */
            <div className="flex flex-col items-center gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
                <OptionsPanel />
              </div>
            </div>
          ) : (
            /* 게임 중 레이아웃 */
            <div className="flex flex-col md:flex-row gap-6">
              {/* 사이드바 (데스크톱: 왼쪽, 모바일: 상단) */}
              <aside className="w-full md:w-64 flex flex-col gap-4">
                {/* 첫 번째 패널: 그리드 크기 선택 + 새 게임 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                  <OptionsPanel />
                </div>

                {/* 두 번째 패널: 타이머 + 단어 목록 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4">
                  <Timer />

                  <hr className="border-gray-100" />

                  <WordList />
                </div>
              </aside>

              {/* 그리드 영역 */}
              <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                  <Grid />
                </div>
              </main>
            </div>
          )}
        </div>
      </div>

      <GameOverModal />
    </>
  )
}
