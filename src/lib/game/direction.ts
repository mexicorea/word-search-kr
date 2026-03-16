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

const MIN_DRAG_DISTANCE = 12

// 픽셀 벡터 각도 기반으로 방향을 결정합니다 (360°를 8방위 45°씩 분할)
export function getDirectionFromAngle(dx: number, dy: number): Direction | null {
  if (Math.sqrt(dx * dx + dy * dy) < MIN_DRAG_DISTANCE) return null

  // atan2(dy, dx): 스크린 좌표계에서 right=0°, down=90°
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) // -180 ~ 180
  const sector = Math.round(angle / 45) // -4 ~ 4

  const SECTOR_TO_DIRECTION: Record<number, Direction> = {
    0: 'right',
    1: 'down-right',
    2: 'down',
    3: 'down-left',
    4: 'left',
    '-4': 'left',
    '-3': 'up-left',
    '-2': 'up',
    '-1': 'up-right',
  }
  return SECTOR_TO_DIRECTION[sector] ?? null
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
