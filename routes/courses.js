const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");

const reviewsRouter = require("./reviews");
const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
router.use("/:courseId/reviews", reviewsRouter);

router
  .route("/")
  .get(
    advancedResults(Course, [
      {
        path: "category",
        select: "name slug",
      },
      { path: "reviews" },
    ]),
    getCourses
  )
  .post(protect, authorize("admin"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("admin"), updateCourse)
  .delete(protect, authorize("admin"), deleteCourse);

module.exports = router;
