import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    try {
        const { id } = request.query;

        if (!id) {
            return response.status(400).json({ error: 'Missing master ID' });
        }

        // 해당 마스터 카운트 1 증가
        const key = `master_${id}`;
        const newCount = await kv.incr(key);

        return response.status(200).json({ count: newCount });
    } catch (error) {
        console.error('Redis Increment Error:', error);
        return response.status(500).json({ error: 'Failed to increment' });
    }
}
