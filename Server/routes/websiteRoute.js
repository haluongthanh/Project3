const express = require('express');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');
const { getCheckLog, getLogDetails, getwebsite, updateWebsite, getWebsiteDetails } = require('../controllers/websiteController');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');


router.route('/web').get(getwebsite);

router.route('/checklog').get(getCheckLog);

router.route('/checklog/:id').get(getLogDetails);

router.route('/web/:id')
    .get(getWebsiteDetails)
    .put(isAuthenticated,
        authorizeRoles('admin'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp', '.svg']),
        fileSizeLimiter, updateWebsite);


module.exports = router;