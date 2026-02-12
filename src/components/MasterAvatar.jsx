import { useState, useEffect } from 'react'

// 프리미엄 캐릭터 아바타 컴포넌트
// 기본: public/images/master_{id}.png (사용자 업로드)
// 폴백: DiceBear Adventurer/Lorelei 스타일 아바타 API
const avatarConfig = {
    1: { // 루나 - 연애 전문
        seed: 'Luna-mystic-tarot',
        style: 'adventurer',
        bgColor: '#ff4da6',
        glow: 'rgba(255,77,166,0.5)',
    },
    2: { // 태오 - 금전 전문
        seed: 'Taeoh-gold-finance',
        style: 'adventurer',
        bgColor: '#ffd700',
        glow: 'rgba(255,215,0,0.5)',
    },
    3: { // 하늘 - 이동운 전문
        seed: 'Haneul-sky-travel',
        style: 'adventurer',
        bgColor: '#00e5ff',
        glow: 'rgba(0,229,255,0.5)',
    },
    4: { // 지호 - 시험운 전문
        seed: 'Jiho-mentor-study',
        style: 'adventurer',
        bgColor: '#7c4dff',
        glow: 'rgba(124,77,255,0.5)',
    },
    5: { // 세이라 - 전생 전문
        seed: 'Seira-oracle-moon',
        style: 'lorelei',
        bgColor: '#9933ea',
        glow: 'rgba(153,51,234,0.5)',
    },
    6: { // 봄이 - 펫 전문
        seed: 'Bomi-spring-pet',
        style: 'adventurer',
        bgColor: '#ff8a65',
        glow: 'rgba(255,138,101,0.5)',
    },
    7: { // 비비 - 이미지 전문
        seed: 'Vivi-mirror-style',
        style: 'lorelei',
        bgColor: '#f06292',
        glow: 'rgba(240,98,146,0.5)',
    },
}

function getAvatarUrl(config, size) {
    const s = Math.round(size * 2) // 2x for retina
    return `https://api.dicebear.com/9.x/${config.style}/svg?seed=${config.seed}&size=${s}&backgroundColor=transparent`
}

export function MasterAvatar({ masterId, size = 56 }) {
    const config = avatarConfig[masterId]
    if (!config) return null

    const imgSize = size * 0.85

    // 우선 로컬 이미지 시도 -> 실패 시 DiceBear 폴백
    const [imgSrc, setImgSrc] = useState(`/images/master_${masterId}.png`)

    useEffect(() => {
        setImgSrc(`/images/master_${masterId}.png`)
    }, [masterId])

    const handleError = () => {
        // 이미 폴백 상태면 중단 (무한 루프 방지)
        if (imgSrc.includes('api.dicebear.com')) return

        // 로컬 이미지 로드 실패 시 DiceBear로 전환
        setImgSrc(getAvatarUrl(config, imgSize))
    }

    return (
        <div style={{
            width: `${size}px`,
            height: `${size * 1.15}px`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
            {/* 외곽 글로우 */}
            <div style={{
                position: 'absolute',
                width: `${imgSize}px`,
                height: `${imgSize}px`,
                borderRadius: '50%',
                background: config.bgColor,
                filter: `blur(${size * 0.18}px)`,
                opacity: 0.3,
            }} />

            {/* 메인 원형 아바타 */}
            <div style={{
                width: `${imgSize}px`,
                height: `${imgSize}px`,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${config.bgColor}33, ${config.bgColor}15)`,
                border: `2px solid ${config.bgColor}88`,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: `0 0 ${size * 0.25}px ${config.glow}, inset 0 0 ${size * 0.1}px rgba(255,255,255,0.05)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img
                    src={imgSrc}
                    onError={handleError}
                    alt=""
                    width={imgSize}
                    height={imgSize}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scale(1.1)',
                    }}
                    loading="lazy"
                />
            </div>
        </div>
    )
}
