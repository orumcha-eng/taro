import { IAP } from '@apps-in-toss/web-bridge'

/**
 * Toss IAP 결제 요청
 * @param {string} productSku - 상품 ID (SKU)
 * @returns {Promise<{supported: boolean, cleanup?: function}>} 
 * supported: true면 Toss IAP 실행됨, false면 실행 실패(브라우저 등) -> 폴백 UI 사용 필요
 */
export function requestTossIAP(productSku, { onSuccess, onFailure }) {
    // Force Simulation Mode (사업자 등록 전까지 시뮬레이션 모드로 작동)
    console.warn('⚠️ Force Simulation Mode: Real IAP disabled.')
    return { supported: false }
}
