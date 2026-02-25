import { useEffect, useRef, useState } from 'react'

/**
 * Google AdSense 광고 배너 컴포넌트
 * 광고가 로드되지 않으면 숨김 처리
 * 
 * @param {'banner' | 'rectangle' | 'article'} format - 광고 형식
 * @param {string} slot - 광고 슬롯 번호 (애드센스에서 생성)
 * @param {object} style - 추가 스타일
 */
export default function AdBanner({ format = 'auto', slot, style = {} }) {
    const adRef = useRef(null)
    const isLoaded = useRef(false)
    const [adAvailable, setAdAvailable] = useState(false)

    useEffect(() => {
        // 이미 로드된 광고는 다시 로드하지 않음
        if (isLoaded.current) return

        try {
            if (window.adsbygoogle && adRef.current) {
                window.adsbygoogle.push({})
                isLoaded.current = true

                // 광고 로드 후 실제 콘텐츠가 있는지 확인 (약간 딜레이)
                setTimeout(() => {
                    if (adRef.current) {
                        const adElement = adRef.current
                        const hasContent = adElement.getAttribute('data-ad-status') === 'filled'
                            || adElement.querySelector('iframe')
                            || adElement.childElementCount > 0
                        setAdAvailable(hasContent)
                    }
                }, 2000)
            }
        } catch (e) {
            console.log('AdSense load error:', e)
            setAdAvailable(false)
        }
    }, [])

    // 광고가 없으면 아무것도 렌더링하지 않음
    if (!adAvailable && isLoaded.current) return null

    return (
        <div style={{
            width: '100%',
            padding: '8px 0',
            display: adAvailable ? 'flex' : 'none',
            justifyContent: 'center',
            ...style
        }}>
            <div style={{
                width: '100%',
                maxWidth: '430px',
                minHeight: '100px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--color-border)',
                position: 'relative',
            }}>
                {/* 광고 라벨 */}
                <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '8px',
                    zIndex: 1,
                    fontSize: '8px',
                    color: 'var(--color-text-muted)',
                    opacity: 0.5,
                    fontFamily: "'Noto Sans KR', sans-serif",
                    letterSpacing: '1px',
                }}>
                    AD
                </div>

                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{
                        display: 'block',
                        width: '100%',
                        minHeight: '100px',
                    }}
                    data-ad-client="ca-pub-7176952059444763"
                    data-ad-slot={slot || ''}
                    data-ad-format={format}
                    data-full-width-responsive="true"
                />
            </div>
        </div>
    )
}
