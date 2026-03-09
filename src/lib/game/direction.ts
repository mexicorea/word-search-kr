import type { Direction, DirectionVector } from '@/types/game'

export const DIRECTION_VECTORS: Record<Direction, DirectionVector> = {
  right: { dr: 0, dc: 1 },
  left: { dr: 0, dc: -1 },
  down: { dr: 1, dc: 0 },
  up: { dr: -1, dc: 0 },
  'down-right': { dr: 1, dc: 1 },
  'down-left': { dr: 1, dc: -1 },
  'up-right': { dr: -1, dc: 1 },
  'up-left': { dr: -1, dc: -1 },
}

export const ALL_DIRECTIONS: Direction[] = Object.keys(DIRECTION_VECTORS) as Direction[]

// 두 위치 간의 방향을 계산합니다
export function getDirection(
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): Direction | null {
  const dr = Math.sign(toRow - fromRow)
  const dc = Math.sign(toCol - fromCol)

  // 같은 셀이면 null
  if (dr === 0 && dc === 0) return null

  for (const [dir, vec] of Object.entries(DIRECTION_VECTORS)) {
    if (vec.dr === dr && vec.dc === dc) {
      return dir as Direction
    }
  }
  return null
}

// 방향에 해당하는 화살표 문자를 반환합니다
export const DIRECTION_ARROWS: Record<Direction, string> = {
  right: '→',
  left: '←',
  down: '↓',
  up: '↑',
  'down-right': '↘',
  'down-left': '↙',
  'up-right': '↗',
  'up-left': '↖',
}
