import { describe, it, expect } from 'vitest'
import { DIRECTION_VECTORS, ALL_DIRECTIONS, getDirection } from '../direction'

describe('direction', () => {
  describe('DIRECTION_VECTORS', () => {
    it('8방향 벡터가 모두 정의되어야 한다', () => {
      expect(Object.keys(DIRECTION_VECTORS)).toHaveLength(8)
    })

    it('right 방향은 col만 증가해야 한다', () => {
      expect(DIRECTION_VECTORS.right).toEqual({ dr: 0, dc: 1 })
    })

    it('down-right 방향은 row와 col 모두 증가해야 한다', () => {
      expect(DIRECTION_VECTORS['down-right']).toEqual({ dr: 1, dc: 1 })
    })

    it('up-left 방향은 row와 col 모두 감소해야 한다', () => {
      expect(DIRECTION_VECTORS['up-left']).toEqual({ dr: -1, dc: -1 })
    })
  })

  describe('ALL_DIRECTIONS', () => {
    it('8개의 방향이 포함되어야 한다', () => {
      expect(ALL_DIRECTIONS).toHaveLength(8)
    })
  })

  describe('getDirection', () => {
    it('같은 위치면 null을 반환해야 한다', () => {
      expect(getDirection(0, 0, 0, 0)).toBeNull()
    })

    it('오른쪽으로 이동하면 right를 반환해야 한다', () => {
      expect(getDirection(0, 0, 0, 3)).toBe('right')
    })

    it('아래로 이동하면 down을 반환해야 한다', () => {
      expect(getDirection(0, 0, 4, 0)).toBe('down')
    })

    it('왼쪽 위 대각선이면 up-left를 반환해야 한다', () => {
      expect(getDirection(3, 3, 0, 0)).toBe('up-left')
    })

    it('오른쪽 아래 대각선이면 down-right를 반환해야 한다', () => {
      expect(getDirection(0, 0, 2, 2)).toBe('down-right')
    })
  })
})
