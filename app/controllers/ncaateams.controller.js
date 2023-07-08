const db = require("../models");
const NcaaTeam = db.ncaateam;
const NcaaPlayer = db.ncaaplayer;
require("dotenv").config();

// GET
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

// GET
exports.getNcaaTeam = async (req, res) => {
  try {
    const { teamName } = req.params;
    const getNcaaTeam = await NcaaTeam.find({ Team: teamName });

    if (!getNcaaTeam) {
      throw new Error("Failed to retrieve NCAA Team");
    }

    res.json({
      ncaaTeam: getNcaaTeam,
      numsItems: getNcaaTeam.length,
    });
  } catch (e) {
    res.json(error);
  }
};

// GET
// TODO: Add team Id for this
exports.getNcaaTeamRoster = async (req, res) => {
  try {
    // Limiting and data-pgination
    const { limit = 100, page = 1 } = req.query;
    const teamName = req.params.team;

    const skip = (page - 1) * limit;

    const getNcaaTeamRoster = await NcaaPlayer.find({ Team: teamName })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    // TODO: Send back data for team to display in banner - see if this works
    const getNcaaTeamBanner = await NcaaTeam.find({ Team: teamName })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!getNcaaTeamRoster) {
      throw new Error("Failed to retrieve NCAA Team Roster.");
    }

    res.json({
      teamRoster: getNcaaTeamRoster,
      numItems: getNcaaTeamRoster.length,
    });
  } catch (error) {
    res.json(error);
  }
};
