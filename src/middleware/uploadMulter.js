const multer = require('multer');
const { storage } = require('../config/cloudinary');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./src/public/images/uploads");
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1];
//         cb(null, `${file.originalname}-${Date.now()}.${ext}`);
//     }
// });

const upload = multer({
    storage: storage
});

module.exports = { upload };