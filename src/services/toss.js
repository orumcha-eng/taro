import { IAP } from '@apps-in-toss/web-bridge'

/**
 * Toss IAP 결제 요청
 * @param {string} productSku - 상품 ID (SKU)
 * @returns {Promise<{supported: boolean, cleanup?: function}>} 
 * supported: true면 Toss IAP 실행됨, false면 실행 실패(브라우저 등) -> 폴백 UI 사용 필요
 */
export function requestTossIAP(productSku, { onSuccess, onFailure }) {
    try {
        // Toss App 환경인지 확인 (간단한 체크)
        // 실제로는 IAP 호출 시 에러가 나면 브라우저로 간주

        console.log('🚀 Toss IAP 요청 시작:', productSku)

        const cleanup = IAP.createOneTimePurchaseOrder({
            options: {
                sku: productSku,
                // 상품 지급 로직: 서버 검증이 원칙이나, 개인 개발자 모드에서는 클라이언트 승인 처리
                processProductGrant: async ({ orderId }) => {
                    console.log(`✅ 상품 지급 처리 중 (OrderId: ${orderId})`)
                    // TODO: 실제 서버가 있다면 여기서 API 호출하여 검증
                    return true
                }
            },
            onEvent: (event) => {
                if (event.type === 'success') {
                    console.log('🎉 Toss IAP 결제 성공:', event.data)
                    // cleanup은 호출자/이벤트 핸들러에서 수행
                    cleanup()
                    onSuccess(event.data)
                }
            },
            onError: (error) => {
                console.error('🚨 Toss IAP 결제 실패/취소:', error)
                cleanup()
                onFailure(error)
            }
        })

        return { supported: true, cleanup }

    } catch (error) {
        console.warn('⚠️ Toss IAP를 사용할 수 없는 환경입니다 (브라우저 등). 시뮬레이션 모드로 전환합니다.', error)
        return { supported: false }
    }
}
