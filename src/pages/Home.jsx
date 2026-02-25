import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import masters from '../data/characters'
import { MasterAvatar } from '../components/MasterAvatar'
import AdBanner from '../components/AdBanner'

const dailyMessages = [
    { emoji: '🌟', text: '새로운 인연이 다가올 수 있는 날', category: '연애' },
    { emoji: '💰', text: '예상치 못한 금전적 기회가 찾아올 수 있어요', category: '금전' },
    { emoji: '🔥', text: '직감이 적중하는 날, 본능을 믿으세요', category: '직감' },
    { emoji: '💕', text: '그 사람도 당신을 생각하고 있을지 몰라요', category: '연애' },
    { emoji: '🍀', text: '오후에 좋은 소식이 올 수 있어요', category: '행운' },
]

const categories = [
    { key: 'all', label: '전체', emoji: '🔮' },
    { key: 'love', label: '연애', emoji: '💕' },
    { key: 'money', label: '금전', emoji: '💰' },
    { key: 'moving', label: '이동운', emoji: '✈️' },
    { key: 'exam', label: '시험', emoji: '📚' },
    { key: 'pastLife', label: '전생', emoji: '🌙' },
    { key: 'pet', label: '펫', emoji: '🐾' },
    { key: 'image', label: '이미지', emoji: '🪞' },
]

import { getRanking } from '../services/rankingService'

export default function Home() {
    const navigate = useNavigate()
    const [hoveredId, setHoveredId] = useState(null)
    const [activeCategory, setActiveCategory] = useState('all')
    const [rankings, setRankings] = useState({})

    useEffect(() => {
        getRanking().then(data => {
            const rankMap = {}
            data.forEach(item => {
                rankMap[item.id] = item.count
            })
            setRankings(rankMap)
        })
    }, [])


    // 오늘의 메시지 (날짜 기반)
    const today = new Date()
    const msgIndex = (today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()) % dailyMessages.length
    const dailyMsg = dailyMessages[msgIndex]

    // 필터링
    const filteredMasters = activeCategory === 'all'
        ? masters
        : masters.filter(m => m.category === activeCategory)

    return (
        <div className="arcade-grid" style={{ minHeight: '100%', paddingBottom: '90px' }}>
            {/* Header */}
            <div style={{
                padding: '40px 20px 24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '300px',
                    height: '200px',
                    background: 'radial-gradient(ellipse, rgba(255,77,166,0.2) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', textAlign: 'center' }}>
                    <p className="font-pixel animate-text-flicker" style={{
                        fontSize: '11px',
                        color: 'var(--color-accent)',
                        marginBottom: '10px',
                        letterSpacing: '4px'
                    }}>
                        ✦ SECRET TAROT ✦
                    </p>
                    <h1 className="font-pixel text-neon" style={{
                        fontSize: '20px',
                        marginBottom: '8px'
                    }}>
                        시크릿 타로
                    </h1>
                    <p className="font-korean" style={{
                        fontSize: '14px',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 300
                    }}>
                        AI 마스터의 프리미엄 타로 상담
                    </p>
                </div>
            </div>

            {/* 오늘의 한마디 배너 */}
            <div style={{ padding: '0 16px', marginBottom: '18px' }}>
                <div className="arcade-card animate-fade-in animate-shimmer" style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    borderColor: 'rgba(0, 229, 255, 0.3)'
                }} onClick={() => navigate('/fortune')}>
                    <span style={{ fontSize: '24px' }}>{dailyMsg.emoji}</span>
                    <div style={{ flex: 1 }}>
                        <p className="font-pixel" style={{ fontSize: '7px', color: 'var(--color-accent)', marginBottom: '4px' }}>
                            TODAY'S MESSAGE
                        </p>
                        <p className="font-korean" style={{ fontSize: '12px', color: 'var(--color-text)' }}>
                            {dailyMsg.text}
                        </p>
                    </div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>›</span>
                </div>
            </div>

            {/* 카테고리 필터 탭 */}
            <div style={{
                // padding: '0 16px', // Removed padding from container
                marginBottom: '16px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                width: '100%', // Ensure full width
            }}>
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '0 16px', // Moved padding here
                    paddingBottom: '2px',
                    minWidth: 'max-content',
                    flexWrap: 'nowrap', // Force single line
                }}>
                    {categories.map(cat => {
                        const isActive = activeCategory === cat.key
                        return (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                style={{
                                    flexShrink: 0, // Prevent shrinking
                                    padding: '8px 14px',
                                    borderRadius: 'var(--radius-full)',
                                    border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(255,77,166,0.2) 0%, rgba(153,51,234,0.15) 100%)'
                                        : 'var(--color-surface)',
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    fontSize: '12px',
                                    fontFamily: "'Noto Sans KR', sans-serif",
                                    fontWeight: isActive ? 600 : 400,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isActive ? '0 0 12px rgba(255,77,166,0.3)' : 'none',
                                }}
                            >
                                <span style={{ fontSize: '12px' }}>{cat.emoji}</span>
                                {cat.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 마스터 섹션 타이틀 */}
            <div style={{ padding: '0 20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '3px', height: '16px',
                    background: 'var(--color-primary)',
                    borderRadius: '2px',
                    boxShadow: 'var(--shadow-neon)'
                }} />
                <p className="font-pixel" style={{ fontSize: '10px', color: 'var(--color-primary)' }}>
                    {activeCategory === 'all' ? 'ALL MASTERS' : categories.find(c => c.key === activeCategory)?.label.toUpperCase()}
                </p>
                <p className="font-korean" style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                    {filteredMasters.length}명의 마스터
                </p>
            </div>

            {/* 마스터 리스트 */}
            <div style={{ padding: '0 16px' }}>
                {filteredMasters.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <p className="font-korean" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                            해당 카테고리에 마스터가 없습니다.
                        </p>
                    </div>
                ) : (
                    filteredMasters.map((master, i) => (
                        <div key={master.id}>
                            <div
                                className="animate-fade-in"
                                style={{ animationDelay: `${i * 0.08}s`, opacity: 0, marginBottom: '12px' }}
                            >
                                <button
                                    onClick={() => navigate(`/reading/${master.id}`)}
                                    onMouseEnter={() => setHoveredId(master.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '14px',
                                        background: hoveredId === master.id ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                                        border: `2px solid ${hoveredId === master.id ? 'rgba(255,77,166,0.5)' : 'var(--color-border)'}`,
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: 'inherit',
                                        transition: 'all 0.25s ease',
                                        boxShadow: hoveredId === master.id ? 'var(--shadow-neon)' : 'none',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Master Avatar */}
                                    <div style={{
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        boxShadow: hoveredId === master.id
                                            ? '0 0 20px rgba(255,77,166,0.3)'
                                            : '0 2px 8px rgba(0,0,0,0.3)',
                                        border: '2px solid rgba(255,255,255,0.1)',
                                        transition: 'all 0.25s ease',
                                        flexShrink: 0
                                    }}>
                                        <MasterAvatar masterId={master.id} size={52} />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {/* 이름 + 전문 뱃지 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                            <span className="font-korean" style={{
                                                fontSize: '16px',
                                                fontWeight: 700,
                                                color: 'var(--color-text)'
                                            }}>
                                                {master.name}
                                            </span>
                                            <span className="font-korean" style={{
                                                fontSize: '10px',
                                                color: 'var(--color-accent)',
                                                padding: '2px 8px',
                                                background: 'rgba(0, 229, 255, 0.1)',
                                                borderRadius: 'var(--radius-full)',
                                                border: '1px solid rgba(0, 229, 255, 0.3)',
                                                whiteSpace: 'nowrap',
                                                fontWeight: 500
                                            }}>
                                                {master.specialty.split('·')[0].trim()}
                                            </span>
                                        </div>

                                        {/* 해시태그 */}
                                        {master.tags && (
                                            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                                {master.tags.map(tag => (
                                                    <span key={tag} className="font-korean" style={{
                                                        fontSize: '10px',
                                                        color: 'var(--color-primary)',
                                                        opacity: 0.8
                                                    }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* AI 기반 설명 */}
                                        <p className="font-korean" style={{
                                            fontSize: '11px',
                                            color: 'var(--color-text-secondary)',
                                            lineHeight: 1.5,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {master.description}
                                        </p>

                                        {/* 상담 건수 + 가격 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                            <span className="font-korean" style={{
                                                fontSize: '10px',
                                                color: 'var(--color-text-muted)'
                                            }}>
                                                💬 {(master.consultations + (rankings[master.id] || 0)).toLocaleString()}건 상담
                                            </span>
                                            <span className="font-pixel" style={{
                                                fontSize: '8px',
                                                color: 'var(--color-accent)'
                                            }}>
                                                FREE
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div style={{
                                        color: hoveredId === master.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        fontSize: '20px',
                                        transition: 'all 0.25s ease',
                                        flexShrink: 0
                                    }}>
                                        ›
                                    </div>
                                </button>
                            </div>
                            {/* 3번째 마스터 뒤에 광고 삽입 */}
                            {i === 2 && (
                                <div style={{ marginBottom: '12px' }}>
                                    <AdBanner format="auto" />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer disclaimer */}
            <div style={{ textAlign: 'center', padding: '20px', paddingBottom: '16px' }}>
                <p className="font-korean" style={{ fontSize: '10px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    ✦ AI 기반 엔터테인먼트 서비스입니다 ✦
                    <br />
                    실제 점술 서비스가 아닙니다
                </p>
            </div>
        </div>
    )
}
