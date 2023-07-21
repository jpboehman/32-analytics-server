/* eslint-disable strict */
const cors = require("cors");
const controller = require("../controllers/nbateams.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/nba-teams", cors(), controller.getNbaTeams);

  // Get single NCAA team
  app.get("/api/nba-teams/:teamName", cors(), controller.getNbaTeam);

  // Queries MongoDB database for players by team
  app.get(
    "/api/nba-team/:team",
    cors(),
    controller.getNbaTeamRoster
  );
};
