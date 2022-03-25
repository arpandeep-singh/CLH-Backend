const express = require("express");
const {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

const Category = require("../models/Category");

// Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:categoryId/courses", courseRouter);
router.use("/:courseId/reviews", reviewRouter);

// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Category, "courses"), getCategories)
  .post(protect, authorize("admin"), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;
