import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 503 })
  }

  try {
    const { theme, count = 5 } = await request.json()

    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
한국어 낱말 찾기 게임에 사용할 단어를 ${count}개 생성해주세요.
테마: ${theme || '일반'}
조건:
- 각 단어는 정확히 3음절 또는 4음절이어야 합니다
- 한글 단어만 사용하세요
- 실제 존재하는 한국어 단어여야 합니다
- JSON 배열 형식으로만 응답하세요: ["단어1", "단어2", ...]
`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // JSON 배열 추출
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) {
      throw new Error('Invalid response format')
    }

    const words: string[] = JSON.parse(match[0])
    const filtered = words.filter((w) => {
      const len = [...w].length
      return len === 3 || len === 4
    })

    return NextResponse.json({ words: filtered })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ error: 'Failed to generate words' }, { status: 500 })
  }
}
