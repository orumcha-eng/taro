export async function getRanking() {
    try {
        // Vercel Serverless Function 호출
        const response = await fetch('/api/ranking')
        if (!response.ok) return []
        const data = await response.json()
        return data.ranking || []
    } catch (error) {
        console.error('Ranking fetch error:', error)
        return []
    }
}

export async function incrementConsultation(id) {
    try {
        // 투표수 증가 요청 (결과 안 기다림)
        fetch(`/api/increment?id=${id}`)
    } catch (error) {
        console.error('Increment error:', error)
    }
}
