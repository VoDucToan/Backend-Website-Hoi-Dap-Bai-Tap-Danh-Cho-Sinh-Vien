const connection = require('../config/database');

const handleGetNumberVoteForPost = async (idPost) => {
    let [results, fields] = await connection.query(`select * from vote_post where post_id = ${idPost};`);
    let count = 0;
    results.forEach((item, index) => {
        if (item.vote_type_id === 1) {
            count++;
        }
        else if (item.vote_type_id === 2) {
            count--;
        }
    })
    return count;
}

const handleIncreaseVoteForPost = async (idPost, idUser, idVoteType) => {
    let [results] = await connection.query(`INSERT INTO vote_post (post_id, vote_type_id, user_id)
                                        VALUES (${idPost}, ${idVoteType}, ${idUser})`);
    return {
        EC: 0,
        EM: "Increase vote for post succeed",
    };

}

const handleUnvoteForPost = async (idPost, idUser) => {
    let [results] = await connection.query(`DELETE FROM vote_post WHERE post_id = ${idPost} and user_id = ${idUser}`);
    return {
        EC: 0,
        EM: "Unvote for post succeed",
    };
}

const handleGetVoteTypeForPost = async (idPost, idUser) => {
    let [results] = await connection.query(`SELECT * FROM vote_post WHERE post_id = ${idPost} and user_id = ${idUser}`);
    const data = (results && results.length === 0) ? 0 : results[0].vote_type_id;
    return {
        EC: 0,
        EM: "Get vote type for post succeed",
        DT: data
    };
}

const handleDecreaseVoteForPost = async (idPost, idUser, idVoteType) => {
    let [results] = await connection.query(`INSERT INTO vote_post (post_id, vote_type_id, user_id)
        VALUES (${idPost}, ${idVoteType}, ${idUser})`);
    return {
        EC: 0,
        EM: "Decrease vote for post succeed",
    };
}

const handleGetNumberVoteForComment = async (idComment) => {
    let [results] = await connection.query(`SELECT * FROM vote_comment WHERE comment_id = ${idComment}`);
    const numberVote = results.length;
    return {
        EC: 0,
        EM: "Get number vote for comment succeed",
        DT: numberVote
    };
}

const handleIncreaseVoteForComment = async (idComment, idUser, idVoteType) => {
    let [results] = await connection.query(`INSERT INTO vote_comment (comment_id, vote_type_id, user_id)
                                            VALUES (${idComment}, ${idVoteType}, ${idUser})`);
    return {
        EC: 0,
        EM: "Increase vote for comment succeed",
    };
}

const handleUnvoteForComment = async (idComment, idUser) => {
    let [results] = await connection.query(`DELETE FROM vote_comment WHERE comment_id = ${idComment} and user_id = ${idUser}`);
    return {
        EC: 0,
        EM: "Unvote for comment succeed",
    };
}

const handleGetVoteTypeForComment = async (idComment, idUser) => {
    let [results] = await connection.query(`SELECT * FROM vote_comment WHERE comment_id = ${idComment} and user_id = ${idUser}`);
    const data = (results && results.length === 0) ? 0 : results[0].vote_type_id;
    return {
        EC: 0,
        EM: "Get vote type for comment succeed",
        DT: data
    };
}

module.exports = {
    handleIncreaseVoteForPost, handleUnvoteForPost, handleGetVoteTypeForPost,
    handleDecreaseVoteForPost, handleGetNumberVoteForPost, handleGetNumberVoteForComment,
    handleIncreaseVoteForComment, handleUnvoteForComment, handleGetVoteTypeForComment
}