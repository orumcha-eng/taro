import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    try {
        // 1~7번 마스터의 키 생성 (master_1, master_2 ...)
        const keys = Array.from({ length: 7 }, (_, i) => `master_${i + 1}`);

        // Redis에서 값 읽어오기 (없으면 null 반환)
        const values = await kv.mget(...keys);

        // { id: 1, count: 123 } 형태의 배열로 변환
        const ranking = keys.map((key, index) => ({
            id: index + 1,
            count: values[index] || 0
        }));

        return response.status(200).json({ ranking });
    } catch (error) {
        console.error('Redis Error:', error);
        // 에러 나도 프론트엔드가 안 죽게 빈 배열 반환
        return response.status(500).json({ ranking: [] });
    }
}
