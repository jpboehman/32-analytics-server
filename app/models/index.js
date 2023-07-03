const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");

// 32A Models
db.gamegrades = require("./gamegrades.model");
db.ncaaleague = require("./ncaaleague.model");
db.ncaaplayer = require("./ncaaplayer.model");
db.ncaaplayerleague = require("./ncaaplayerleague.model");
db.ncaateam = require("./ncaateam.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
