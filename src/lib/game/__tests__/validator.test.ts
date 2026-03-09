import { describe, it, expect } from 'vitest'
import { validateSelection, isAllWordsFound } from '../validator'
import type { PlacedWord, FoundWord } from '@/types/game'

const mockPlacedWord: PlacedWord = {
  word: '강아지',
  start: { row: 0, col: 0 },
  direction: 'right',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ],
}

describe('validator', () => {
  describe('validateSelection', () => {
    it('올바른 셀 선택이면 FoundWord를 반환해야 한다', () => {
      const selected = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]
      const result = validateSelection(selected, [mockPlacedWord], [])
      expect(result).not.toBeNull()
      expect(result?.word).toBe('강아지')
    })

    it('역방향 선택도 유효해야 한다', () => {
      const selected = [
        { row: 0, col: 2 },
        { row: 0, col: 1 },
        { row: 0, col: 0 },
      ]
      const result = validateSelection(selected, [mockPlacedWord], [])
      expect(result).not.toBeNull()
      expect(result?.word).toBe('강아지')
    })

    it('잘못된 셀 선택이면 null을 반환해야 한다', () => {
      const selected = [
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ]
      const result = validateSelection(selected, [mockPlacedWord], [])
      expect(result).toBeNull()
    })

    it('이미 찾은 단어는 null을 반환해야 한다', () => {
      const selected = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]
      const alreadyFound: FoundWord[] = [
        { word: '강아지', cells: mockPlacedWord.cells },
      ]
      const result = validateSelection(selected, [mockPlacedWord], alreadyFound)
      expect(result).toBeNull()
    })

    it('선택된 셀이 1개 이하면 null을 반환해야 한다', () => {
      const result = validateSelection([{ row: 0, col: 0 }], [mockPlacedWord], [])
      expect(result).toBeNull()
    })
  })

  describe('isAllWordsFound', () => {
    it('모든 단어를 찾았으면 true를 반환해야 한다', () => {
      const placedWords: PlacedWord[] = [mockPlacedWord]
      const foundWords: FoundWord[] = [{ word: '강아지', cells: mockPlacedWord.cells }]
      expect(isAllWordsFound(placedWords, foundWords)).toBe(true)
    })

    it('아직 찾지 못한 단어가 있으면 false를 반환해야 한다', () => {
      const placedWords: PlacedWord[] = [mockPlacedWord]
      expect(isAllWordsFound(placedWords, [])).toBe(false)
    })

    it('배치된 단어가 없으면 false를 반환해야 한다', () => {
      expect(isAllWordsFound([], [])).toBe(false)
    })
  })
})
