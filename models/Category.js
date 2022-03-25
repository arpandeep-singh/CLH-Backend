const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create category slug from the name
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete courses when a category is deleted
CategorySchema.pre("remove", async function (next) {
  console.log(`Courses being removed from category ${this._id} ${this.name}`);
  await this.model("Course").deleteMany({ category: this._id });
  next();
});

// Reverse populate with virtuals
CategorySchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

module.exports = mongoose.model("Category", CategorySchema);
