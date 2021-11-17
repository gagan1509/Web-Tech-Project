const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const Location = new Schema(
  {
    title: String,
    keyword: {
      type: String,
      enum: [
        "Beaches",
        "Mountains",
        "RiverFronts",
        "Trekking",
        "OffBeat",
        "Castles",
        "Normal",
      ],
      deafault: "Normal",
    },
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

Location.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/locations/${this._id}">${this.title}</a></strong>`;
});

Location.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("location", Location);