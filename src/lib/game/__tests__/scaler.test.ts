import { describe, it, expect } from 'vitest'
import { getGridConfig, GRID_CONFIGS } from '../scaler'

describe('scaler', () => {
  describe('GRID_CONFIGS', () => {
    it('5가지 그리드 크기가 정의되어야 한다', () => {
      expect(Object.keys(GRID_CONFIGS)).toHaveLength(5)
    })

    it('7x4 설정은 3개 단어, 60초여야 한다', () => {
      const config = GRID_CONFIGS['7x4']
      expect(config.cols).toBe(7)
      expect(config.rows).toBe(4)
      expect(config.wordCount).toBe(3)
      expect(config.timeSeconds).toBe(60)
    })

    it('8x8 설정은 7개 단어, 120초여야 한다', () => {
      const config = GRID_CONFIGS['8x8']
      expect(config.cols).toBe(8)
      expect(config.rows).toBe(8)
      expect(config.wordCount).toBe(7)
      expect(config.timeSeconds).toBe(120)
    })
  })

  describe('getGridConfig', () => {
    it('7x5 설정을 올바르게 반환해야 한다', () => {
      const config = getGridConfig('7x5')
      expect(config.wordCount).toBe(4)
      expect(config.timeSeconds).toBe(75)
    })
  })
})
