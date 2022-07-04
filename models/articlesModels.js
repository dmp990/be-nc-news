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
