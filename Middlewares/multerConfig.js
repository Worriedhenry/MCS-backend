const  multer = require("multer");

module.exports = multer({ dest: 'uploads/',
Storage:multer.diskStorage({}),
/**
 * Filter function for files based on mimetype.
 *
 * @param {Object} req - The request object
 * @param {Object} file - The file object
 * @param {Function} cb - The callback function
 * @return {void} Callback with a boolean indicating if the file is accepted or not
 */
fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
})