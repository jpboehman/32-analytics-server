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

const NcaaTeam = mongoose.model(
  "NcaaTeams",
  new mongoose.Schema(
    {
      // userId: { type: String },
      fields: [fieldSchema],
    },
    { collection: "ncaateam" }
  )
);

module.exports = NcaaTeam;
