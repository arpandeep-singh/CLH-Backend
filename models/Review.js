const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  // title: {
  //   type: String,
  //   trim: true,
  //   required: [false, "Please add a title for the review"],
  //   maxlength: 100,
  // },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, "Please add a rating between 1 and 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please add name"],
  },
  email: {
    type: String,
    required: [false, "Please add email"],
  },
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
});

// Prevent user from submitting more than one review per course
ReviewSchema.index({ course: 1, name: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (courseId) {
  const obj = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Course").findByIdAndUpdate(courseId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.course);
});

// Call getAverageCost before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.course);
});

module.exports = mongoose.model("Review", ReviewSchema);
