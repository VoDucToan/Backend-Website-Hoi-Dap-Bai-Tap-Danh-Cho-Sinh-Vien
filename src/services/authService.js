require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const connection = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ms = require('ms');
const { handleCreateListSave } = require('./listSaveService');
const isDev = process.env.NODE_ENV === 'development';
const Brevo = require("@getbrevo/brevo");

const handleCreateUser = async (display_name, email_address, password) => {
    try {
        //validate email unique
        let [isExistUser] = await connection.query(`SELECT * FROM user
        WHERE email_address = '${email_address}'`);
        if (isExistUser.length !== 0) {
            return {
                EC: 1,
                EM: "Email address exist",
            };
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
            display_name: display_name,
            email_address: email_address,
            password: hashPassword,
            is_verify_email: false,
            role_id: 1,
        });

        const dataListSave = await handleCreateListSave(user.id, "Xem sau");
        if (dataListSave && dataListSave.EC === 0) {
            // Generate a vertification token
            const token = crypto.randomBytes(20).toString('hex');
            // Store the token with the user's email in a database or in-memory store
            user.verify_token = token;
            await user.save();
            // Send the vertification token to the user's email

            // const transporter = nodemailer.createTransport({
            //     host: "smtp-relay.brevo.com",
            //     port: 587,
            //     secure: false,
            //     auth: {
            //         user: process.env.BREVO_USER,
            //         pass: process.env.BREVO_KEY,
            //     },
            // });
            // const mailOptions = {
            //     from: `Hỏi Đáp UTE <${process.env.EMAIL_USER}>`,
            //     to: email_address,
            //     subject: 'Verify Email',
            //     text: `Click the following link to verify your email: ${process.env.URL_REACT}/verify-email/${token}`, //link ở front end
            // };
            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         console.log(error);
            //         return {
            //             EC: 2,
            //             EM: "Error sending email",
            //         };
            //     } else {
            //         console.log(`Email sent: ${info.response}`);
            //     }
            // });

            const apiInstance = new Brevo.TransactionalEmailsApi();
            apiInstance.setApiKey(
                Brevo.TransactionalEmailsApiApiKeys.apiKey,
                process.env.BREVO_API_KEY
            );

            await apiInstance.sendTransacEmail({
                sender: { email: process.env.EMAIL_USER, name: "Hỏi Đáp UTE" },
                to: [{ email: email_address }],
                subject: "Verify Email",
                textContent: `Click the link: ${process.env.URL_REACT}/verify-email/${token}`
            });

            return {
                EC: 0,
                EM: "Create user succeed",
            };
        }
        else {
            return {
                EC: 4,
                EM: dataListSave.EM,
            };
        }
    } catch (error) {
        console.log('error', error);
        return {
            EC: 3,
            EM: error.message,
        };
    }
}

const handleLoginUser = async (email_address, password, res) => {
    //find user by email
    // let [user] = await connection.query(`SELECT * FROM user
    //                                     WHERE email_address = '${email_address}'`);
    const user = await User.findOne(
        {
            where: { email_address: email_address }
        }
    );
    if (user) {
        //verify email
        if (!user.is_verify_email) {
            return {
                EC: 3,
                EM: "Email is not verify"
            };
        }
        //compare password
        const isMatchPassword = await bcrypt.compare(password, user.password)
        if (isMatchPassword) {
            const payload = {
                id: user.id,
                email: email_address,
                name: user.display_name
            }
            const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_LIFE
            })
            const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: process.env.REFRESH_TOKEN_LIFE
            })
            user.refresh_token = refresh_token;
            await user.save();

            res.cookie("refreshToken", refresh_token, {
                httpOnly: true,
                secure: !isDev,
                // sameSite: "none",
                signed: true,
                expires: new Date(Date.now() + ms(process.env.REFRESH_TOKEN_LIFE)),
            });

            const expiresAt = new Date(Date.now() + ms(process.env.ACCESS_TOKEN_LIFE));

            return {
                EC: 0,
                EM: "Login succeed",
                DT: {
                    access_token,
                    expiresAt,
                    id: user.id,
                    email: email_address,
                    name: user.display_name,
                    avatar: user.avatar_file_name,
                    reputation: user.reputation,
                    role: user.role_id,
                }
            };
        }
        else {
            return {
                EC: 2,
                EM: "Email/Password is invalid"
            };
        }
    }
    else {
        return {
            EC: 1,
            EM: "Email/Password is invalid"
        };
    }
}

const handleRefreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req?.signedCookies?.refreshToken;
        if (!refreshToken) {
            handleLogout(req, res);
            return {
                EC: 2,
                EM: "Refresh token invalid",
            };
        }
        const user = await User.findOne(
            {
                where: { refresh_token: refreshToken }
            }
        );
        if (!user) {
            handleLogout(req, res);
            return {
                EC: 3,
                EM: "Refresh token invalid",
            };
        }
        const decoded = jwt.verify(user.refresh_token, process.env.REFRESH_TOKEN_SECRET);
        const payload = {
            id: decoded.id,
            email: decoded.email_address,
            name: decoded.display_name
        }
        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        })
        return {
            EC: 0,
            DT: {
                access_token,
                expiresAt: new Date(Date.now() + ms(process.env.ACCESS_TOKEN_LIFE)),
                id: user.id,
                email: user.email_address,
                name: user.display_name,
                avatar: user.avatar_file_name,
                reputation: user.reputation,
                role: user.role_id,
            },
            EM: "Refresh access token succeed",
        };

    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleLogout = async (req, res) => {
    try {
        const refreshToken = req?.signedCookies?.refreshToken;
        if (refreshToken) {
            const user = await User.findOne(
                {
                    where: { refresh_token: refreshToken }
                }
            );
            user.refresh_token = null;
            await user.save();
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: !isDev,
            sameSite: "none",
            signed: true,
        });
        return {
            EC: 0,
            EM: "Logout succeed",
        };
    } catch (error) {
        return {
            EC: 1,
            EM: error.message,
        };
    }

}

const handleVerifyEmail = async (token) => {
    try {
        // Find the user with the given token and verify their email
        const user = await User.findOne({
            where: {
                verify_token: token,
            },
        });
        if (user) {
            user.is_verify_email = true;
            user.verify_token = "";
            await user.save();
            return {
                EC: 0,
                EM: "Verify email successfully",
            };
        } else {
            return {
                EC: 1,
                EM: "Invalid or expired token",
            };
        }
    } catch (error) {
        return {
            EC: 2,
            EM: error.message,
        };
    }

}

module.exports = {
    handleCreateUser, handleLoginUser, handleVerifyEmail,
    handleRefreshAccessToken, handleLogout
};