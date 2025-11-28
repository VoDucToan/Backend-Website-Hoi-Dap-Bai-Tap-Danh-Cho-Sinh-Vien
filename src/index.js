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
const apiImageRoutes = require('./routes/apiImage');
const apiEditPostRoutes = require('./routes/apiEditPost');
const apiPostRoutes = require('./routes/apiPost');
const apiNotificationRoutes = require('./routes/apiNotification');
const apiEditTagRoutes = require('./routes/apiEditTag');
const apiListSaveRoutes = require('./routes/apiListSave');
const apiItemSaveRoutes = require('./routes/apiItemSave');
const apiFollowRoutes = require('./routes/apiFollow');
const apiPrivilegeRoutes = require('./routes/apiPrivilege');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { modalDataPostType, modalDataUser, modalDataTag, modalDataVoteType, modalDataComment, modalDataRole, modalDataNotification, modalDataPrivilege, modalDataUserPrivilege } = require('./sequelize/modalData');
const modelSync = require('./sequelize/modelSync');

const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

//config cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//config cors
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
}))

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
app.use('/api/v1/', apiImageRoutes);
app.use('/api/v1/', apiEditPostRoutes);
app.use('/api/v1/', apiPostRoutes);
app.use('/api/v1/', apiNotificationRoutes);
app.use('/api/v1/', apiEditTagRoutes);
app.use('/api/v1/', apiListSaveRoutes);
app.use('/api/v1/', apiItemSaveRoutes);
app.use('/api/v1/', apiFollowRoutes);
app.use('/api/v1/', apiPrivilegeRoutes);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})