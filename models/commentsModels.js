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
