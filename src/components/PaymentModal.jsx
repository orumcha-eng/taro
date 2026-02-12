import { useState, useEffect } from 'react'

export default function PaymentModal({ master, onClose, onSuccess }) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // 모달 외부 클릭 시 닫기
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isProcessing && !showSuccess) {
            onClose()
        }
    }

    const handlePayment = (method) => {
        setIsProcessing(true)
        // 결제 처리 시뮬레이션 (1.5초)
        setTimeout(() => {
            setIsProcessing(false)
            setShowSuccess(true)
            // 성공 화면 1.5초 후 완료 처리
            setTimeout(() => {
                onSuccess()
            }, 1500)
        }, 1500)
    }

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'flex-end', // 바텀 시트 스타일
                justifyContent: 'center',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <div
                className="animate-slide-up"
                style={{
                    width: '100%',
                    maxWidth: '430px',
                    background: '#ffffff',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                    padding: '24px 20px 40px',
                    position: 'relative'
                }}
            >
                {!showSuccess ? (
                    <>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#191f28' }}>결제하기</h3>
                            {!isProcessing && (
                                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', color: '#b0b8c1', cursor: 'pointer' }}>
                                    &times;
                                </button>
                            )}
                        </div>

                        {/* Product Info */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#8b95a1', fontSize: '14px' }}>상품명</span>
                                <span style={{ color: '#333d4b', fontSize: '14px', fontWeight: 500 }}>{master.name} 타로 상담</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#8b95a1', fontSize: '14px' }}>결제 금액</span>
                                <span style={{ color: '#3182f6', fontSize: '20px', fontWeight: 700 }}>{master.price.toLocaleString()}원</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={() => handlePayment('toss')}
                                disabled={isProcessing}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: '#3182f6',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    cursor: isProcessing ? 'default' : 'pointer',
                                    opacity: isProcessing ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isProcessing ? '결제 처리 중...' : 'Toss 결제하기'}
                            </button>

                            <button
                                onClick={() => handlePayment('card')}
                                disabled={isProcessing}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: '#f2f4f6',
                                    border: 'none',
                                    color: '#4e5968',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    cursor: isProcessing ? 'default' : 'pointer',
                                    opacity: isProcessing ? 0.7 : 1
                                }}
                            >
                                카드 결제
                            </button>
                        </div>
                    </>
                ) : (
                    /* Success State */
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#3182f6',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            margin: '0 auto 20px'
                        }}>
                            ✓
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#191f28', marginBottom: '8px' }}>결제 성공!</h3>
                        <p style={{ color: '#8b95a1', fontSize: '14px' }}>잠시 후 타로 리딩이 시작됩니다...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
