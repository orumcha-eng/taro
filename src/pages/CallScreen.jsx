import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import masters from '../data/characters'
import { allTarotCards, getCardEmoji } from '../data/tarotCards'
import { MasterAvatar } from '../components/MasterAvatar'
import { generateTarotReading } from '../services/ai'
import { incrementConsultation } from '../services/rankingService'
import AdBanner from '../components/AdBanner'


function pickRandomCards(count = 3) {
    const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

function TarotCardDisplay({ cardName, index, isRevealed }) {
    const emoji = getCardEmoji(cardName)
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.6s ease',
            transform: isRevealed ? 'scale(1) rotateY(0deg)' : 'scale(0.7) rotateY(180deg)',
            opacity: isRevealed ? 1 : 0,
            transitionDelay: `${index * 0.3}s`
        }}>
            <div style={{
                width: '64px',
                height: '88px',
                borderRadius: 'var(--radius-md)',
                background: isRevealed
                    ? 'linear-gradient(135deg, rgba(255,77,166,0.6) 0%, rgba(153,51,234,0.6) 100%)'
                    : 'linear-gradient(135deg, #2a2a3a, #1a1a2e)',
                border: '2px solid rgba(255,77,166,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: isRevealed ? 'var(--shadow-neon)' : 'none',
                transition: 'all 0.6s ease',
                transitionDelay: `${index * 0.3}s`
            }}>
                {isRevealed ? emoji : '🎴'}
            </div>
            <p className="font-korean" style={{
                fontSize: '10px',
                color: 'var(--color-primary)',
                opacity: isRevealed ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: `${index * 0.3 + 0.4}s`,
                maxWidth: '72px',
                textAlign: 'center'
            }}>
                {cardName}
            </p>
        </div>
    )
}

function ReadingScreen() {
    const { id } = useParams()
    const navigate = useNavigate()
    const master = masters.find(m => m.id === parseInt(id))

    // step: input -> loading -> result
    const [step, setStep] = useState('input')
    const [story, setStory] = useState('')
    const [cards, setCards] = useState([])
    const [cardsRevealed, setCardsRevealed] = useState(false)
    const [readingText, setReadingText] = useState('')
    const [displayedText, setDisplayedText] = useState('')
    const [loadingMsg, setLoadingMsg] = useState('')
    const [aiProvider, setAiProvider] = useState('')
    const resultRef = useRef(null)

    // 타이핑 효과
    useEffect(() => {
        if (step !== 'result' || !readingText) return
        let i = 0
        setDisplayedText('')
        const interval = setInterval(() => {
            if (i < readingText.length) {
                const char = readingText[i]
                i++
                setDisplayedText(prev => prev + char)
            } else {
                clearInterval(interval)
            }
        }, 20)
        return () => clearInterval(interval)
    }, [step, readingText])

    // 결과 화면 자동 스크롤
    useEffect(() => {
        if (step === 'result' && resultRef.current) {
            setTimeout(() => {
                resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    }, [step])

    // 타이핑 자동 스크롤
    const textRef = useRef(null)
    useEffect(() => {
        if (textRef.current) {
            textRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [displayedText])

    if (!master) return <div>Master not found</div>

    // 실제 리딩 시작 (결제 성공 후)
    const startReading = async () => {
        // 랭킹 카운트 증가 요청
        incrementConsultation(master.id)

        setStep('loading')

        // 카드 뽑기
        const drawnCards = pickRandomCards(3)
        setCards(drawnCards)

        // 로딩 메시지 시퀀스
        setLoadingMsg('카드를 셔플하고 있어요...')
        setTimeout(() => setLoadingMsg('과거, 현재, 미래의 흐름을 읽고 있습니다...'), 2000)
        setTimeout(() => setLoadingMsg('AI가 카드를 깊이 있게 해석 중입니다...'), 4500)
        setTimeout(() => setLoadingMsg('리딩을 정리하고 있어요...'), 7000)

        try {
            // AI 타로 리딩 요청
            const { text, provider } = await generateTarotReading(master, drawnCards, story)
            setReadingText(text)
            setAiProvider(provider)
        } catch (err) {
            console.error('AI 리딩 오류:', err)
            // 최종 폴백
            const responses = master.responses
            const picked = responses[Math.floor(Math.random() * responses.length)]
            setReadingText(`${master.greeting}\n\n🃏 첫 번째 카드 "${drawnCards[0]}"\n→ ${picked}\n\n🃏 두 번째 카드 "${drawnCards[1]}"\n→ 새로운 시작을 암시하는 카드예요. 변화를 두려워하지 마세요.\n\n🃏 세 번째 카드 "${drawnCards[2]}"\n→ 긍정적인 에너지가 다가오고 있어요. 기대해도 좋습니다.\n\n✨ 카드가 전하는 메시지에 귀 기울여보세요. 당신의 길은 이미 열려있습니다.`)
            setAiProvider('fallback')
        }

        setStep('result')
        setCardsRevealed(true)
    }

    // 리딩 시작 핸들러 (무료)
    const handleStartReading = () => {
        if (!story.trim()) return
        startReading()
    }

    const handleReset = () => {
        setStep('input')
        setStory('')
        setCards([])
        setCardsRevealed(false)
        setDisplayedText('')
        setReadingText('')
        setAiProvider('')
        setLoadingMsg('')
    }

    return (
        <div className="app-container">
            {/* Header */}
            <div className="animate-slide-down" style={{
                paddingTop: 'max(20px, env(safe-area-inset-top) + 20px)',
                paddingBottom: '20px',
                paddingLeft: '20px',
                paddingRight: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '20px'
            }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '20px', cursor: 'pointer' }}>
                    ←
                </button>
                <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--color-primary)'
                }}>
                    <MasterAvatar masterId={master.id} size={40} />
                </div>
                <div>
                    <h2 className="font-korean" style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{master.name}</h2>
                    <p className="font-korean" style={{ fontSize: '11px', color: 'var(--color-primary)' }}>{master.specialty}</p>
                </div>
            </div>

            <div style={{ padding: '0 20px 100px' }}>
                {/* Step: Input */}
                {step === 'input' && (
                    <div className="animate-slide-up">
                        <div className="arcade-card" style={{ padding: '20px', marginBottom: '24px' }}>
                            <p className="font-korean" style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                                {master.greeting}
                            </p>
                            <textarea
                                value={story}
                                onChange={(e) => setStory(e.target.value)}
                                placeholder="고민을 자세히 적어주시면 더 정확한 리딩이 가능해요. (예: 짝사랑하는 사람이 있는데 연락이 올까요?)"
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '12px',
                                    color: 'var(--color-text)',
                                    fontSize: '14px',
                                    resize: 'none',
                                    fontFamily: "'Noto Sans KR', sans-serif"
                                }}
                            />
                        </div>

                        <button
                            onClick={handleStartReading}
                            disabled={!story.trim()}
                            className="arcade-button"
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '16px',
                                fontFamily: "'Noto Sans KR', sans-serif",
                                fontWeight: 700,
                                opacity: story.trim() ? 1 : 0.4,
                                cursor: story.trim() ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            🔮 무료 리딩 받기
                        </button>
                    </div>
                )}



                {/* Step: Loading */}
                {step === 'loading' && (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <div className="animate-neon-pulse" style={{
                                width: '80px',
                                margin: '0 auto',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                border: '2px solid rgba(255,255,255,0.15)'
                            }}>
                                <MasterAvatar masterId={master.id} size={80} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '48px',
                                    height: '64px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'linear-gradient(135deg, rgba(255,77,166,0.5), rgba(153,51,234,0.5))',
                                    border: '2px solid rgba(255,77,166,0.3)',
                                    boxShadow: 'var(--shadow-neon)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px'
                                }} className="animate-card-flip" style2={{ animationDelay: `${i * 0.3}s` }}>
                                    🎴
                                </div>
                            ))}
                        </div>

                        <p className="font-korean" style={{ fontSize: '13px', color: 'var(--color-primary)', marginBottom: '8px' }}>
                            {loadingMsg || '카드를 뽑고 있어요...'} 🎴
                        </p>
                        <p className="font-korean" style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                            AI가 에너지를 집중하고 있습니다
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '20px' }}>
                            {[0, 1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pixel-bounce" style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: 'var(--color-primary)',
                                    animationDelay: `${i * 0.15}s`
                                }} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Step: Result */}
                {step === 'result' && (
                    <div ref={resultRef} className="animate-fade-in">
                        {/* Drawn Cards */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <p className="font-pixel" style={{ fontSize: '7px', color: 'var(--color-text-muted)', marginBottom: '16px', letterSpacing: '2px' }}>
                                ✦ YOUR CARDS ✦
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                                {cards.map((card, i) => (
                                    <TarotCardDisplay key={card} cardName={card} index={i} isRevealed={cardsRevealed} />
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,77,166,0.3), transparent)' }} />
                            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>✦ 리딩 결과 ✦</span>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,77,166,0.3), transparent)' }} />
                        </div>

                        {/* Reading Text - Formatted Sections */}
                        <div className="arcade-card" style={{ padding: '20px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                                <div style={{
                                    borderRadius: 'var(--radius-sm)',
                                    overflow: 'hidden',
                                    border: '2px solid rgba(255,255,255,0.15)',
                                    flexShrink: 0
                                }}>
                                    <MasterAvatar masterId={master.id} size={40} />
                                </div>
                                <div>
                                    <p className="font-korean" style={{ fontSize: '13px', fontWeight: 700 }}>{master.name}의 리딩</p>
                                    <p className="font-korean" style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{master.specialty}</p>
                                </div>
                                {aiProvider && aiProvider !== 'fallback' && (
                                    <span className="font-pixel" style={{
                                        marginLeft: 'auto',
                                        fontSize: '6px',
                                        padding: '2px 6px',
                                        borderRadius: 'var(--radius-full)',
                                        background: aiProvider === 'gemini' ? 'rgba(0,229,255,0.15)' : 'rgba(153,51,234,0.15)',
                                        color: aiProvider === 'gemini' ? 'var(--color-accent)' : '#9933ea',
                                        border: `1px solid ${aiProvider === 'gemini' ? 'rgba(0,229,255,0.3)' : 'rgba(153,51,234,0.3)'}`
                                    }}>
                                        {aiProvider === 'gemini' ? 'GEMINI AI' : 'GPT AI'}
                                    </span>
                                )}
                            </div>

                            <div className="font-korean" style={{
                                fontSize: '13px',
                                lineHeight: 1.9,
                                color: 'var(--color-text)',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {displayedText}
                                {displayedText.length < readingText.length && (
                                    <span className="animate-text-flicker" style={{ color: 'var(--color-primary)' }}>▌</span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleReset}
                            className="arcade-button"
                            style={{
                                width: '100%',
                                padding: '14px',
                                fontSize: '13px',
                                fontFamily: "'Noto Sans KR', sans-serif",
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                marginBottom: '12px'
                            }}
                        >
                            🔮 {master.name}에게 다시 상담하기
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontFamily: "'Noto Sans KR', sans-serif",
                                fontSize: '13px',
                                borderRadius: 'var(--radius-md)',
                                background: 'transparent',
                                border: '2px solid var(--color-border)',
                                color: 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            🏠 다른 마스터 보기
                        </button>

                        {/* 광고 배너 */}
                        <div style={{ margin: '20px 0' }}>
                            <AdBanner format="auto" />
                        </div>

                        {/* Footer */}
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <p className="font-korean" style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>
                                ✨ Powered by Secret Tarot • {new Date().toLocaleDateString('ko-KR')} ✨
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReadingScreen
