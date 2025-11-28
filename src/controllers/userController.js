const { handleGetUser, handleGetListUsers, handleUpdateUser, handleGetListUsersPagination, handleIncreaseReputationForAuthorPost, handleDecreaseReputationForAuthorPost, handleIncreaseReputationForUser, handleDecreaseReputationForUser } = require("../services/userService");

const getUser = async (req, res) => {
    let idUser = req.params.iduser;
    let user = await handleGetUser(idUser);
    return res.status(200).json(user);
}

const getListUsers = async (req, res) => {
    const { page, limit, search } = req.query;
    if (+page && +limit) {
        const data = await handleGetListUsersPagination(+page, +limit, search);
        return res.status(200).json(data);
    }
    else {
        let users = await handleGetListUsers();
        return res.status(200).json(users);
    }

}

const updateUser = async (req, res) => {
    if (req?.file && req.file.originalname && !req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        return res.status(200).json({
            EC: 2,
            EM: 'Only image files (jpg, jpeg, png) are allowed!'
        });
    };

    let image = null;
    if (req?.file && req.file.filename) {
        image = req.file.filename;
    }
    const { idUser, idRole, userName, locationUser, aboutMe } = req.body;
    const data = await handleUpdateUser(idUser, idRole, userName, locationUser, aboutMe, image);
    return res.status(200).json(data);
}

const increaseReputationForAuthorPost = () => {
    handleIncreaseReputationForAuthorPost
}

const increaseReputationForUser = () => {
    handleIncreaseReputationForUser
}

const decreaseReputationForAuthorPost = () => {
    handleDecreaseReputationForAuthorPost
}

const decreaseReputationForUser = () => {
    handleDecreaseReputationForUser
}

module.exports = {
    getUser, getListUsers, updateUser, increaseReputationForUser,
    increaseReputationForAuthorPost, decreaseReputationForAuthorPost,
    decreaseReputationForUser
}