const mongoose = require('mongoose');

// Allowing keys to be dynamic based on uploaded data
const fieldSchema = new mongoose.Schema(
    {
      name: String,
      type: String,
      value: String,
    },
    { _id: false }
  );
  
  const NbaGameGrades = mongoose.model(
    'nbaplayergamegrades',
    new mongoose.Schema(
      {
        // userId: { type: String },
        fields: [fieldSchema],
      },
      { collection: 'nbaplayergamegrades' }
    )
  );
  

module.exports = NbaGameGrades;
