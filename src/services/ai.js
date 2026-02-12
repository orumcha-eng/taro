// AI 타로 리딩 서비스
// Gemini (메인) → OpenAI GPT (폴백) → 고정 텍스트 (최종 폴백)

/**
 * 마크다운 제거 + 텍스트 정리
 */
function cleanResponse(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '$1')   // **볼드** → 볼드
        .replace(/\*(.+?)\*/g, '$1')       // *이탤릭* → 이탤릭
        .replace(/^#{1,6}\s*/gm, '')       // ### 헤딩 → 헤딩
        .replace(/^[-*]\s+/gm, '')         // - 리스트 → 리스트
        .replace(/^\d+\.\s+/gm, '')        // 1. 리스트 → 리스트
        .replace(/`(.+?)`/g, '$1')         // `코드` → 코드
        .replace(/\n{3,}/g, '\n\n')        // 연속 빈줄 정리
        .trim()
}

/**
 * 마스터별 시스템 프롬프트 생성
 */
function buildSystemPrompt(master, cards) {
    return `${master.systemRole}

사용자가 뽑은 카드 3장: ${cards.join(', ')}

아래 형식으로 정확하게 타로 리딩을 작성해:

(${master.name}만의 인사말 한 줄)

🃏 첫 번째 카드 「${cards[0]}」
이 카드의 타로적 의미를 설명하고, 사용자의 사연에 맞게 깊이 있게 해석해 (3~4문장)

🃏 두 번째 카드 「${cards[1]}」
이 카드의 타로적 의미를 설명하고, 사용자의 사연에 맞게 깊이 있게 해석해 (3~4문장)

🃏 세 번째 카드 「${cards[2]}」
이 카드의 타로적 의미를 설명하고, 사용자의 사연에 맞게 깊이 있게 해석해 (3~4문장)

🔮 전체 흐름
세 카드를 종합적으로 연결해서 현재 상황의 흐름을 설명해 (2~3문장)

✨ ${master.name}의 조언
사용자의 구체적 상황을 고려한 현실적이고 실천 가능한 조언 (2~3문장)

절대 규칙:
- 한국어 존댓말
- 마크다운(**, *, # 등) 절대 금지. 이모지와 「」만 사용
- 순수 텍스트로만 작성
- 700~1000자로 풍부하게
- 가장 중요: 사용자가 언급한 현실적 어려움(가족 부양, 경제 상황, 건강 등)을 반드시 고려해. 무조건 긍정적으로만 답하지 마. 리스크가 있으면 솔직히 말하고, 대신 준비 방법이나 대안을 제시해.`
}

/**
 * Gemini API 호출
 */
async function callGemini(systemPrompt, userMessage) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey || apiKey.includes('여기에')) {
        throw new Error('Gemini API 키가 설정되지 않았습니다')
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemPrompt }]
                },
                contents: [{
                    parts: [{ text: userMessage }]
                }],
                generationConfig: {
                    temperature: 0.85,
                    maxOutputTokens: 1200,
                    topP: 0.9,
                }
            })
        }
    )

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(`Gemini API 오류: ${response.status} - ${err?.error?.message || '알 수 없는 오류'}`)
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Gemini 응답이 비어있습니다')
    return text
}

/**
 * OpenAI GPT API 호출 (폴백)
 */
async function callOpenAI(systemPrompt, userMessage) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey || apiKey.includes('여기에')) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.85,
            max_tokens: 1200,
        })
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API 오류: ${response.status} - ${err?.error?.message || '알 수 없는 오류'}`)
    }

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) throw new Error('OpenAI 응답이 비어있습니다')
    return text
}

/**
 * 고정 텍스트 폴백 (API 모두 실패 시)
 */
function getFallbackReading(master, cards) {
    const responses = master.responses
    const picked = responses[Math.floor(Math.random() * responses.length)]
    return `${master.greeting}\n\n🃏 첫 번째 카드 "${cards[0]}"\n→ ${picked}\n\n🃏 두 번째 카드 "${cards[1]}"\n→ 새로운 시작을 암시하는 카드예요. 변화를 두려워하지 마세요.\n\n🃏 세 번째 카드 "${cards[2]}"\n→ 긍정적인 에너지가 다가오고 있어요. 기대해도 좋습니다.\n\n✨ 카드가 전하는 메시지에 귀 기울여보세요. 당신의 길은 이미 열려있습니다.`
}

/**
 * 메인 AI 리딩 함수
 * Gemini → OpenAI → 고정 텍스트 순으로 폴백
 */
export async function generateTarotReading(master, cards, userStory) {
    const systemPrompt = buildSystemPrompt(master, cards)
    const userMessage = `사연: ${userStory}`

    // 1차: Gemini 시도
    try {
        console.log('🔮 Gemini API 호출 중...')
        const result = await callGemini(systemPrompt, userMessage)
        console.log('✅ Gemini 응답 성공')
        return { text: cleanResponse(result), provider: 'gemini' }
    } catch (geminiError) {
        console.warn('⚠️ Gemini 실패:', geminiError.message)

        // 2차: OpenAI GPT 폴백
        try {
            console.log('🤖 OpenAI GPT 폴백 호출 중...')
            const result = await callOpenAI(systemPrompt, userMessage)
            console.log('✅ OpenAI 응답 성공')
            return { text: cleanResponse(result), provider: 'openai' }
        } catch (openaiError) {
            console.warn('⚠️ OpenAI 실패:', openaiError.message)

            // 3차: 고정 텍스트 폴백
            console.log('📝 고정 텍스트 폴백 사용')
            return { text: getFallbackReading(master, cards), provider: 'fallback' }
        }
    }
}

