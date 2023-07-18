const db = require("../models");
const NcaaPlayerSeason = db.ncaaplayer;
const GameGrades = db.gamegrades;

require("dotenv").config();

// GET
exports.getNcaaPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    // Limiting and data-pgination
    const { limit = 100, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const getSingleNcaaPlayer = await NcaaPlayerSeason.find({ _id: id })
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
