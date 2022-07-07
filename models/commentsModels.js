const db = require("../db/connection");
const { checkExists } = require("../db/helpers/checkExists");

exports.removeCommentById = async ({ comment_id }) => {
  if (isNaN(+comment_id)) {
    return Promise.reject({ status: 400, msg: "comment_id must be a number" });
  }

  await checkExists("comments", "comment_id", +comment_id).catch(() => {
    return Promise.reject({ status: 404, msg: "no comment with this id" });
  });

  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1;`,
    [+comment_id]
  );
};

exports.updateCommentById = async ({ comment_id }, { inc_votes }) => {
  if (isNaN(+comment_id)) {
    return Promise.reject({ status: 400, msg: "comment_id must be a number" });
  }

  await checkExists("comments", "comment_id", +comment_id).catch(() => {
    return Promise.reject({ status: 404, msg: "no comment with this id" });
  });

  if (isNaN(+inc_votes)) {
    return inc_votes === undefined
      ? Promise.reject({ status: 422, msg: "please provide inc_votes" })
      : Promise.reject({ status: 422, msg: "inc_votes must be a number" });
  }

  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [+inc_votes, +comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
