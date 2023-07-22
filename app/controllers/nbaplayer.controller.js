const db = require("../models");
const NbaPlayerSeason = db.nbaplayer;

require("dotenv").config();

// GET
exports.getNbaPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    // Limiting and data-pgination
    const { limit = 100, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const getSingleNbaPlayer = await NbaPlayerSeason.find({ _id: id })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!getSingleNbaPlayer) {
      throw new Error("Failed to retrieve Player Stats.");
    }

    res.json({
      ncaaPlayer: getSingleNbaPlayer,
      numItems: getSingleNbaPlayer.length,
    });
  } catch (error) {
    res.json(error);
  }
};
