const db = require("../models");
const NbaTeam = db.nbateam;
const NbaPlayer = db.nbaplayer;
require("dotenv").config();

// GET
exports.getNbaTeams = async (req, res) => {
  try {
    // Limiting and data-pgination
    const { limit = 100, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const getAllNbaTeams = await NbaTeam.find({})
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!getAllNbaTeams) {
      throw new Error("Failed to retrieve NBA Teams.");
    }

    res.json({
      nbaTeams: getAllNbaTeams,
      numItems: getAllNbaTeams.length,
    });
  } catch (error) {
    res.json(error);
  }
};

// GET
exports.getNbaTeam = async (req, res) => {
  try {
    const { teamName } = req.params;
    const getNbaTeam = await NbaTeam.find({ Team: teamName });

    if (!getNbaTeam) {
      throw new Error("Failed to retrieve NCAA Team");
    }

    res.json({
      nbaTeam: getNbaTeam,
      numItems: getNbaTeam.length,
    });
  } catch (e) {
    res.json(error);
  }
};

// GET
exports.getNbaTeamRoster = async (req, res) => {
  try {
    // Limiting and data-pgination
    const { limit = 100, page = 1 } = req.query;
    const teamName = req.params.team;

    const skip = (page - 1) * limit;

    const getNbaTeamRoster = await NbaPlayer.find({ Team: teamName })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!getNbaTeamRoster) {
      throw new Error("Failed to retrieve NCAA Team Roster.");
    }

    res.json({
      teamRoster: getNbaTeamRoster,
      numItems: getNbaTeamRoster.length,
    });
  } catch (error) {
    res.json(error);
  }
};
