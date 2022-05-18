const express = require("express");
const {
  createTour,
  getTour,
  getSingleTour,
  getToursByUser,
  deleteTour,
  updateTour,
  getTourBySearch,
  getTourByTag,
  getRelatedToursByTag,
  updateLikeTour,
} = require("../controllers/tourController");
const auth = require("../middlewares/authentication");
const router = express.Router();

router.post("/relatedTours", getRelatedToursByTag);
router.get("/q", getTourBySearch);
router.get("/tag/:tag", getTourByTag);
router.get("/", getTour);

router.get("/:id", getSingleTour);
router.post("/", auth, createTour);
router.get("/userTours/:id", auth, getToursByUser);
router.patch("/:id", auth, updateTour);
router.delete("/:id", auth, deleteTour);
router.patch("/like/:id", auth, updateLikeTour);

module.exports = router;
