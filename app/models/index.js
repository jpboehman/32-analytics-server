const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");

// 32A Models
db.gamegrades = require("./gamegrades.model");
db.nbagamegrades = require("./nbagamegrades.model");
db.ncaaleague = require("./ncaaleague.model");
db.ncaaplayer = require("./ncaaplayer.model");
db.nbaplayer = require("./nbaplayer.model");
db.ncaaplayerleague = require("./ncaaplayerleague.model");
db.nbaplayerleague = require("./nbaplayerleague.model");
db.ncaateam = require("./ncaateam.model");
db.nbateam = require("./nbateam.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
