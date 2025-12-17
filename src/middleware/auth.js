require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    // const white_lists = [
    //     //api auth
    //     "/register",
    //     "/login",
    //     "/verify-email",
    //     "/refresh",
    //     //api vote
    //     "/number-vote-for-post/\\d{1,}",
    //     '/number-vote-for-comment/\\d{1,}',
    //     //api question
    //     "/list-questions\\?page=\\d{1,}&limit=\\d{1,}",
    //     "/question/\\d{1,}",
    //     "/number-question-by-tag/\\d{1,}",
    //     //api tag
    //     "/list-tags-by-question/\\d{1,}",
    //     "/list-tags\\?page=\\d{1,}&limit=\\d{1,}",
    //     "/list-tags\\?page=\\d{1,}&limit=\\d{1,}&status=\\d{1,}&search=\\d{1,}",
    //     "/list-tags",
    //     "/tag/\\d{1,}",
    //     //api comment
    //     "/list-comments/\\d{1,}",
    //     //api user
    //     "/user/\\d{1,}",
    //     "/list-users\\?page=\\d{1,}&limit=\\d{1,}",
    //     "/list-users",
    //     //api answer
    //     "/number-answers/\\d{1,}",
    //     "/list-answers/\\d{1,}\\?page=\\d{1,}&limit=\\d{1,}",
    //     //api image
    //     "/images-for-post/\\d{1,}",
    //     "/images-for-tag/\\d{1,}",
    // ];
    // const isWhitelisted = white_lists.some((pattern) => new RegExp('^' + '/api/v1' + pattern + '$').test(req.originalUrl));
    // if (isWhitelisted) {
    //     next();
    // }
    const refreshToken = req?.signedCookies?.refreshToken;
    if (!refreshToken) {
        return res.status(401).json();
    }
    const user = await User.findOne(
        {
            where: { refresh_token: refreshToken }
        }
    );
    if (!user) {
        return res.status(401).json();
    }

    if (req?.headers?.authorization?.split(' ')?.[1]) {
        const accessToken = req?.headers?.authorization?.split(' ')?.[1];
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
            req.user = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name
            }
            next();
        } catch (error) {
            return res.status(401).json();
        }

    }
    else {
        return res.status(401).json();
    }
}

module.exports = { auth };