const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  db.end();
});

describe("Error handling for invalid routes", () => {
  test("400: respond with the msg 'Invalid route'", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid route");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: respond with an array of topic object each of which should have two properties: slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
