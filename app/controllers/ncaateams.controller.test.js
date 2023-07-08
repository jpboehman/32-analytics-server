// Functional tests with MongoDB server
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../server"); // import your express app

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri =
    "mongodb+srv://testUser:NotAVacation8715@cluster0.1gzw38k.mongodb.net/test";
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("GET /api/ncaa-d1-mens-teams", () => {
  it("should return all NCAA teams", async () => {
    const res = await request(app).get("/api/ncaa-d1-mens-teams");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("ncaaTeams");
    expect(res.body).toHaveProperty("numItems");
    expect(Array.isArray(res.body.ncaaTeams)).toBe(true);
    expect(typeof res.body.numItems === "number").toBe(true);
  });
});

// More complex functional tests:
describe("GET /api/ncaa-d1-mens-teams/:team", () => {
  it("should return team roster for the given NCAA team", async () => {
    const team = "exampleTeam"; // replace this with an actual team name in your database
    const res = await request(app).get(`/api/ncaa-d1-mens-team/${team}`);

    // General check for successful response
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("teamRoster");
    expect(res.body).toHaveProperty("numItems");

    // Check that response data is in correct format
    expect(Array.isArray(res.body.teamRoster)).toBe(true);
    expect(typeof res.body.numItems === "number").toBe(true);

    // Check that each item in teamRoster has expected properties
    res.body.teamRoster.forEach((player) => {
      expect(player).toHaveProperty("Team");
      expect(player.Team).toEqual(team);

      // add other properties of player that you expect to be present
    });

    // Check that numItems matches the length of teamRoster
    expect(res.body.numItems).toEqual(res.body.teamRoster.length);
  });

  it("should return a paginated team roster for the given NCAA team", async () => {
    const team = "exampleTeam"; // replace this with an actual team name in your database
    const limit = 10;
    const page = 1;
    const res = await request(app)
      .get(`/api/ncaa-d1-mens-team/${team}`)
      .query({ limit, page });

    // General check for successful response
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("teamRoster");
    expect(res.body).toHaveProperty("numItems");

    // Check that response data is in correct format
    expect(Array.isArray(res.body.teamRoster)).toBe(true);
    expect(typeof res.body.numItems === "number").toBe(true);

    // Check that the number of returned players does not exceed the limit
    expect(res.body.teamRoster.length).toBeLessThanOrEqual(limit);

    // Check that numItems matches the length of teamRoster
    expect(res.body.numItems).toEqual(res.body.teamRoster.length);
  });
});
