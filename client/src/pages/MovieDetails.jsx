import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Bookmark,
    Heart,
    Pencil,
    Trash2,
    Save,
    X,
    Play,
    Smile,
    Frown,
    Meh,
    Bot,
    UserRound,
    Sparkles
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import MovieCard from "../components/MovieCard/MovieCard";
import { useAuth } from "../context/AuthContext";
import "./MovieDetails.css";

function MovieDetails() {
    const { id } = useParams();
    const { user } = useAuth();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewText, setReviewText] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState("");

    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editingReviewText, setEditingReviewText] = useState("");
    const [reviewActionLoading, setReviewActionLoading] = useState(false);

    const [recommendations, setRecommendations] = useState([]);
    const [recommendationsLoading, setRecommendationsLoading] = useState(true);
    const [recommendationsError, setRecommendationsError] = useState("");

    useEffect(() => {
        async function fetchMovie() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/movies/${id}`
                );

                if (!response.ok) {
                    throw new Error("Movie not found");
                }

                const data = await response.json();

                setMovie(data.movie);
            } catch (err) {
                console.error(err);
                setError("Unable to load movie details.");
            } finally {
                setLoading(false);
            }
        }

        fetchMovie();
    }, [id]);

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                setRecommendationsLoading(true);
                setRecommendationsError("");

                const response = await fetch(
                    `http://localhost:5000/api/recommendations/${id}?limit=10`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch recommendations."
                    );
                }

                const data = await response.json();

                setRecommendations(
                    data.recommendations || []
                );
            } catch (err) {
                console.error(
                    "Error fetching recommendations:",
                    err
                );

                setRecommendationsError(
                    "Unable to load recommendations."
                );
            } finally {
                setRecommendationsLoading(false);
            }
        }

        fetchRecommendations();
    }, [id]);

    useEffect(() => {
        async function fetchUserMovieStatus() {
            if (!user) {
                setIsFavorite(false);
                setIsInWatchlist(false);
                return;
            }

            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                const [favoriteResponse, watchlistResponse] =
                    await Promise.all([
                        fetch(
                            `http://localhost:5000/api/user-movies/favorites/${id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        ),
                        fetch(
                            `http://localhost:5000/api/user-movies/watchlist/${id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        )
                    ]);

                if (favoriteResponse.ok) {
                    const favoriteData =
                        await favoriteResponse.json();

                    setIsFavorite(favoriteData.isFavorite);
                }

                if (watchlistResponse.ok) {
                    const watchlistData =
                        await watchlistResponse.json();

                    setIsInWatchlist(
                        watchlistData.isInWatchlist
                    );
                }
            } catch (err) {
                console.error(
                    "Error checking movie status:",
                    err
                );
            }
        }

        fetchUserMovieStatus();
    }, [id, user]);

    useEffect(() => {
        async function fetchReviews() {
            try {
                setReviewsLoading(true);
                setReviewError("");

                const response = await fetch(
                    `http://localhost:5000/api/reviews/movie/${id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch reviews.");
                }

                const data = await response.json();

                setReviews(data.reviews);
            } catch (err) {
                console.error(
                    "Error fetching reviews:",
                    err
                );

                setReviewError("Unable to load reviews.");
            } finally {
                setReviewsLoading(false);
            }
        }

        fetchReviews();
    }, [id]);

    async function handleFavorite() {
        if (!user) {
            alert("Please login to manage favorites.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login again.");
            return;
        }

        try {
            setActionLoading(true);

            const url =
                `http://localhost:5000/api/user-movies/favorites/${id}`;

            const response = await fetch(url, {
                method: isFavorite ? "DELETE" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update favorite."
                );
            }

            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    }

    async function handleWatchlist() {
        if (!user) {
            alert("Please login to manage your watchlist.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login again.");
            return;
        }

        try {
            setActionLoading(true);

            const url =
                `http://localhost:5000/api/user-movies/watchlist/${id}`;

            const response = await fetch(url, {
                method: isInWatchlist ? "DELETE" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update watchlist."
                );
            }

            setIsInWatchlist(!isInWatchlist);
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    }

    async function handleReviewSubmit(event) {
        event.preventDefault();

        if (!user) {
            alert("Please login to write a review.");
            return;
        }

        if (!reviewText.trim()) {
            setReviewError(
                "Please write a review before submitting."
            );
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setReviewError("Please login again.");
            return;
        }

        try {
            setReviewSubmitting(true);
            setReviewError("");

            const response = await fetch(
                "http://localhost:5000/api/reviews",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        movie_id: Number(id),
                        review_text: reviewText.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to submit review."
                );
            }

            const newReviewResponse = await fetch(
                `http://localhost:5000/api/reviews/movie/${id}`
            );

            const newReviewData =
                await newReviewResponse.json();

            if (newReviewResponse.ok) {
                setReviews(newReviewData.reviews);
            }

            setReviewText("");
        } catch (err) {
            console.error(
                "Error submitting review:",
                err
            );

            setReviewError(err.message);
        } finally {
            setReviewSubmitting(false);
        }
    }

    function handleEditReview(review) {
        setEditingReviewId(review.review_id);
        setEditingReviewText(review.review_text);
        setReviewError("");
    }

    function handleCancelEdit() {
        setEditingReviewId(null);
        setEditingReviewText("");
    }

    async function handleUpdateReview(reviewId) {
        if (!editingReviewText.trim()) {
            setReviewError(
                "Review text cannot be empty."
            );
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setReviewError("Please login again.");
            return;
        }

        try {
            setReviewActionLoading(true);
            setReviewError("");

            const response = await fetch(
                `http://localhost:5000/api/reviews/${reviewId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        review_text:
                            editingReviewText.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update review."
                );
            }

            const updatedReviewsResponse =
                await fetch(
                    `http://localhost:5000/api/reviews/movie/${id}`
                );

            const updatedReviewsData =
                await updatedReviewsResponse.json();

            if (updatedReviewsResponse.ok) {
                setReviews(
                    updatedReviewsData.reviews
                );
            }

            handleCancelEdit();
        } catch (err) {
            console.error(
                "Error updating review:",
                err
            );

            setReviewError(err.message);
        } finally {
            setReviewActionLoading(false);
        }
    }

    async function handleDeleteReview(reviewId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setReviewError("Please login again.");
            return;
        }

        try {
            setReviewActionLoading(true);
            setReviewError("");

            const response = await fetch(
                `http://localhost:5000/api/reviews/${reviewId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete review."
                );
            }

            setReviews((currentReviews) =>
                currentReviews.filter(
                    (review) =>
                        review.review_id !== reviewId
                )
            );

            if (editingReviewId === reviewId) {
                handleCancelEdit();
            }
        } catch (err) {
            console.error(
                "Error deleting review:",
                err
            );

            setReviewError(err.message);
        } finally {
            setReviewActionLoading(false);
        }
    }

    function getSentimentIcon(sentiment) {
        if (sentiment === "Positive") {
            return (
                <Smile
                    size={16}
                    strokeWidth={2}
                />
            );
        }

        if (sentiment === "Negative") {
            return (
                <Frown
                    size={16}
                    strokeWidth={2}
                />
            );
        }

        if (sentiment === "Neutral") {
            return (
                <Meh
                    size={16}
                    strokeWidth={2}
                />
            );
        }

        return (
            <Bot
                size={16}
                strokeWidth={2}
            />
        );
    }

    function formatSentimentScore(score) {
        if (score === null || score === undefined) {
            return null;
        }

        return Number(score).toFixed(2);
    }

    function formatReleaseDate(dateString) {
        if (!dateString) {
            return "";
        }

        const date = new Date(dateString);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        });
    }

    function formatRuntime(minutes) {
        if (!minutes) {
            return "";
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${remainingMinutes}min`;
        }

        if (remainingMinutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${remainingMinutes}min`;
    }

    function formatReviewDate(dateString) {
        if (!dateString) {
            return "";
        }

        const date = new Date(dateString);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        });
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="movie-details-page">
                    <h2>Loading movie...</h2>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="movie-details-page">
                    <h2>{error}</h2>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div
                className="movie-details-page"
                style={{
                    backgroundImage:
                        movie.backdrop_url &&
                            movie.backdrop_url !== "NA" &&
                            movie.backdrop_url !== "NULL"
                            ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${movie.backdrop_url}')`
                            : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center top"
                }}
            >
                <div className="movie-details-container">
                    <div className="movie-details-top">

                        {movie.title === "Love Ni Bhavai" ? (
                            <div
                                style={{
                                    width: "280px",
                                    height: "410px",
                                    flexShrink: 0,
                                    borderRadius: "var(--radius)",
                                    overflow: "hidden",
                                    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.14)"
                                }}
                            >
                                <img
                                    className="movie-details-poster"
                                    src={
                                        movie.poster_url &&
                                            movie.poster_url !== "NA" &&
                                            movie.poster_url !== "NULL"
                                            ? movie.poster_url
                                            : "https://via.placeholder.com/300x450?text=No+Poster"
                                    }
                                    alt={movie.title}
                                    style={{ width: "100%", height: "100%", transform: "scale(1.06)", boxShadow: "none" }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "https://via.placeholder.com/300x450?text=No+Poster";
                                    }}
                                />
                            </div>
                        ) : (
                            <img
                                className="movie-details-poster"
                                src={
                                    movie.poster_url &&
                                        movie.poster_url !== "NA" &&
                                        movie.poster_url !== "NULL"
                                        ? movie.poster_url
                                        : "https://via.placeholder.com/300x450?text=No+Poster"
                                }
                                alt={movie.title}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://via.placeholder.com/300x450?text=No+Poster";
                                }}
                            />
                        )}

                        <div className="movie-details-content">

                            <h1 className="movie-details-title">
                                {movie.title}
                            </h1>

                            {movie.tagline && (
                                <p className="movie-details-tagline">
                                    {movie.tagline}
                                </p>
                            )}

                            <p className="movie-details-rating">
                                ⭐ {movie.imdb_rating} {movie.imdb_votes ? <span style={{ color: "#000000", fontSize: "15px", fontWeight: "600", marginLeft: "10px", opacity: 0.85 }}>({new Intl.NumberFormat('en-IN').format(movie.imdb_votes)} votes)</span> : ""}
                            </p>

                            <p className="movie-details-meta">
                                {formatReleaseDate(
                                    movie.release_date
                                )}
                                {" • "}
                                {formatRuntime(movie.runtime)}
                            </p>

                            <p className="movie-details-description">
                                {movie.description}
                            </p>

                            {user && (
                                <div className="movie-details-actions">
                                    <button
                                        className={`movie-action-button favorite-btn ${isFavorite
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={handleFavorite}
                                        disabled={actionLoading}
                                        title={
                                            isFavorite
                                                ? "Remove from Favorites"
                                                : "Add to Favorites"
                                        }
                                        aria-label={
                                            isFavorite
                                                ? "Remove from Favorites"
                                                : "Add to Favorites"
                                        }
                                    >
                                        <Heart
                                            size={24}
                                            strokeWidth={2}
                                            fill={
                                                isFavorite
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>

                                    <button
                                        className={`movie-action-button watchlist-btn ${isInWatchlist
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={handleWatchlist}
                                        disabled={actionLoading}
                                        title={
                                            isInWatchlist
                                                ? "Remove from Watchlist"
                                                : "Add to Watchlist"
                                        }
                                        aria-label={
                                            isInWatchlist
                                                ? "Remove from Watchlist"
                                                : "Add to Watchlist"
                                        }
                                    >
                                        <Bookmark
                                            size={24}
                                            strokeWidth={2}
                                            fill={
                                                isInWatchlist
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>
                                </div>
                            )}

                            <div className="movie-details-section">
                                <h3>Genres</h3>

                                <div className="movie-details-list">
                                    {movie.genres.map((genre) => (
                                        <span
                                            className="movie-details-item"
                                            key={genre.genre_id}
                                        >
                                            {genre.genre_name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="movie-details-section">
                                <h3>Languages</h3>

                                <div className="movie-details-list">
                                    {movie.languages.map((language) => (
                                        <span
                                            className="movie-details-item"
                                            key={language.language_id}
                                        >
                                            {language.language_name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="movie-details-section">
                                <h3>Director</h3>

                                <div className="movie-details-list">
                                    {movie.directors.map((director) => (
                                        <span
                                            className="movie-details-item"
                                            key={director.director_id}
                                        >
                                            {director.director_name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="movie-details-section cast-section">
                                <h3>Cast</h3>

                                {movie.cast && movie.cast.length > 0 ? (
                                    <div className="cast-grid">
                                        {movie.cast.map((actor) => (
                                            <div
                                                className="cast-card"
                                                key={`${actor.actor_id}-${actor.cast_order}`}
                                            >
                                                <div className="cast-image-wrapper">
                                                    {actor.profile_url &&
                                                        actor.profile_url !== "NA" &&
                                                        actor.profile_url !== "NULL" ? (
                                                        <>
                                                            <img
                                                                className="cast-image"
                                                                src={actor.profile_url}
                                                                alt={actor.actor_name}
                                                                onError={(e) => {
                                                                    e.target.style.display = "none";

                                                                    if (
                                                                        e.target.nextSibling
                                                                    ) {
                                                                        e.target.nextSibling.style.display =
                                                                            "flex";
                                                                    }
                                                                }}
                                                            />

                                                            <div
                                                                className="cast-image-fallback"
                                                                style={{
                                                                    display: "none"
                                                                }}
                                                            >
                                                                <UserRound
                                                                    size={34}
                                                                    strokeWidth={1.7}
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="cast-image-fallback">
                                                            <UserRound
                                                                size={34}
                                                                strokeWidth={1.7}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="cast-content">
                                                    <h4 className="cast-actor-name">
                                                        {actor.actor_name}
                                                    </h4>

                                                    {actor.character_name && (
                                                        <p className="cast-character">
                                                            {actor.character_name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>
                                        Cast details/data will be available soon, stay tuned!
                                    </p>
                                )}
                            </div>

                            {movie.trailers.length > 0 && (
                                <div className="movie-details-section">
                                    <h3>Trailers</h3>

                                    {movie.trailers.map((trailer) => (
                                        <div key={trailer.trailer_id}>
                                            <a
                                                className="movie-details-trailer"
                                                href={trailer.video_url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <Play
                                                    size={16}
                                                    strokeWidth={2}
                                                    fill="currentColor"
                                                />

                                                <span>
                                                    {trailer.title ||
                                                        "Watch Trailer"}
                                                </span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="movie-details-section reviews-section">
                                <h3>Reviews</h3>

                                {user && (
                                    <form
                                        className="review-form"
                                        onSubmit={handleReviewSubmit}
                                    >
                                        <textarea
                                            className="review-input"
                                            value={reviewText}
                                            onChange={(event) =>
                                                setReviewText(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Write your review..."
                                            rows="5"
                                        />

                                        <button
                                            type="submit"
                                            className="review-submit-button"
                                            disabled={
                                                reviewSubmitting
                                            }
                                        >
                                            {reviewSubmitting
                                                ? "Analyzing & Submitting..."
                                                : "Submit Review"}
                                        </button>

                                        {reviewError && (
                                            <p className="review-error">
                                                {reviewError}
                                            </p>
                                        )}
                                    </form>
                                )}

                                {!user && (
                                    <p
                                        className="review-login-message"
                                        style={{
                                            paddingBottom: "24px",
                                            marginBottom: "32px"
                                        }}
                                    >
                                        Please login to write a review.
                                    </p>
                                )}

                                {reviewsLoading && (
                                    <p>Loading reviews...</p>
                                )}

                                {!reviewsLoading &&
                                    reviewError &&
                                    !user && (
                                        <p className="review-error">
                                            {reviewError}
                                        </p>
                                    )}

                                {!reviewsLoading &&
                                    !reviewError &&
                                    reviews.length === 0 && (
                                        <p className="review-empty">
                                            No reviews yet.
                                        </p>
                                    )}

                                {!reviewsLoading &&
                                    reviews.length > 0 && (
                                        <div className="reviews-list">
                                            {reviews.map((review) => (
                                                <div
                                                    className="review-card"
                                                    key={review.review_id}
                                                >
                                                    <div className="review-header">
                                                        <div>
                                                            <strong>
                                                                {
                                                                    review.full_name
                                                                }
                                                            </strong>

                                                            <span>
                                                                {" • "}
                                                                {
                                                                    formatReviewDate(
                                                                        review.created_at
                                                                    )
                                                                }
                                                            </span>
                                                        </div>

                                                        {user &&
                                                            Number(
                                                                user.user_id
                                                            ) ===
                                                            Number(
                                                                review.user_id
                                                            ) && (
                                                                <div className="review-actions">
                                                                    {editingReviewId !==
                                                                        review.review_id && (
                                                                            <>
                                                                                <button
                                                                                    type="button"
                                                                                    className="review-icon-button review-edit-button"
                                                                                    onClick={() =>
                                                                                        handleEditReview(
                                                                                            review
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        reviewActionLoading
                                                                                    }
                                                                                    title="Edit review"
                                                                                    aria-label="Edit review"
                                                                                >
                                                                                    <Pencil
                                                                                        size={16}
                                                                                        strokeWidth={2}
                                                                                    />
                                                                                </button>

                                                                                <button
                                                                                    type="button"
                                                                                    className="review-icon-button review-delete-button"
                                                                                    onClick={() =>
                                                                                        handleDeleteReview(
                                                                                            review.review_id
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        reviewActionLoading
                                                                                    }
                                                                                    title="Delete review"
                                                                                    aria-label="Delete review"
                                                                                >
                                                                                    <Trash2
                                                                                        size={16}
                                                                                        strokeWidth={2}
                                                                                    />
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                </div>
                                                            )}
                                                    </div>

                                                    {editingReviewId ===
                                                        review.review_id ? (
                                                        <div className="review-edit-form">
                                                            <textarea
                                                                className="review-input"
                                                                value={
                                                                    editingReviewText
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setEditingReviewText(
                                                                        event.target.value
                                                                    )
                                                                }
                                                                rows="5"
                                                            />

                                                            <div className="review-edit-actions">
                                                                <button
                                                                    type="button"
                                                                    className="review-save-button"
                                                                    onClick={() =>
                                                                        handleUpdateReview(
                                                                            review.review_id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        reviewActionLoading
                                                                    }
                                                                    title="Save changes"
                                                                >
                                                                    <Save
                                                                        size={16}
                                                                        strokeWidth={2}
                                                                    />

                                                                    <span>
                                                                        {reviewActionLoading
                                                                            ? "Analyzing & Saving..."
                                                                            : "Save Changes"}
                                                                    </span>
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="review-cancel-button"
                                                                    onClick={
                                                                        handleCancelEdit
                                                                    }
                                                                    disabled={
                                                                        reviewActionLoading
                                                                    }
                                                                    title="Cancel editing"
                                                                >
                                                                    <X
                                                                        size={16}
                                                                        strokeWidth={2}
                                                                    />

                                                                    <span>
                                                                        Cancel
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="review-text">
                                                                {
                                                                    review.review_text
                                                                }
                                                            </p>

                                                            {review.sentiment && (
                                                                <div
                                                                    className={`review-sentiment sentiment-${review.sentiment.toLowerCase()}`}
                                                                >
                                                                    <span className="sentiment-label">
                                                                        {getSentimentIcon(
                                                                            review.sentiment
                                                                        )}

                                                                        <span>
                                                                            {
                                                                                review.sentiment
                                                                            }
                                                                        </span>
                                                                    </span>

                                                                    {formatSentimentScore(
                                                                        review.sentiment_score
                                                                    ) !== null && (
                                                                            <span className="sentiment-score">
                                                                                Score:{" "}
                                                                                {
                                                                                    formatSentimentScore(
                                                                                        review.sentiment_score
                                                                                    )
                                                                                }
                                                                            </span>
                                                                        )}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className="movie-details-section recommendations-section">
                        <div className="recommendations-heading">
                            <div>
                                <h3>Recommended For You</h3>
                                <p>
                                    Movies with similar content, genres, people and characters
                                </p>
                            </div>

                            <Sparkles
                                size={22}
                                strokeWidth={1.8}
                            />
                        </div>

                        {recommendationsLoading && (
                            <div className="recommendations-status">
                                <p>
                                    Finding movies you may like...
                                </p>
                            </div>
                        )}

                        {!recommendationsLoading &&
                            recommendationsError && (
                                <div className="recommendations-status">
                                    <p>
                                        {recommendationsError}
                                    </p>
                                </div>
                            )}

                        {!recommendationsLoading &&
                            !recommendationsError &&
                            recommendations.length === 0 && (
                                <div className="recommendations-status">
                                    <p>
                                        No recommendations available yet.
                                    </p>
                                </div>
                            )}

                        {!recommendationsLoading &&
                            !recommendationsError &&
                            recommendations.length > 0 && (
                                <div className="recommendations-grid">
                                    {recommendations.map(
                                        (recommendedMovie) => (
                                            <MovieCard
                                                key={
                                                    recommendedMovie.movie_id
                                                }
                                                movie={
                                                    recommendedMovie
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}

export default MovieDetails;