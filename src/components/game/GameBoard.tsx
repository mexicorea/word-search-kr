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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 flex flex-col">
        <div className="flex-1 p-4 md:p-8">
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

        <footer className="py-4 text-center">
          <a
            href="https://www.youtube.com/@0%EC%B9%98%EB%A7%A4%EC%98%88%EB%B0%A9%EC%97%B0%EA%B5%AC%EC%86%8C0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Inspired by 치매예방연구소
          </a>
        </footer>
      </div>

      <GameOverModal />
    </>
  )
}
