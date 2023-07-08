/* eslint-disable strict */
const cors = require("cors");
const controller = require("../controllers/ncaateams.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/ncaa-d1-mens-teams", cors(), controller.getNcaaTeams);

  // Get single NCAA team
  app.get("/api/ncaa-d1-mens-teams/:teamName", cors(), controller.getNcaaTeam);

  // Queries MongoDB database for players by team
  app.get(
    "/api/ncaa-d1-mens-team/:team",
    cors(),
    controller.getNcaaTeamRoster
  );
};
