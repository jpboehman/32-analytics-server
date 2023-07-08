const db = require("../models");
const NcaaPlayer = db.ncaaplayer;
require("dotenv").config();

// GET
// TODO: Add team Id for this
exports.getNcaaPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    // Limiting and data-pgination
    const { limit = 100, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const getSingleNcaaPlayer = await NcaaPlayer.find({ _id: id })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!getSingleNcaaPlayer) {
      throw new Error("Failed to retrieve Player Stats.");
    }

    res.json({
      ncaaPlayer: getSingleNcaaPlayer,
      numItems: getSingleNcaaPlayer.length,
    });
  } catch (error) {
    res.json(error);
  }
};
