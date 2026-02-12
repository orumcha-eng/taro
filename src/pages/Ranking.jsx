import { useNavigate } from 'react-router-dom'
import masters from '../data/characters'
import { MasterAvatar } from '../components/MasterAvatar'

const rankedMasters = [...masters]
    .sort((a, b) => b.consultations - a.consultations)
    .map((master, i) => ({
        ...master,
        rank: i + 1,
        trend: i < 3 ? 'up' : 'stable'
    }))

export default function Ranking() {
    const navigate = useNavigate()

    return (
        <div className="arcade-grid" style={{ minHeight: '100%', paddingBottom: '90px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', padding: '36px 20px 24px' }}>
                <p className="font-pixel text-neon" style={{ fontSize: '18px', marginBottom: '10px' }}>
                    🏆 인기 마스터 랭킹
                </p>
                <p className="font-korean" style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    이번 달 가장 인기 있는 마스터
                </p>
            </div>

            {/* Ranking List */}
            <div style={{ padding: '0 16px' }}>
                {rankedMasters.map((master, i) => {
                    const medal = master.rank === 1 ? '🥇' : master.rank === 2 ? '🥈' : master.rank === 3 ? '🥉' : null
                    const isTop3 = master.rank <= 3

                    return (
                        <button
                            key={master.id}
                            onClick={() => navigate(`/reading/${master.id}`)}
                            className="arcade-card animate-fade-in"
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px',
                                marginBottom: '10px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                animationDelay: `${i * 0.08}s`,
                                opacity: 0,
                                borderColor: isTop3 ? 'rgba(255,77,166,0.5)' : 'var(--color-border)'
                            }}
                        >
                            {/* Rank */}
                            <div style={{ width: '32px', textAlign: 'center', flexShrink: 0 }}>
                                {medal ? (
                                    <span style={{ fontSize: '20px' }}>{medal}</span>
                                ) : (
                                    <span className="font-pixel" style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>
                                        {master.rank}
                                    </span>
                                )}
                            </div>

                            {/* Avatar */}
                            <div style={{
                                borderRadius: 'var(--radius-sm)',
                                overflow: 'hidden',
                                border: isTop3 ? '2px solid rgba(255,77,166,0.5)' : '2px solid rgba(255,255,255,0.1)',
                                boxShadow: isTop3 ? 'var(--shadow-neon)' : 'none',
                                flexShrink: 0
                            }}>
                                <MasterAvatar masterId={master.id} size={44} />
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span className="font-korean" style={{ fontSize: '14px', fontWeight: 700 }}>
                                        {master.name}
                                    </span>
                                    {isTop3 && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>🔥</span>}
                                </div>
                                <span className="font-korean" style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                                    이번 달 상담 {master.consultations.toLocaleString()}건
                                </span>
                            </div>

                            {/* Trend */}
                            <div style={{ flexShrink: 0 }}>
                                {master.trend === 'up' ? (
                                    <span className="font-pixel" style={{
                                        fontSize: '7px',
                                        color: 'var(--color-accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '2px'
                                    }}>
                                        ▲ UP
                                    </span>
                                ) : (
                                    <span className="font-pixel" style={{ fontSize: '7px', color: 'var(--color-text-muted)' }}>
                                        -
                                    </span>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
