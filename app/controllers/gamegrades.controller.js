const db = require("../models");
const GameGrades = db.gamegrades;
require("dotenv").config();
const { camelCase } = require("lodash");
const mongoose = require("mongoose");

// POST
exports.uploadGameGrades = async (req, res) => {
  try {
    const userId = req.params.userId;
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
      return { fields, userId };
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
    const userId = req.params.userId;
    const getAllGameGrades = await GameGrades.find({ userId }).exec();
    if (!getAllGameGrades) throw new Error("Failed to retrieve Game grades.");
    res.json({
      gameGrades: getAllGameGrades,
      numItems: getAllGameGrades.length,
    });
  } catch (error) {
    res.json(error);
  }
};
