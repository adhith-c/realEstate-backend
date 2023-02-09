const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const SavedSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  Items: [
    {
      propertyId: {
        type: ObjectId,
        ref: "Property",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Saved", SavedSchema);
