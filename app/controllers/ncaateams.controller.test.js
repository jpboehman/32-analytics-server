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
