import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const fortunes = [
    { emoji: '🌟', text: '오늘은 새로운 인연이 다가올 수 있는 날이에요', category: '연애' },
    { emoji: '💰', text: '예상치 못한 곳에서 금전적 기회가 찾아와요', category: '금전' },
    { emoji: '🔥', text: '당신의 직감을 믿으세요, 오늘은 적중률이 높아요', category: '직감' },
    { emoji: '💕', text: '그 사람도 당신을 생각하고 있을 확률이 높아요', category: '연애' },
    { emoji: '🍀', text: '오후 3시~5시 사이에 좋은 소식이 올 수 있어요', category: '행운' },
    { emoji: '✨', text: '미루던 일을 시작하기에 최적의 타이밍이에요', category: '행동' },
    { emoji: '🌙', text: '오늘 밤 꿈에서 중요한 힌트를 얻을 수 있어요', category: '영감' },
    { emoji: '💎', text: '작은 변화가 큰 행운으로 이어지는 날이에요', category: '변화' },
    { emoji: '🦋', text: '과거에 놓쳤던 기회가 다시 돌아올 조짐이에요', category: '기회' },
    { emoji: '⭐', text: '누군가의 진심 어린 말에 귀 기울여보세요', category: '소통' },
    { emoji: '🌈', text: '고민하던 문제의 답이 의외로 가까이에 있어요', category: '해결' },
    { emoji: '🔮', text: '오늘 만나는 사람 중 당신에게 도움을 줄 사람이 있어요', category: '인연' },
    { emoji: '💫', text: '용기를 내면 원하던 결과를 얻을 수 있어요', category: '용기' },
    { emoji: '🌸', text: '감정을 솔직하게 표현하면 좋은 일이 생겨요', category: '감정' },
    { emoji: '🎯', text: '집중력이 최고조인 날, 중요한 일을 처리하세요', category: '집중' },
    { emoji: '💝', text: 'SNS에서 뜻밖의 연락이 올 수 있어요', category: '연애' },
    { emoji: '🪐', text: '오늘의 행운 숫자는 3, 7, 9예요', category: '행운' },
    { emoji: '🕊️', text: '양보하면 더 큰 것을 얻게 되는 날이에요', category: '지혜' },
    { emoji: '🎪', text: '평소와 다른 루트로 이동하면 행운이 따라요', category: '행운' },
    { emoji: '💐', text: '주변 사람에게 먼저 연락하면 기쁜 소식이 와요', category: '인연' },
    { emoji: '🌊', text: '흘러가는 대로 맡기면 자연스럽게 풀려요', category: '여유' },
    { emoji: '⚡', text: '오늘 떠오르는 아이디어는 꼭 메모해두세요', category: '영감' },
    { emoji: '🧿', text: '부정적인 생각을 멈추면 에너지가 바뀌어요', category: '에너지' },
    { emoji: '🌺', text: '오랜만에 연락 오는 사람이 있을 수 있어요', category: '인연' },
    { emoji: '🏆', text: '노력의 결과가 드러나기 시작하는 날이에요', category: '성취' },
]

function getDailyFortune() {
    const d = new Date()
    const idx = (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) % fortunes.length
    return fortunes[idx]
}

export default function Fortune() {
    const navigate = useNavigate()
    const [fortune, setFortune] = useState(getDailyFortune())
    const [revealed, setRevealed] = useState(false)
    const [shuffling, setShuffling] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 600)
        return () => clearTimeout(t)
    }, [])

    const handleShuffle = () => {
        if (shuffling) return
        setShuffling(true)
        setRevealed(false)
        setTimeout(() => {
            const idx = Math.floor(Math.random() * fortunes.length)
            setFortune(fortunes[idx])
            setRevealed(true)
            setShuffling(false)
        }, 800)
    }

    return (
        <div className="arcade-grid" style={{
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px 100px'
        }}>
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <p className="font-pixel text-neon" style={{ fontSize: '18px', marginBottom: '10px' }}>
                    🎰 오늘의 운세
                </p>
                <p className="font-korean" style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    매일 무료로 확인하는 오늘의 메시지
                </p>
            </div>

            {/* Fortune Card */}
            <div className={`arcade-card ${revealed ? 'animate-neon-pulse' : ''}`} style={{
                width: '100%',
                maxWidth: '340px',
                padding: '32px 24px',
                textAlign: 'center',
                opacity: revealed ? 1 : 0.5,
                transition: 'all 0.5s ease'
            }}>
                {/* Icon */}
                <div style={{
                    width: '72px',
                    height: '72px',
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    background: revealed ? 'rgba(255,77,166,0.15)' : 'rgba(255,255,255,0.03)',
                    boxShadow: revealed ? 'var(--shadow-neon)' : 'none',
                    transition: 'all 0.5s ease'
                }}>
                    {shuffling ? (
                        <span style={{ fontSize: '24px' }} className="animate-card-flip">🔮</span>
                    ) : (
                        <span className={revealed ? 'animate-float' : ''}>{fortune.emoji}</span>
                    )}
                </div>

                {/* Category Badge */}
                {revealed && (
                    <div className="animate-fade-in" style={{ marginBottom: '14px' }}>
                        <span style={{
                            padding: '4px 14px',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(255,77,166,0.1)',
                            border: '1px solid rgba(255,77,166,0.3)',
                            fontSize: '10px',
                            color: 'var(--color-primary)'
                        }} className="font-korean">
                            {fortune.category}
                        </span>
                    </div>
                )}

                {/* Fortune Text */}
                <div style={{ minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {revealed ? (
                        <p className="font-korean animate-fade-in" style={{
                            fontSize: '16px',
                            lineHeight: 1.6,
                            fontWeight: 500
                        }}>
                            {fortune.text}
                        </p>
                    ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} className="animate-pixel-bounce" style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'var(--color-primary)',
                                    animationDelay: `${i * 0.15}s`
                                }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Date */}
                {revealed && (
                    <div className="animate-fade-in" style={{ marginTop: '16px' }}>
                        <span className="font-pixel" style={{ fontSize: '8px', color: 'var(--color-text-secondary)' }}>
                            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                )}
            </div>

            {/* Shuffle Button */}
            {revealed && (
                <button
                    onClick={handleShuffle}
                    disabled={shuffling}
                    className="animate-fade-in"
                    style={{
                        marginTop: '24px',
                        padding: '10px 24px',
                        borderRadius: 'var(--radius-md)',
                        background: 'transparent',
                        border: '2px solid var(--color-border)',
                        color: 'var(--color-primary)',
                        fontFamily: "'Noto Sans KR', sans-serif",
                        fontSize: '13px',
                        cursor: shuffling ? 'not-allowed' : 'pointer',
                        opacity: shuffling ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    🔄 다른 운세 보기
                </button>
            )}

            {/* CTA */}
            {revealed && (
                <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '32px' }}>
                    <p className="font-korean" style={{
                        fontSize: '14px',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '14px',
                        fontWeight: 400
                    }}>
                        더 자세한 리딩이 궁금하다면?
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="arcade-button"
                        style={{
                            padding: '12px 28px',
                            fontSize: '13px',
                            fontFamily: "'Noto Sans KR', sans-serif",
                            fontWeight: 700
                        }}
                    >
                        🔮 AI 마스터에게 상담하기
                    </button>
                </div>
            )}
        </div>
    )
}
