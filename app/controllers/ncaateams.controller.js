const db = require("../models");
const NcaaTeam = db.ncaateam;
require("dotenv").config();
const { camelCase } = require("lodash");
const mongoose = require("mongoose");

// GET
// TODO: Add team Id for this
exports.getNcaaTeams = async (req, res) => {
  try {
    // Limiting and data-pgination
    const { limit = 100, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const getAllNcaaTeams = await NcaaTeam.find({})
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!getAllNcaaTeams) {
      throw new Error("Failed to retrieve NCAA Teams.");
    }

    res.json({
      ncaaTeams: getAllNcaaTeams,
      numItems: getAllNcaaTeams.length,
    });
  } catch (error) {
    res.json(error);
  }
};

// TODO: Add GETS for all data here
