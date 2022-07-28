const db = require("../db/connection");

const { checkExists } = require("../db/helpers/checkExists");

exports.fetchArticleById = async ({ article_id }) => {
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "article_id must be a number" });
  }

  return db
    .query(
      `SELECT articles.*, CAST (COUNT(comments.comment_id) AS INT) AS comment_count
        FROM articles
        JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
      [+article_id]
    )
    .then((result) => {
      if (result.rows.length) {
        return result.rows[0];
      }
      return Promise.reject({
        status: 404,
        msg: "article not found",
      });
    });
};

exports.updateArticleById = ({ article_id }, { inc_votes }) => {
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "article_id must be a number" });
  }
  if (isNaN(+inc_votes)) {
    return inc_votes === undefined
      ? Promise.reject({ status: 422, msg: "inc_votes must be provided" })
      : Promise.reject({ status: 422, msg: "inc_votes must be a number" });
  }
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $1 
       WHERE article_id = $2
       RETURNING *;`,
      [+inc_votes, +article_id]
    )
    .then((result) => {
      if (result.rows.length) {
        return result.rows[0];
      }
      return Promise.reject({ status: 404, msg: "article not found" });
    });
};

exports.removeArticleById = async ({ article_id }) => {
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "article_id must be a number" });
  }

  await checkExists("articles", "article_id", +article_id).catch(() => {
    return Promise.reject({ status: 404, msg: "no article with this id" });
  });

  return db.query(`DELETE FROM articles WHERE article_id = ${+article_id}`);
};

exports.fetchArticles = async (query) => {
  let isInvalid = false;
  const validQueries = ["sort_by", "order", "topic", "limit", "p"];
  Object.keys(query).forEach((query) => {
    if (!validQueries.includes(query)) {
      isInvalid = true;
    }
  });
  if (isInvalid) {
    return Promise.reject({ status: 400, msg: "invalid query" });
  }

  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  const { sort_by = "created_at", order = "desc", topic, limit, p } = query;

  let queryStr = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, CAST (COUNT(comments.comment_id) AS INT) AS comment_count, CAST ((SELECT COUNT(*)
FROM articles) AS INT) AS total_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic !== undefined) {
    await checkExists("topics", "slug", topic).catch(() => {
      return Promise.reject({ status: 400, msg: "topic does not exist" });
    });
    queryStr += ` WHERE articles.topic LIKE '${topic}' `;
  }

  if (!validSortBy.includes(sort_by.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "invalid sort_by" });
  }
  if (!validOrder.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "invalid order" });
  }
  if (limit !== undefined && isNaN(+limit)) {
    return Promise.reject({ status: 400, msg: "limit must be a number" });
  }
  if (p !== undefined && isNaN(+p)) {
    return Promise.reject({ status: 400, msg: "p must be a number" });
  }

  queryStr += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order} `;

  if (limit === undefined) {
    queryStr += `LIMIT 10 OFFSET `;
    p === undefined ? (queryStr += `0`) : (queryStr += `${10 * (+p - 1)}`);
  } else {
    queryStr += `LIMIT ${+limit} OFFSET `;
    p === undefined ? (queryStr += `0`) : (queryStr += `${+limit * (+p - 1)}`);
  }

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByArticleId = async ({ article_id }, query) => {
  let isInvalid = false;
  const validQueries = ["limit", "p"];
  Object.keys(query).forEach((query) => {
    if (!validQueries.includes(query)) {
      isInvalid = true;
    }
  });
  if (isInvalid) {
    return Promise.reject({ status: 400, msg: "invalid query" });
  }
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "article_id must be a number" });
  }

  await checkExists("articles", "article_id", +article_id).catch(() => {
    return Promise.reject({ status: 404, msg: "no article with that id" });
  });

  const { limit, p } = query;

  if (limit !== undefined && isNaN(+limit)) {
    return Promise.reject({ status: 400, msg: "limit must be a number" });
  }
  if (p !== undefined && isNaN(+p)) {
    return Promise.reject({ status: 400, msg: "p must be a number" });
  }

  let queryStr = `SELECT comments.comment_id, comments.votes, 
        comments.created_at,
        comments.author, comments.body
        FROM comments
        WHERE article_id = $1 `;

  if (limit === undefined) {
    queryStr += `LIMIT 10 OFFSET `;
    p === undefined ? (queryStr += `0`) : (queryStr += `${10 * (+p - 1)}`);
  } else {
    queryStr += `LIMIT ${+limit} OFFSET `;
    p === undefined ? (queryStr += `0`) : (queryStr += `${+limit * (+p - 1)}`);
  }
  return db.query(queryStr, [+article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentsByArticleId = async (
  { article_id },
  { username, body }
) => {
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "article_id must be a number" });
  }

  await checkExists("articles", "article_id", +article_id).catch(() => {
    return Promise.reject({ status: 404, msg: "no article with that id" });
  });

  await checkExists("users", "username", username).catch(() => {
    return Promise.reject({ status: 404, msg: "username does not exist" });
  });

  if (username === undefined) {
    return Promise.reject({ status: 400, msg: "please provide username" });
  }

  if (body === undefined) {
    return Promise.reject({ status: 400, msg: "please provide body" });
  }

  return db
    .query(
      `INSERT INTO comments (author, body, article_id)
      VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, +article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertArticle = async ({ author, title, body, topic }) => {
  if (
    author === undefined ||
    title === undefined ||
    body === undefined ||
    topic === undefined
  ) {
    return Promise.reject({
      status: 400,
      msg: "Incomplete patch body! Please provide all 4: author, title, body, and topic",
    });
  }
  await checkExists("users", "username", author).catch(() => {
    return Promise.reject({
      status: 400,
      msg: "author does not exist",
    });
  });
  await checkExists("topics", "slug", topic).catch(() => {
    return Promise.reject({
      status: 400,
      msg: "topic does not exist",
    });
  });

  return db
    .query(
      `INSERT INTO articles (author, title, body, topic)
  VALUES ($1, $2, $3, $4) RETURNING *, 0 AS comment_count`,
      [author, title, body, topic]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
