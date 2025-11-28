const Item_Save = require("../models/Item_Save");
const List_Save = require("../models/List_Save");

const handleCreateListSave = async (idUser, listName) => {
    try {
        await List_Save.create({
            created_by_user_id: idUser,
            list_name: listName
        });
        return {
            EC: 0,
            EM: "Create list save succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetListSavesByUser = async (idUser) => {
    try {
        const listSaves = await List_Save.findAll({
            where: {
                created_by_user_id: idUser
            },
        });
        return {
            EC: 0,
            EM: 'Get list saves succeed',
            DT: listSaves
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUpdateListSaveName = async (idListSave, listName) => {
    try {
        await List_Save.update(
            {
                list_name: listName,
            },
            {
                where: {
                    id: idListSave,
                },
            },
        );

        return {
            EC: 0,
            EM: 'Update list save name succeed',
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeleteListSave = async (idListSave) => {
    try {
        const listSave = await List_Save.findOne({
            where: {
                id: idListSave,
            },
        });
        const idUser = listSave.created_by_user_id;

        const listSaveLater = await List_Save.findOne({
            where: {
                created_by_user_id: idUser,
            },
            order: [['createdAt', 'ASC']],
        });

        await Item_Save.update(
            {
                list_save_id: listSaveLater.id,
            },
            {
                where: {
                    list_save_id: listSave.id,
                },
            },
        );

        await listSave.destroy();

        return {
            EC: 0,
            EM: 'Delete list save succeed',
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleCreateListSave, handleGetListSavesByUser, handleUpdateListSaveName,
    handleDeleteListSave
}
