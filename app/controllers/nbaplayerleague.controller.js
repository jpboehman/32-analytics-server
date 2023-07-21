const db = require("../models");
const NbaPlayerLeague = db.nbaplayerleague;
require("dotenv").config();
const { camelCase } = require("lodash");
const mongoose = require("mongoose");

// GET
exports.getNbaPlayerLeague = async (req, res) => {
  try {
    // Limiting and data-pgination
    const { limit = 100, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const getNbaPlayerLeague = await NbaPlayerLeague.find({})
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!getNbaPlayerLeague) {
      throw new Error("Failed to retrieve League Players.");
    }

    res.json({
      nbaPlayerLeague: getNbaPlayerLeague,
      numItems: getNbaPlayerLeague.length,
    });
  } catch (error) {
    res.json(error);
  }
};

// GET
exports.getSingleNbaPlayerLeague = async (req, res) => {
  try {
    const { playerId } = req.params;

    const getNbaPlayerLeague = await NbaPlayerLeague.find({
      _id: playerId,
    }).exec();

    if (!getNbaPlayerLeague) {
      throw new Error("Failed to retrieve League Players.");
    }

    res.json({
      getNbaPlayerLeague: getNbaPlayerLeague,
      numItems: getNbaPlayerLeague.length,
    });
  } catch (error) {
    res.json(error);
  }
};
