const db = require("../models");
const NcaaPlayerLeague = db.ncaaplayerleague;
require("dotenv").config();
const { camelCase } = require("lodash");
const mongoose = require("mongoose");

// GET
exports.getNcaaPlayerLeague = async (req, res) => {
  try {
    // Limiting and data-pgination
    const { limit = 100, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const getNcaaPlayerLeague = await NcaaPlayerLeague.find({})
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!getNcaaPlayerLeague) {
      throw new Error("Failed to retrieve League Players.");
    }

    res.json({
      ncaaPlayerLeague: getNcaaPlayerLeague,
      numItems: getNcaaPlayerLeague.length,
    });
  } catch (error) {
    res.json(error);
  }
};

// GET
exports.getSingleNcaaPlayerLeague = async (req, res) => {
  try {
    const { playerId } = req.params;

    const getNcaaPlayerLeague = await NcaaPlayerLeague.find({
      _id: playerId,
    }).exec();

    if (!getNcaaPlayerLeague) {
      throw new Error("Failed to retrieve League Players.");
    }

    res.json({
      ncaaPlayerLeague: getNcaaPlayerLeague,
      numItems: getNcaaPlayerLeague.length,
    });
  } catch (error) {
    res.json(error);
  }
};
