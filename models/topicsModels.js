const db = require("../db/connection");
const { checkNotExists } = require("../db/helpers/checkExists");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.insertTopic = async ({ slug, description }) => {
  if (slug === undefined || description === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Please provide both slug and description",
    });
  }

  await checkNotExists("topics", "slug", slug).catch(() => {
    return Promise.reject({ status: 400, msg: "slug already exists!" });
  });

  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
