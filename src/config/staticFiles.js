const express = require('express')
const path = require('path');

const configStaticFiles = (app) => {
    app.use(express.static(path.join('./src', 'public')));
}

module.exports = configStaticFiles;