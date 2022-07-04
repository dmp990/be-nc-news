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
  test("404: respond with the msg 'Invalid route'", () => {
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

describe("GET api/articles/:article_id", () => {
  test("200: respond with an article object with these properties: author, title, article_id, body, topic, created_at, and votes", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
  test("400: respond with an error if article_id is not a number", () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id must be a number");
      });
  });
  test("404: respond with an error if there is no article with given article_id", () => {
    return request(app)
      .get("/api/articles/13")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: increment the votes when inc_votes in +ve and respond with the updated article object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 30 })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 130,
        });
      });
  });
  test("201: decrement the votes when inc_votes in -ve and respond with the updated article object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -30 })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 70,
        });
      });
  });
  test("200: ignore everything else on patch body except inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 100, author: "asad_ali" })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 200,
        });
      });
  });
  test("400: respond with error if article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/one")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id must be a number");
      });
  });
  test("404: respond with error if there is no article for the specified article_id", () => {
    return request(app)
      .patch("/api/articles/13")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article not found");
      });
  });
  test("422: respond with error if patch body does not have inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(422)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("inc_votes must be provided");
      });
  });
  test("422: respond with error if inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "one" })
      .expect(422)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("inc_votes must be a number");
      });
  });
});


describe("GET /api/users", () => {
  test("200: respond with an array of user objects with these properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
