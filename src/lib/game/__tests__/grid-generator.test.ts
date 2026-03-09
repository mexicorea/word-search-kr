import { describe, it, expect } from 'vitest'
import { canPlaceWord, placeWord, generateGrid } from '../grid-generator'
import type { GridConfig } from '@/types/game'

const config7x4: GridConfig = { cols: 7, rows: 4, wordCount: 3, timeSeconds: 60 }

describe('grid-generator', () => {
  describe('canPlaceWord', () => {
    it('빈 그리드에 단어를 배치할 수 있어야 한다', () => {
      const grid = Array.from({ length: 4 }, () => Array(7).fill(null))
      expect(canPlaceWord(grid, '강아지', { row: 0, col: 0 }, 'right', 4, 7)).toBe(true)
    })

    it('경계를 벗어나면 배치할 수 없어야 한다', () => {
      const grid = Array.from({ length: 4 }, () => Array(7).fill(null))
      // 7칸 폭 그리드에서 col 5부터 오른쪽으로 3음절 단어 배치 불가
      expect(canPlaceWord(grid, '강아지', { row: 0, col: 5 }, 'right', 4, 7)).toBe(false)
    })

    it('다른 음절과 충돌하면 배치할 수 없어야 한다', () => {
      const grid = Array.from({ length: 4 }, () => Array(7).fill(null))
      grid[0][1] = '다'  // 다른 음절 선배치
      expect(canPlaceWord(grid, '강아지', { row: 0, col: 0 }, 'right', 4, 7)).toBe(false)
    })

    it('같은 음절이면 교차 배치를 허용해야 한다', () => {
      const grid = Array.from({ length: 4 }, () => Array(7).fill(null))
      grid[0][1] = '아'  // 교차점에 같은 음절 선배치
      expect(canPlaceWord(grid, '강아지', { row: 0, col: 0 }, 'right', 4, 7)).toBe(true)
    })

    it('대각선 방향으로 배치 가능해야 한다', () => {
      const grid = Array.from({ length: 4 }, () => Array(7).fill(null))
      expect(canPlaceWord(grid, '강아지', { row: 0, col: 0 }, 'down-right', 4, 7)).toBe(true)
    })
  })

  describe('placeWord', () => {
    it('단어를 그리드에 배치하고 셀 위치를 반환해야 한다', () => {
      const grid = Array.from({ length: 4 }, () => Array(7).fill(null))
      const cells = placeWord(grid, '강아지', { row: 0, col: 0 }, 'right')
      expect(cells).toHaveLength(3)
      expect(grid[0][0]).toBe('강')
      expect(grid[0][1]).toBe('아')
      expect(grid[0][2]).toBe('지')
    })

    it('아래 방향으로 단어를 배치해야 한다', () => {
      const grid = Array.from({ length: 4 }, () => Array(7).fill(null))
      placeWord(grid, '무지개', { row: 0, col: 2 }, 'down')
      expect(grid[0][2]).toBe('무')
      expect(grid[1][2]).toBe('지')
      expect(grid[2][2]).toBe('개')
    })
  })

  describe('generateGrid', () => {
    it('단어를 그리드에 배치하고 결과를 반환해야 한다', () => {
      const words = ['강아지', '무지개', '고양이']
      const result = generateGrid(words, config7x4)
      expect(result.grid).toHaveLength(4)
      expect(result.grid[0]).toHaveLength(7)
    })

    it('배치된 단어들이 결과에 포함되어야 한다', () => {
      const words = ['강아지', '무지개', '고양이']
      const result = generateGrid(words, config7x4)
      expect(result.placedWords.length).toBeGreaterThan(0)
    })

    it('그리드의 모든 셀이 음절로 채워져야 한다', () => {
      const words = ['강아지', '무지개', '고양이']
      const result = generateGrid(words, config7x4)
      for (const row of result.grid) {
        for (const cell of row) {
          expect(cell.syllable).toBeTruthy()
          expect(cell.syllable.length).toBeGreaterThan(0)
        }
      }
    })

    it('배치된 단어의 음절이 그리드에 올바르게 존재해야 한다', () => {
      const words = ['강아지']
      const config: GridConfig = { cols: 5, rows: 5, wordCount: 1, timeSeconds: 60 }
      const result = generateGrid(words, config)

      if (result.placedWords.length > 0) {
        const placed = result.placedWords[0]
        const syllables = [...placed.word]
        placed.cells.forEach((pos, i) => {
          expect(result.grid[pos.row][pos.col].syllable).toBe(syllables[i])
        })
      }
    })
  })
})
