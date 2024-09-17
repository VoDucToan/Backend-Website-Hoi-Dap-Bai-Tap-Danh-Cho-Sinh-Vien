require('dotenv').config();
const express = require('express')
const configViewEngine = require('./config/viewEngine')
const configStaticFiles = require('./config/staticFiles')
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');

const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

//config template engine
configViewEngine(app);

//config static files
configStaticFiles(app);

//khai báo route
// app.use('/', webRoutes);

//Khai báo api
app.use('/api/v1/', apiRoutes);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})