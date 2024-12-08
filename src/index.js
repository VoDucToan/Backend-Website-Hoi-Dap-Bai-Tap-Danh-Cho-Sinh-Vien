require('dotenv').config();
const express = require('express')
const configViewEngine = require('./config/viewEngine')
const configStaticFiles = require('./config/staticFiles')
const apiAuthRoutes = require('./routes/apiAuth');
const apiVoteRoutes = require('./routes/apiVote');
const apiQuestionRoutes = require('./routes/apiQuestion');
const apiTagRoutes = require('./routes/apiTag');
const apiCommentRoutes = require('./routes/apiComment');
const apiUserRoutes = require('./routes/apiUser');
const apiAnswerRoutes = require('./routes/apiAnswer');
const cors = require('cors')

const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

//config cors
app.use(cors())

//config request body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//config template engine
configViewEngine(app);

//config static files
configStaticFiles(app);

//Khai báo api
app.use('/api/v1/', apiAuthRoutes);
app.use('/api/v1/', apiVoteRoutes);
app.use('/api/v1/', apiQuestionRoutes);
app.use('/api/v1/', apiTagRoutes);
app.use('/api/v1/', apiCommentRoutes);
app.use('/api/v1/', apiUserRoutes);
app.use('/api/v1/', apiAnswerRoutes);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})