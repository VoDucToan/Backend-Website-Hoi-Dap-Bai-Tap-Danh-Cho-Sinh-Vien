const connection = require('../config/database');

const handleGetTagsByQuestion = async (idQuestion) => {
    let [results, fields] = await connection.query(
        `select tag_id, tag_name, tag_description, post_id from tag
            inner join post_tag on post_tag.tag_id = tag.id
            inner join post on post.id = post_tag.post_id
            where post.id = ${idQuestion}`);
    return results;
}

const handleGetListTags = async () => {
    let [results, fields] = await connection.query(`select * from tag`);
    return results;
}

module.exports = { handleGetTagsByQuestion, handleGetListTags };