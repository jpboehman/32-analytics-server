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

const NcaaTeams = mongoose.model(
  "NcaaTeams",
  new mongoose.Schema(
    {
      // userId: { type: String },
      fields: [fieldSchema],
    },
    { collection: "ncaateams" }
  )
);

module.exports = NcaaTeams;
