const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    listingType: {
      type: String,
      required: true,
    },
    views: {
      type: String,
    },
    rooms: {
      type: Number,
      required: true,
    },
    bathRooms: {
      type: Number,
      required: true,
    },
    HalfBathRooms: {
      type: Number,
      required: true,
    },
    squareFoot: {
      type: Number,
      required: true,
    },
    yearBuilt: {
      type: String,
    },
    Description: {
      type: String,
      required: true,
    },

    lattitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    zoom: {
      type: Number,
      required: true,
    },
    image: [String],
    isSold: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userMail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
// PropertySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Property", PropertySchema);
