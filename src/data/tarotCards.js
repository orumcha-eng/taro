// 타로 카드 78장 전체 덱
// 메이저 아르카나 22장 + 마이너 아르카나 56장

export const majorArcana = [
    '바보', '마법사', '여사제', '여황제', '황제', '교황',
    '연인', '전차', '힘', '은둔자', '운명의 수레바퀴', '정의',
    '매달린 사람', '죽음', '절제', '악마', '탑', '별',
    '달', '태양', '심판', '세계'
]

// 마이너 아르카나 — 4개 수트 × 14장
const suits = {
    wands: { name: '완드', emoji: '🔥', cards: ['에이스', '2', '3', '4', '5', '6', '7', '8', '9', '10', '시종', '기사', '여왕', '왕'] },
    cups: { name: '컵', emoji: '💧', cards: ['에이스', '2', '3', '4', '5', '6', '7', '8', '9', '10', '시종', '기사', '여왕', '왕'] },
    swords: { name: '소드', emoji: '⚔️', cards: ['에이스', '2', '3', '4', '5', '6', '7', '8', '9', '10', '시종', '기사', '여왕', '왕'] },
    pentacles: { name: '펜타클', emoji: '💰', cards: ['에이스', '2', '3', '4', '5', '6', '7', '8', '9', '10', '시종', '기사', '여왕', '왕'] }
}

export const minorArcana = []
for (const suit of Object.values(suits)) {
    for (const card of suit.cards) {
        minorArcana.push(`${suit.name} ${card}`)
    }
}

// 전체 78장
export const allTarotCards = [...majorArcana, ...minorArcana]

// 이모지 매핑 — 호환성 높은 이모지만 사용
export const cardEmojis = {
    // 메이저 아르카나
    '바보': '🃏',
    '마법사': '✨',
    '여사제': '🔮',
    '여황제': '👸',
    '황제': '👑',
    '교황': '🙏',
    '연인': '💕',
    '전차': '🏇',
    '힘': '🦁',
    '은둔자': '🏔️',
    '운명의 수레바퀴': '🎡',
    '정의': '⚖️',
    '매달린 사람': '🙃',
    '죽음': '💀',
    '절제': '🌊',
    '악마': '😈',
    '탑': '⚡',
    '별': '⭐',
    '달': '🌙',
    '태양': '☀️',
    '심판': '📯',
    '세계': '🌍',
}

// 마이너 아르카나 수트별 이모지 매핑
for (const suit of Object.values(suits)) {
    for (const card of suit.cards) {
        cardEmojis[`${suit.name} ${card}`] = suit.emoji
    }
}

// 카드 종류 (메이저/마이너) 판별
export function getCardType(cardName) {
    return majorArcana.includes(cardName) ? 'major' : 'minor'
}

// 카드 이모지 가져오기
export function getCardEmoji(cardName) {
    return cardEmojis[cardName] || '🎴'
}
