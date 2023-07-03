/* eslint-disable strict */
const cors = require("cors");
const controller = require("../controllers/gamegrades.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/ncaa-d1-mens-game-grades", cors(), controller.getGameGrades);

  app.post(
    "/api/ncaa-d1-mens/upload-game-grades",
    cors(),
    controller.uploadGameGrades
  );
};
