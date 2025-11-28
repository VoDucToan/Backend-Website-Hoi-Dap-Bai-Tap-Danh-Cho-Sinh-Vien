const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Post_Type = require("../models/Post_Type");
const Privilege = require("../models/Privilege");
const Role = require("../models/Role");
const Tag = require("../models/Tag");
const User = require("../models/User");
const User_Privilege = require("../models/User_Privilege");
const Vote_Type = require("../models/Vote_Type");

const modalDataUser = async () => {
    await User.create({
        display_name: 'Đức Toàn',
        email_address: 'toanhoho@gmail.com',
        password: '123456',
        about_me: 'HCMUTE',
        location: 'Thủ Đức',
    });
}

const modalDataPostType = async () => {
    await Post_Type.create({
        type_name: 'question',
    });
    await Post_Type.create({
        type_name: 'answer',
    });
}

const modalDataTag = async () => {
    await Tag.create({
        tag_name: 'Toán 2',
        tag_description: 'Môn học giải tích'
    });
    await Tag.create({
        tag_name: 'Anh văn 3',
        tag_description: 'Môn học tiếng anh'
    });
    await Tag.create({
        tag_name: 'Nhập môn lập trình',
        tag_description: 'Sinh viên ngành CNTT năm nhất học'
    });
}

const modalDataVoteType = async () => {
    await Vote_Type.create({
        vote_type: true
    });
    await Vote_Type.create({
        vote_type: false
    });
}

const modalDataComment = async () => {
    await Comment.create({
        created_by_user_id: 9,
        post_id: 26,
        comment_text: 'Câu hỏi này rất hay',
    });
    await Comment.create({
        created_by_user_id: 11,
        post_id: 28,
        comment_text: 'hihi comment cho vui nek',
    });
}

const modalDataRole = async () => {
    await Role.create({
        role_name: 'user'
    });
    await Role.create({
        role_name: 'admin'
    });
}

const modalDataNotification = async () => {
    await Notification.create({
        belonged_by_user_id: 11,
        notification_type: "welcome",
        notification_summary: "Chào mừng đến với trang web của chúng tôi",
        notification_resource: "/users",
    });
    await Notification.create({
        belonged_by_user_id: 11,
        notification_type: "comment",
        notification_summary: "đã có người comment câu trả lời của bạn",
        notification_resource: "/questions",
    });
}

const modalDataPrivilege = async () => {
    await Privilege.create({
        privilege_type: "Vote up comment",
        privilege_description: "Indicate when comments are useful",
        privilege_reputation: 2,
    });
    await Privilege.create({
        privilege_type: "Comment",
        privilege_description: "Leave comments on other people's posts",
        privilege_reputation: 4,
    });
    await Privilege.create({
        privilege_type: "Vote up post",
        privilege_description: "Indicate when questions and answers are useful",
        privilege_reputation: 15,
    });
    await Privilege.create({
        privilege_type: "Vote down post",
        privilege_description: "Indicate when questions and answers are not useful",
        privilege_reputation: 30,
    });
    await Privilege.create({
        privilege_type: "Set bounties",
        privilege_description: "Offer some of your reputation as bounty on a question",
        privilege_reputation: 75,
    });
    await Privilege.create({
        privilege_type: "Create tags",
        privilege_description: "Add new tags to the site",
        privilege_reputation: 150,
    });
}

const modalDataUserPrivilege = async () => {
    await User_Privilege.create({
        privilege_id: 3,
        user_id: 11,
    });
}

module.exports = {
    modalDataUser, modalDataPostType, modalDataTag, modalDataVoteType,
    modalDataComment, modalDataRole, modalDataNotification, modalDataPrivilege,
    modalDataUserPrivilege
};