from fastapi import FastAPI
from pydantic import BaseModel

from app.sentiment import analyze_sentiment
from app.recommendation import get_recommendations


app = FastAPI(
    title="MovieFlick Service",
    description="AI service for movie review analysis and recommendations",
    version="1.0.0"
)


class SentimentRequest(BaseModel):
    text: str


class RecommendationRequest(BaseModel):
    movies: list
    movie_id: int
    limit: int = 10


@app.get("/")
def root():
    return {
        "success": True,
        "message": "MovieFlick AI Service is running."
    }


@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "healthy"
    }


@app.post("/sentiment")
def sentiment_analysis(request: SentimentRequest):
    if not request.text.strip():
        return {
            "success": False,
            "message": "Review text is required."
        }

    result = analyze_sentiment(request.text)

    return {
        "success": True,
        "result": result
    }


@app.post("/recommendations")
def movie_recommendations(request: RecommendationRequest):

    if not request.movies:
        return {
            "success": False,
            "message": "Movie data is required."
        }

    if request.limit <= 0:
        return {
            "success": False,
            "message": "Recommendation limit must be greater than zero."
        }

    recommendations = get_recommendations(
        request.movies,
        request.movie_id,
        request.limit
    )

    return {
        "success": True,
        "movie_id": request.movie_id,
        "recommendations": recommendations
    }