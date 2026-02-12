import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
    { key: '/', icon: '🏠', label: '홈' },
    { key: '/fortune', icon: '🔮', label: '오늘의 운세', isCenter: true },
    { key: '/ranking', icon: '🏆', label: '랭킹' },
]

export default function BottomNav() {
    const location = useLocation()
    const navigate = useNavigate()
    const current = location.pathname

    // 리딩 화면에서는 네비게이션 숨기기
    if (current.startsWith('/reading')) return null

    return (
        <div className="bottom-nav">
            <div style={{
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'space-around'
            }}>
                {tabs.map(tab => {
                    const isActive = current === tab.key
                    return (
                        <button
                            key={tab.key}
                            onClick={() => navigate(tab.key)}
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: tab.isCenter ? '0' : '8px 0',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                marginTop: tab.isCenter ? '-16px' : '0'
                            }}
                        >
                            {tab.isCenter ? (
                                <>
                                    <div className={isActive ? 'animate-neon-pulse' : ''} style={{
                                        width: '52px',
                                        height: '52px',
                                        borderRadius: '50%',
                                        background: isActive
                                            ? 'linear-gradient(180deg, #ff4da6 0%, #e60073 100%)'
                                            : 'var(--color-surface)',
                                        border: `2px solid ${isActive ? 'rgba(255,150,200,0.5)' : 'var(--color-border)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '22px',
                                        boxShadow: isActive ? 'var(--shadow-neon)' : 'none',
                                        transition: 'all 0.25s ease',
                                        marginBottom: '4px'
                                    }}>
                                        {tab.icon}
                                    </div>
                                    <span className="font-korean" style={{ fontSize: '9px', marginTop: '2px' }}>
                                        {tab.label}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '20px', marginBottom: '2px' }}>{tab.icon}</span>
                                    <span className="font-korean" style={{ fontSize: '9px' }}>{tab.label}</span>
                                    {isActive && (
                                        <div className="animate-neon-pulse" style={{
                                            position: 'absolute',
                                            bottom: '2px',
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            background: 'var(--color-primary)'
                                        }} />
                                    )}
                                </>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
