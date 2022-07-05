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
  test("200: respond with an article object with these properties: author, title, article_id, body, topic, created_at, votes, and comment_count", () => {
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
          comment_count: 11,
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

describe("GET /api/articles", () => {
  test("200: respond with an array of article objects with these properties: author, title, article_id, topic, created_at, votes, comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: array should be sorted by date in descending order.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: respond with an array of comments for article_id with each comment having following properties: comment_id, votes, created_at, author, body", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("200: respond with empty array if there are no comments on the article.", () => {
    return request(app)
      .get("/api/articles/10/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("400: respond with error if article if is not a number.", () => {
    return request(app)
      .get("/api/articles/one/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id must be a number");
      });
  });
  test("404: respond with error if no article exists for the given article_id.", () => {
    return request(app)
      .get("/api/articles/150/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no article with that id");
      });
  });
});

describe("10. POST /api/articles/:article_id/comments", () => {
  test("201: respond with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "Hakuna Matata" })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "Hakuna Matata",
        });
      });
  });
  test("201: ignore other properties except username and body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "Hakuna Matata", votes: 5 })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          article_id: expect.any(Number),
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "Hakuna Matata",
        });
      });
  });
  test("400: return an error if article_id is not a number", () => {
    return request(app)
      .post("/api/articles/one/comments")
      .send({ username: "butter_bridge", body: "Hakuna Matata" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article_id must be a number");
      });
  });
  test("404: return an error if there is no article with the given article_id", () => {
    return request(app)
      .post("/api/articles/150/comments")
      .send({ username: "butter_bridge", body: "Hakuna Matata" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no article with that id");
      });
  });
  test("400: return an error if post body does not contain username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "Hakuna Matata" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please provide username");
      });
  });
  test("400: return an error if post body does not contain username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please provide body");
      });
  });
});
