import { useState, useEffect } from 'react'

/**
 * 전면 광고 (인터스티셜) 컴포넌트
 * 게임 스타일: N초 동안 광고를 봐야 닫기 버튼이 활성화됨
 * 
 * @param {number} duration - 광고 시청 필수 시간 (초), 기본 5초
 * @param {function} onComplete - 광고 시청 완료 후 콜백
 * @param {string} slot - 애드센스 광고 슬롯 번호
 */
export default function InterstitialAd({ duration = 5, onComplete, slot }) {
    const [countdown, setCountdown] = useState(duration)
    const [canClose, setCanClose] = useState(false)
    const [adLoaded, setAdLoaded] = useState(false)

    // 카운트다운 타이머
    useEffect(() => {
        if (countdown <= 0) {
            setCanClose(true)
            return
        }
        const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
        return () => clearTimeout(timer)
    }, [countdown])

    // 애드센스 광고 로드
    useEffect(() => {
        try {
            if (window.adsbygoogle) {
                window.adsbygoogle.push({})
                setAdLoaded(true)
            }
        } catch (e) {
            console.log('Interstitial ad load error:', e)
            // 광고 로드 실패해도 카운트다운 후 닫기 가능
        }
    }, [])

    const handleClose = () => {
        if (canClose && onComplete) {
            onComplete()
        }
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-out',
        }}>
            {/* 상단 바 */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.5)',
                zIndex: 2,
            }}>
                <span style={{
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '1px',
                }}>
                    광고
                </span>

                {/* 닫기 버튼 / 카운트다운 */}
                {canClose ? (
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '20px',
                            padding: '6px 16px',
                            color: 'white',
                            fontSize: '13px',
                            fontFamily: "'Noto Sans KR', sans-serif",
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        ✕ 닫기
                    </button>
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        {/* 원형 카운트다운 */}
                        <div style={{
                            position: 'relative',
                            width: '32px',
                            height: '32px',
                        }}>
                            <svg width="32" height="32" viewBox="0 0 32 32" style={{
                                transform: 'rotate(-90deg)',
                            }}>
                                {/* 배경 원 */}
                                <circle
                                    cx="16" cy="16" r="14"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.15)"
                                    strokeWidth="2.5"
                                />
                                {/* 진행 원 */}
                                <circle
                                    cx="16" cy="16" r="14"
                                    fill="none"
                                    stroke="#ff4da6"
                                    strokeWidth="2.5"
                                    strokeDasharray={`${2 * Math.PI * 14}`}
                                    strokeDashoffset={`${2 * Math.PI * 14 * (countdown / duration)}`}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                                />
                            </svg>
                            <span style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 700,
                                fontFamily: "'Noto Sans KR', sans-serif",
                            }}>
                                {countdown}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* 메인 광고 영역 */}
            <div style={{
                width: '100%',
                maxWidth: '430px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 16px 80px',
                gap: '20px',
            }}>
                {/* 광고 컨테이너 - 큰 직사각형 */}
                <div style={{
                    width: '100%',
                    minHeight: '300px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <ins
                        className="adsbygoogle"
                        style={{
                            display: 'block',
                            width: '100%',
                            minHeight: '300px',
                        }}
                        data-ad-client="ca-pub-7176952059444763"
                        data-ad-slot={slot || ''}
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                </div>

                {/* 하단 안내 메시지 */}
                <div style={{
                    textAlign: 'center',
                    padding: '12px',
                }}>
                    {!canClose ? (
                        <p style={{
                            fontFamily: "'Noto Sans KR', sans-serif",
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.4)',
                            lineHeight: 1.5,
                        }}>
                            🔮 광고 시청 후 무료 리딩이 시작됩니다
                        </p>
                    ) : (
                        <p style={{
                            fontFamily: "'Noto Sans KR', sans-serif",
                            fontSize: '14px',
                            color: '#ff4da6',
                            fontWeight: 600,
                            animation: 'fadeIn 0.3s ease-out',
                        }}>
                            ✨ 닫기를 눌러 리딩을 시작하세요!
                        </p>
                    )}
                </div>
            </div>

            {/* 하단 프로그레스 바 */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'rgba(255,255,255,0.05)',
            }}>
                <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff4da6, #9933ea)',
                    width: `${((duration - countdown) / duration) * 100}%`,
                    transition: 'width 1s linear',
                    borderRadius: '0 2px 2px 0',
                }} />
            </div>
        </div>
    )
}
