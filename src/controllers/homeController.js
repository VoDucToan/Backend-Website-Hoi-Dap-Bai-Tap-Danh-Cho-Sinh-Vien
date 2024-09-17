const { handleGetAllUsers } = require('../services/CRUDService');

const getHomePage = async (req, res) => {
    // res.send('Hello World!')
    let users = await handleGetAllUsers();
    console.log(users);
    res.render('sample.ejs');
}

module.exports = { getHomePage };