require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const white_lists = [
        "/register",
        "/login",
        "/number-vote-for-post/\\d{1,}"
    ];
    const isWhitelisted = white_lists.some((pattern) => new RegExp('^' + '/api/v1' + pattern + '$').test(req.originalUrl));
    if (isWhitelisted) {
        next();
    }
    else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req?.headers?.authorization?.split(' ')?.[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                console.log('decoded', decoded);
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
}

module.exports = { auth };