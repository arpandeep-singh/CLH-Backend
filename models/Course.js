const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    author: {
      type: String,
      required: [true, "Please add authors name"],
    },
    provider: {
      type: String,
      default: "Other",
      enum: ["Udemy", "CourseEra", "Other"],
    },
    cost: {
      type: Number,
      required: [true, "Please add a tuition cost"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: [5, "Rating must can not be more than 5"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CourseSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "course",
  justOne: false,
});

// Static method to get avg of course tuitions
// CourseSchema.statics.getAverageCost = async function (bootcampId) {
//   const obj = await this.aggregate([
//     {
//       $match: { bootcamp: bootcampId },
//     },
//     {
//       $group: {
//         _id: "$bootcamp",
//         averageCost: { $avg: "$tuition" },
//       },
//     },
//   ]);

//   try {
//     await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
//       averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

// // Call getAverageCost after save
// CourseSchema.post("save", function () {
//   this.constructor.getAverageCost(this.bootcamp);
// });

// // Call getAverageCost before remove
// CourseSchema.pre("remove", function () {
//   this.constructor.getAverageCost(this.bootcamp);
// });

module.exports = mongoose.model("Course", CourseSchema);
