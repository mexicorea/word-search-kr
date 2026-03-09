import { getMixedRandomWords } from './dictionary'

// AI API를 통해 테마 기반 단어를 가져옵니다. 실패 시 사전 fallback.
export async function getAIWords(theme: string, count: number): Promise<string[]> {
  try {
    const response = await fetch('/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, count }),
    })

    if (!response.ok) throw new Error('API request failed')

    const data = await response.json()
    if (!data.words || data.words.length === 0) throw new Error('No words returned')

    return data.words.slice(0, count)
  } catch {
    // 사전 fallback
    return getMixedRandomWords(count)
  }
}
