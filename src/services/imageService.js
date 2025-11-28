const Image_Edit = require("../models/Image_Edit_Post");
const Image_Edit_Tag = require("../models/Image_Edit_Tag");
const Image = require("../models/Image_Post");
const Image_Tag = require("../models/Image_Tag");

const handleGetImagesForPost = async (idPost) => {
    try {
        const images = await Image.findAll({
            where: {
                post_id: idPost,
            },
        });
        return {
            EC: 0,
            EM: 'Get images for post succeed',
            DT: images
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleCreateImagesForTag = async (idTag, tagImage) => {
    try {
        if (tagImage) {
            for (let i = 0; i < tagImage.length; i++) {
                await Image_Tag.create({
                    file_name: tagImage[i],
                    tag_id: idTag,
                })
            }
        }
        return {
            EC: 0,
            EM: "Create image for tag succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleCreateImagesForEditTag = async (idEditTag, editTagImage) => {
    try {
        if (editTagImage) {
            for (let i = 0; i < editTagImage.length; i++) {
                await Image_Edit_Tag.create({
                    file_name: editTagImage[i],
                    edit_tag_id: idEditTag,
                })
            }
        }
        return {
            EC: 0,
            EM: "Create image for edit tag succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleCreateImagesForPost = async (idPost, postImage) => {
    try {
        if (postImage) {
            for (let i = 0; i < postImage.length; i++) {
                await Image.create({
                    file_name: postImage[i],
                    post_id: idPost,
                })
            }
        }
        return {
            EC: 0,
            EM: "Create image for post succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeleteImagesForPost = async (idPost) => {
    try {
        await Image.destroy({
            where: {
                post_id: idPost,
            },
        });
        return {
            EC: 0,
            EM: "Delete images for post succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleDeleteImagesForTag = async (idTag) => {
    try {
        await Image_Tag.destroy({
            where: {
                tag_id: idTag,
            },
        });
        return {
            EC: 0,
            EM: "Delete images for tag succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleCreateImagesForEdit = async (idEdit, editImage) => {
    try {
        if (editImage) {
            for (let i = 0; i < editImage.length; i++) {
                await Image_Edit.create({
                    file_name: editImage[i],
                    edit_id: idEdit,
                })
            }
        }
        return {
            EC: 0,
            EM: "Create image for edit succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetImagesForEdit = async (idEdit) => {
    try {
        const images = await Image_Edit.findAll({
            where: {
                edit_id: idEdit,
            },
        });
        return {
            EC: 0,
            EM: 'Get images for edit succeed',
            DT: images
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetImagesForEditTag = async (idEditTag) => {
    try {
        const images = await Image_Edit_Tag.findAll({
            where: {
                edit_tag_id: idEditTag,
            },
        });
        return {
            EC: 0,
            EM: 'Get images for edit tag succeed',
            DT: images
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetImagesForTag = async (idTag) => {
    try {
        const images = await Image_Tag.findAll({
            where: {
                tag_id: idTag,
            },
        });
        return {
            EC: 0,
            EM: 'Get images for tag succeed',
            DT: images
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeleteImagesForEdit = async (idEdit) => {
    try {
        await Image_Edit.destroy({
            where: {
                edit_id: idEdit,
            },
        });
        return {
            EC: 0,
            EM: "Delete images for edit succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeleteImagesForEditTag = async (idEditTag) => {
    try {
        await Image_Edit_Tag.destroy({
            where: {
                edit_tag_id: idEditTag,
            },
        });
        return {
            EC: 0,
            EM: "Delete images for edit tag succeed",
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleGetImagesForPost, handleCreateImagesForPost, handleDeleteImagesForPost, handleCreateImagesForEdit,
    handleGetImagesForEdit, handleCreateImagesForTag, handleGetImagesForTag, handleDeleteImagesForTag,
    handleDeleteImagesForEdit, handleCreateImagesForEditTag, handleGetImagesForEditTag,
    handleDeleteImagesForEditTag
}