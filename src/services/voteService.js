const dayjs = require('dayjs');
const sequelize = require('../config/connectDB');
const connection = require('../config/database');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Vote_Comment = require('../models/Vote_Comment');
const Vote_Post = require('../models/Vote_Post');
const { handleGetUserFollowByPost } = require('./followService');
const { handleNotifyForUserFollowingPost, handleNotifyForAuthorPost } = require('./notificationService');
const { handleGetPostType } = require('./postService');
const { handleIncreaseReputationForAuthorPost, handleDecreaseReputationForAuthorPost } = require('./userService');

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
    try {
        const user = await User.findOne({
            where: {
                id: idUser,
            },
        });
        if (user.reputation <= 5) {
            return {
                EC: -2,
                EM: "Bạn không đủ điểm danh tiếng để tăng bình chọn",
            };
        }
        else {
            user.reputation -= 5;
            await user.save();

            await Vote_Post.create({
                post_id: idPost,
                vote_type_id: idVoteType,
                user_id: idUser
            });
            const dataIncreaseReputationAuthorPost = await handleIncreaseReputationForAuthorPost(idPost, 10);
            if (dataIncreaseReputationAuthorPost?.EC === 0) {
                const dataNotifyAuthorPost = await handleNotifyForAuthorPost(idPost, "Bình chọn", "tăng bình chọn");
                console.log('dataNotifyAuthorPost', dataNotifyAuthorPost);

                if (dataNotifyAuthorPost?.EC === 0) {
                    const dataNotifyUserFollowingPost = await handleNotifyForUserFollowingPost(idPost, +idUser, 'Bình chọn', 'tăng bình chọn');
                    if (dataNotifyUserFollowingPost?.EC === 0) {
                        return {
                            EC: 0,
                            EM: "Increase vote for post succeed",
                        };
                    }
                    else {
                        return {
                            EC: 3,
                            EM: dataNotifyUserFollowingPost.EM,
                        };
                    }
                }
                else {
                    return {
                        EC: 4,
                        EM: dataNotifyAuthorPost.EM,
                    };
                }

            }
            else {
                return {
                    EC: 3,
                    EM: dataIncreaseReputationAuthorPost.EM,
                };
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUnvoteForPost = async (idPost, idUser, voteType) => {
    try {
        await connection.query(`DELETE FROM vote_post WHERE post_id = ${idPost} and user_id = ${idUser}`);
        const user = await User.findOne({
            where: {
                id: idUser,
            },
        });
        user.reputation += 5;
        await user.save();
        if (voteType === 1) {
            const dataDecreaseReputationAuthorPost = await handleDecreaseReputationForAuthorPost(idPost, 10);
            if (dataDecreaseReputationAuthorPost?.EC !== 0) {

                return {
                    EC: 2,
                    EM: dataDecreaseReputationAuthorPost.EM,
                }
            }
        }
        else if (voteType === 2) {
            const dataIncreaseReputationAuthorPost = await handleIncreaseReputationForAuthorPost(idPost, 5);
            if (dataIncreaseReputationAuthorPost?.EC !== 0) {
                return {
                    EC: 2,
                    EM: dataIncreaseReputationAuthorPost.EM,
                }
            }
        }
        return {
            EC: 0,
            EM: "Unvote for post succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
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
    try {
        const user = await User.findOne({
            where: {
                id: idUser,
            },
        });
        if (user.reputation <= 5) {
            return {
                EC: -2,
                EM: "Bạn không đủ điểm danh tiếng để giảm bình chọn",
            };
        }
        else {
            user.reputation -= 5;
            await user.save();

            await Vote_Post.create({
                post_id: idPost,
                vote_type_id: idVoteType,
                user_id: idUser
            });

            const dataDecreaseReputationAuthorPost = await handleDecreaseReputationForAuthorPost(idPost, 5);
            if (dataDecreaseReputationAuthorPost?.EC === 0) {
                const dataNotifyAuthorPost = await handleNotifyForAuthorPost(idPost, "Bình chọn", "giảm bình chọn");
                if (dataNotifyAuthorPost?.EC === 0) {
                    const dataNotifyUserFollowingPost = await handleNotifyForUserFollowingPost(idPost, +idUser, 'Bình chọn', 'giảm bình chọn');
                    if (dataNotifyUserFollowingPost?.EC === 0) {
                        return {
                            EC: 0,
                            EM: "Decrease vote for post succeed",
                        };
                    }
                    else {
                        return {
                            EC: 3,
                            EM: dataNotifyUserFollowingPost.EM,
                        };
                    }
                }
                else {
                    return {
                        EC: 4,
                        EM: dataNotifyAuthorPost.EM,
                    };
                }
            }
            else {
                return {
                    EC: 3,
                    EM: dataDecreaseReputationAuthorPost.EM,
                };
            }
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
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

const handleIncreaseVoteForComment = async (idComment, idUser) => {
    try {
        await Vote_Comment.create({
            comment_id: idComment,
            vote_type_id: 1,
            user_id: idUser
        });
        return {
            EC: 0,
            EM: "Increase vote for comment succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

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

const handleDeleteVotePost = async (idPost) => {
    try {
        await Vote_Post.destroy({
            where: {
                post_id: idPost,
            },
        });
        return {
            EC: 0,
            EM: "Delete vote post succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUpVoteForPost = async (idPost, idUser) => {
    try {
        const dataVoteTypePost = await handleGetVoteTypeForPost(idPost, idUser)
        if (dataVoteTypePost?.EC === 0) {
            if (dataVoteTypePost.DT === 1) {
                const dataUnvotePost = await handleUnvoteForPost(idPost, idUser)
                if (dataUnvotePost?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataUnvotePost.EM,
                    }
                }
            }
            else if (dataVoteTypePost.DT === 0) {
                const dataIncreaseVotePost = await handleIncreaseVoteForPost(idPost, idUser, 1)
                if (dataIncreaseVotePost?.EC !== 0) {
                    return {
                        EC: 3,
                        EM: dataIncreaseVotePost.EM,
                    }
                }
            }
            else if (dataVoteTypePost.DT === 2) {
                const dataUnvotePost = await handleUnvoteForPost(idPost, idUser)
                if (dataUnvotePost?.EC === 0) {
                    const dataIncreaseVotePost = await handleIncreaseVoteForPost(idPost, idUser, 1)
                    if (dataIncreaseVotePost?.EC !== 0) {
                        return {
                            EC: 6,
                            EM: dataIncreaseVotePost.EM,
                        }
                    }
                }
                else {
                    return {
                        EC: 5,
                        EM: dataUnvotePost.EM,
                    }
                }
            }
        }
        else {
            return {
                EC: 4,
                EM: dataVoteTypePost.EM,
            }
        }
        return {
            EC: 0,
            EM: "Up vote for post succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDownVoteForPost = async (idPost, idUser) => {
    try {
        const dataVoteTypePost = await handleGetVoteTypeForPost(idPost, idUser)
        if (dataVoteTypePost?.EC === 0) {
            if (dataVoteTypePost.DT === 2) {
                const dataUnvotePost = await handleUnvoteForPost(idPost, idUser, dataVoteTypePost.DT)
                if (dataUnvotePost?.EC !== 0) {
                    return {
                        EC: 2,
                        EM: dataUnvotePost.EM,
                    }
                }
            }
            else if (dataVoteTypePost.DT === 0) {
                const dataDecreaseVotePost = await handleDecreaseVoteForPost(idPost, idUser, 2)
                if (dataDecreaseVotePost?.EC !== 0) {
                    return {
                        EC: 3,
                        EM: dataDecreaseVotePost.EM,
                    }
                }
            }
            else if (dataVoteTypePost.DT === 1) {
                const dataUnvotePost = await handleUnvoteForPost(idPost, idUser, dataVoteTypePost.DT)
                if (dataUnvotePost?.EC === 0) {
                    const dataDecreaseVotePost = await handleDecreaseVoteForPost(idPost, idUser, 2)
                    if (dataDecreaseVotePost?.EC !== 0) {
                        return {
                            EC: 6,
                            EM: dataDecreaseVotePost.EM,
                        }
                    }
                }
                else {
                    return {
                        EC: 5,
                        EM: dataUnvotePost.EM,
                    }
                }
            }
        }
        else {
            return {
                EC: 4,
                EM: dataVoteTypePost.EM,
            }
        }
        return {
            EC: 0,
            EM: "DoWn vote for post succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetVotePostsByUser = async (idUser) => {
    try {
        const [votePosts] = await sequelize.query(`SELECT *
                                                    FROM vote_post
                                                    INNER JOIN post ON vote_post.post_id = post.id
                                                    WHERE vote_post.user_id = ${idUser}`);

        return {
            EC: 0,
            DT: votePosts,
            EM: "Get vote posts by user succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetVotePostsByUserPagination = async (page, limit, idUser) => {
    try {
        const offset = (page - 1) * limit;
        const [votePosts] = await sequelize.query(`SELECT *
                                                    FROM vote_post
                                                    INNER JOIN post ON vote_post.post_id = post.id
                                                    WHERE vote_post.user_id = ${idUser}
                                                    LIMIT ${limit} 
                                                    OFFSET ${offset}`);

        const formattedVotePosts = votePosts.map(votePost => {
            votePost.votedTime = dayjs(votePost.createdAt).format('D MMM, YYYY [a]t H:mm');
            return votePost;
        });

        const count = await Vote_Post.count({
            where: {
                user_id: idUser,
            }
        });
        const totalPages = Math.ceil(count / limit);

        return {
            EC: 0,
            DT: {
                totalRows: count,
                totalPages: totalPages,
                votePosts: formattedVotePosts
            },
            EM: "Get vote posts by user pagination succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

module.exports = {
    handleIncreaseVoteForPost, handleUnvoteForPost, handleGetVoteTypeForPost,
    handleDecreaseVoteForPost, handleGetNumberVoteForPost, handleGetNumberVoteForComment,
    handleIncreaseVoteForComment, handleUnvoteForComment, handleGetVoteTypeForComment,
    handleDeleteVotePost, handleUpVoteForPost, handleDownVoteForPost, handleGetVotePostsByUser,
    handleGetVotePostsByUserPagination
}