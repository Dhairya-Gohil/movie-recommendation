from fastapi import FastAPI
from pydantic import BaseModel

from app.sentiment import analyze_sentiment


app = FastAPI(
    title="MovieAI Service",
    description="AI service for movie review analysis and recommendations",
    version="1.0.0"
)


class SentimentRequest(BaseModel):
    text: str


@app.get("/")
def root():
    return {
        "success": True,
        "message": "MovieAI AI Service is running."
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