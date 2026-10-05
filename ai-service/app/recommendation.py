import re

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def normalize_text(value):
    if value is None:
        return ""

    value = str(value).lower()

    value = re.sub(r"[^a-z0-9\s]", " ", value)
    value = re.sub(r"\s+", " ", value)

    return value.strip()


def build_movie_text(movie):
    description = normalize_text(movie.get("description"))

    genres = " ".join(
        normalize_text(genre.get("genre_name"))
        for genre in movie.get("genres", [])
    )

    languages = " ".join(
        normalize_text(language.get("language_name"))
        for language in movie.get("languages", [])
    )

    directors = " ".join(
        normalize_text(director.get("director_name"))
        for director in movie.get("directors", [])
    )

    actors = " ".join(
        normalize_text(actor.get("actor_name"))
        for actor in movie.get("cast", [])
    )

    characters = " ".join(
        normalize_text(actor.get("character_name"))
        for actor in movie.get("cast", [])
    )

    return " ".join(
        part
        for part in [
            description,
            genres,
            languages,
            directors,
            actors,
            characters
        ]
        if part
    )


def build_feature_matrix(movies):
    movie_texts = [
        build_movie_text(movie)
        for movie in movies
    ]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        min_df=1
    )

    matrix = vectorizer.fit_transform(movie_texts)

    return matrix


def calculate_similarity(movies):
    matrix = build_feature_matrix(movies)

    similarity_matrix = cosine_similarity(matrix)

    return similarity_matrix


def get_recommendations(movies, movie_id, limit=10):
    if not movies:
        return []

    target_index = None

    for index, movie in enumerate(movies):
        if int(movie["movie_id"]) == int(movie_id):
            target_index = index
            break

    if target_index is None:
        return []

    similarity_matrix = calculate_similarity(movies)

    similarity_scores = similarity_matrix[target_index]

    ranked_indices = np.argsort(
        similarity_scores
    )[::-1]

    recommendations = []

    for index in ranked_indices:

        if index == target_index:
            continue

        movie = movies[index]

        recommendation = {
            "movie_id": movie["movie_id"],
            "title": movie["title"],
            "poster_url": movie.get("poster_url"),
            "release_date": movie.get("release_date"),
            "imdb_rating": movie.get("imdb_rating"),
            "similarity_score": round(
                float(similarity_scores[index]),
                4
            )
        }

        recommendations.append(recommendation)

        if len(recommendations) >= limit:
            break

    return recommendations