const mongoose = require("mongoose");

// Allowing keys to be dynamic based on uploaded data
const fieldSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    value: String,
  },
  { _id: false }
);

const NcaaPlayer = mongoose.model(
  "ncaaplayerseason",
  new mongoose.Schema(
    {
      // userId: { type: String },
      fields: [fieldSchema],
    },
    { collection: "ncaaplayerseason" }
  )
);

module.exports = NcaaPlayer;
