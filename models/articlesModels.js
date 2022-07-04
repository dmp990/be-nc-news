const db = require("../db/connection");

exports.fetchArticleById = ({ article_id }) => {
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "article_id must be a number" });
  }
  return db
    .query(
      `SELECT * 
    FROM articles 
    WHERE article_id = $1;`,
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
