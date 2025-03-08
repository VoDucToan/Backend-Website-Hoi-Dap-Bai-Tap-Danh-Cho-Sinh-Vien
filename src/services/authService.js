require('dotenv').config();
const connection = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const handleCreateUser = async (display_name, email_address, password) => {
    //validate email unique
    let [user] = await connection.query(`SELECT * FROM user
                                        WHERE email_address = '${email_address}'`);
    if (user.length !== 0) {
        return {
            EC: 1,
            EM: "Email address exist",
        };
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    let [results, fields] = await connection.query(`INSERT INTO user (display_name, email_address, password)
                                                    VALUES ("${display_name}", "${email_address}", "${hashPassword}")`);
    return {
        EC: 0,
        EM: "Create user succeed",
    };

}

const handleLoginUser = async (email_address, password) => {
    //find user by email
    let [user] = await connection.query(`SELECT * FROM user
                                        WHERE email_address = '${email_address}'`);
    if (user[0]) {
        //compare password
        const isMatchPassword = await bcrypt.compare(password, user[0].password)
        if (isMatchPassword) {
            const payload = {
                id: user[0].id,
                email: email_address,
                name: user[0].display_name
            }
            const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            })
            return {
                EC: 0,
                EM: "Login succeed",
                DT: {
                    access_token,
                    id: user[0].id,
                    email: email_address,
                    name: user[0].display_name
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

module.exports = { handleCreateUser, handleLoginUser };