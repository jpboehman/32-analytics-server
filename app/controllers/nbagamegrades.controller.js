const db = require("../models");
const NbaGameGrades = db.nbagamegrades;
require("dotenv").config();
const { camelCase } = require("lodash");
const mongoose = require("mongoose");

// POST
exports.uploadGameGrades = async (req, res) => {
  try {
    const columns = Object.keys(req.body[0]).map((column) => camelCase(column));
    const gameGrades = req.body.map((row) => {
      const grade = {};
      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call(row, key)) {
          grade[camelCase(key)] = row[key];
        }
      }
      const fields = columns.map((column) => {
        return {
          name: column,
          type: typeof grade[column],
          value: grade[column] || null,
        };
      });
      return { fields };
    });
    const insertGameGrades = await GameGrades.insertMany(gameGrades);
    if (insertGameGrades.length === 0)
      throw new Error("Failed to insert Game Grades.");
    res.json({ message: "Successfully imported Game Grades" });
  } catch (error) {
    res.json(error);
  }
};

// GET
exports.getGameGrades = async (req, res) => {
  try {
    const { playerName, selectedSeason = "2022-23" } = req.params;
    const { limit = 100, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    // CURRENT:
    // Waiting for Season to get added to DB collection as a column
    const getGameGrades = await NbaGameGrades.find({
      Player: playerName,
      Season: selectedSeason,
    })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!getGameGrades) {
      throw new Error("Failed to retrieve Game Grades.");
    }

    res.json({
      gameGrades: getGameGrades,
      numItems: getGameGrades.length,
    });
  } catch (error) {
    res.json(error);
  }
};
