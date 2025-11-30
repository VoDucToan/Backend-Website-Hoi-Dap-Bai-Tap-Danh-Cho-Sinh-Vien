const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');
const Tag = require('./Tag');
const Edit = require('./Edit_Post');

const Edit_Post_Tag = sequelize.define(
    'edit_post_tag',
    {
        edit_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Edit,
                key: 'id',
            },
        },
        tag_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Tag,
                key: 'id',
            },
        },
    },
    {
        tableName: 'edit_post_tag',
    },
);

Tag.belongsToMany(Edit, { through: Edit_Post_Tag, foreignKey: 'tag_id', otherKey: 'edit_id' });
Edit.belongsToMany(Tag, { through: Edit_Post_Tag, foreignKey: 'edit_id', otherKey: 'tag_id' });

module.exports = Edit_Post_Tag;