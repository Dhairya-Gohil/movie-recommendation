const express = require("express");

const recommendationController = require("../controllers/recommendationController");

const router = express.Router();

router.get(
    "/:movie_id",
    recommendationController.getRecommendations
);

module.exports = router;