const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.get(
    "/movie/:movieId",
    reviewController.getReviewsByMovie
);

router.post(
    "/",
    authenticate,
    reviewController.addReview
);

router.put(
    "/:reviewId",
    authenticate,
    reviewController.updateReview
);

router.delete(
    "/:reviewId",
    authenticate,
    reviewController.deleteReview
);

module.exports = router;