const { handleGetUser, handleGetListUsers, handleUpdateUser, handleGetListUsersPagination, handleIncreaseReputationForAuthorPost, handleDecreaseReputationForAuthorPost, handleIncreaseReputationForUser, handleDecreaseReputationForUser } = require("../services/userService");
const cloudinary = require("../config/cloudinary");

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
    if (req?.file && req.file.originalname && !req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
        return res.status(200).json({
            EC: 2,
            EM: 'Only image files (jpg, jpeg, png) are allowed!'
        });
    };

    // let image = null;
    // if (req?.file && req.file.filename) {
    //     image = req.file.filename;
    // }

    let image = null;
    if (req?.file?.path) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
    }

    const { idUser, idRole, userName, locationUser, aboutMe, reputation } = req.body;
    const data = await handleUpdateUser(idUser, idRole, userName, locationUser, aboutMe, image, reputation);
    return res.status(200).json(data);
}

const increaseReputationForAuthorPost = () => {
    handleIncreaseReputationForAuthorPost
}

const increaseReputationForUser = async (req, res) => {
    const { idUser, reputationPoints } = req.body;
    const data = await handleIncreaseReputationForUser(idUser, reputationPoints);
    return res.status(200).json(data);
}

const decreaseReputationForAuthorPost = () => {
    handleDecreaseReputationForAuthorPost
}

const decreaseReputationForUser = async (req, res) => {
    const { idUser, reputationPoints } = req.body;
    const data = await handleDecreaseReputationForUser(idUser, reputationPoints);
    return res.status(200).json(data);
}

module.exports = {
    getUser, getListUsers, updateUser, increaseReputationForUser,
    increaseReputationForAuthorPost, decreaseReputationForAuthorPost,
    decreaseReputationForUser
}