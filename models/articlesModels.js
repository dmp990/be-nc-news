const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const { checkExists } = require("../db/helpers/checkExists");

exports.fetchArticleById = ({ article_id }) => {
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
      return Promise.reject({ status: 404, msg: "article not found" });
    })
    .catch((err) => {
      return Promise.reject(err);
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
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `
        SELECT articles.article_id, articles.author, 
        articles.title,
        articles.topic, 
        articles.created_at, articles.votes,
        CAST (COUNT(comments.comment_id) AS INT)
        AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return err;
    });
};

exports.fetchCommentsByArticleId = async ({ article_id }) => {
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "article_id must be a number" });
  }

  await checkExists("articles", "article_id", +article_id).catch(() => {
    return Promise.reject({ status: 404, msg: "no article with that id" });
  });

  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at,
        comments.author, comments.body
        FROM comments
        WHERE article_id = $1;`,
      [+article_id]
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
