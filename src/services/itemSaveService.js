const dayjs = require("dayjs");
const sequelize = require("../config/connectDB");
const Item_Save = require("../models/Item_Save");
const List_Save = require("../models/List_Save");

const handleSaveItemForList = async (listSaveId, postId, privateNote) => {
    try {
        await Item_Save.create({
            list_save_id: listSaveId,
            post_save_id: postId,
            private_note: privateNote,
        });
        return {
            EC: 0,
            EM: "Create item save succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleCheckSaveItemByUser = async (idUser, idPost) => {
    try {
        const [dataSaveItemUser] = await sequelize.query(`SELECT *
                                            FROM item_save
                                            LEFT JOIN list_save ON item_save.list_save_id = list_save.id
                                            WHERE list_save.created_by_user_id = ${idUser} 
                                            AND item_save.post_save_id = ${idPost}`);
        let isSaveItemUser = false;
        if (dataSaveItemUser && dataSaveItemUser.length > 0) {
            isSaveItemUser = true;
        }
        return {
            EC: 0,
            EM: 'Check save item by user succeed',
            DT: isSaveItemUser
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleUnsaveItemForUser = async (idUser, idPost) => {
    try {
        await sequelize.query(`DELETE item_save 
                            FROM item_save 
                            LEFT JOIN list_save ON item_save.list_save_id = list_save.id
                            WHERE list_save.created_by_user_id = ${idUser} 
                            AND item_save.post_save_id = ${idPost}`);
        return {
            EC: 0,
            EM: 'Unsave item for user succeed',
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetItemsSaveByList = async (idListSave) => {
    try {
        const [dataItemsSaveList] = await sequelize.query(`SELECT *, item_save.id as idItemSave
                            FROM item_save
                            LEFT JOIN post ON item_save.post_save_id = post.id
                            WHERE item_save.list_save_id = ${idListSave}
                            AND post.post_status = 1`);

        const formattedDataItemsSaveList = dataItemsSaveList.map(item => {
            item.askedTime = dayjs(item.createdAt).format('D MMM, YYYY [a]t H:mm');
            item.editedTime = dayjs(item.updatedAt).format('D MMM, YYYY [a]t H:mm');
            return item;
        });

        return {
            EC: 0,
            EM: 'Get items save by list succeed',
            DT: formattedDataItemsSaveList
        }
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleGetItemsSaveByListLater = async (idUser) => {
    try {
        const listSave = await List_Save.findOne({
            where: {
                created_by_user_id: idUser,
            },
            order: [['createdAt', 'ASC']],
        });
        const dataItemsSaveListLater = await handleGetItemsSaveByList(listSave.id);
        if (dataItemsSaveListLater && dataItemsSaveListLater.EC === 0) {
            return {
                EC: 0,
                EM: 'Get items save by list later succeed',
                DT: dataItemsSaveListLater.DT
            }
        }
        else {
            return {
                EC: 2,
                EM: dataItemsSaveListLater.EM,
            };
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleMoveItemForList = async (idItemSave, idListSave) => {
    try {
        await Item_Save.update(
            {
                list_save_id: idListSave,
            },
            {
                where: {
                    id: idItemSave,
                },
            },
        );

        return {
            EC: 0,
            EM: 'Move items for list succeed',
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleDeletePrivateNoteForItem = async (idItemSave) => {
    try {
        await Item_Save.update(
            {
                private_note: "",
            },
            {
                where: {
                    id: idItemSave,
                },
            },
        );

        return {
            EC: 0,
            EM: 'Delete private note for item succeed',
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

const handleUpdatePrivateNoteForItem = async (idItemSave, privateNote) => {
    try {
        await Item_Save.update(
            {
                private_note: privateNote,
            },
            {
                where: {
                    id: idItemSave,
                },
            },
        );

        return {
            EC: 0,
            EM: 'Update private note for item succeed',
        }

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }
}

module.exports = {
    handleSaveItemForList, handleCheckSaveItemByUser, handleUnsaveItemForUser,
    handleGetItemsSaveByList, handleGetItemsSaveByListLater, handleMoveItemForList,
    handleDeletePrivateNoteForItem, handleUpdatePrivateNoteForItem
}
