const AI_SERVICE_URL =
    process.env.ai_service_url ||
    "http://localhost:8000";

async function getRecommendations(
    movies,
    movieId,
    limit = 10
) {
    const response = await fetch(
        `${AI_SERVICE_URL}/recommendations`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                movies,
                movie_id: Number(movieId),
                limit: Number(limit)
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to get recommendations from AI service."
        );
    }

    return data.recommendations || [];
}

module.exports = {
    getRecommendations
};