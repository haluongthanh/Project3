const express = require('express');
const { checkrefreshPassword, resetPassword, forgotPassword, AuthGoogle, registerUser, loginUser, logout, updatePassword, updateProfile, getUsers, getUserDetails, updateUserRole, deleteUser, refreshToken } = require('../controllers/userController');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');
const passport = require('passport')
const pastportConfig = require('../utils/passport')
const router = express.Router();

const CLIENT_URL = 'http://localhost:3000';

router.route('/register')
    .post(registerUser)

router.route('/login').post(loginUser);
router.route('/refresh').get(refreshToken);
router.route('/logout').post(logout);
router.route('/password/update').put(isAuthenticated, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetPassword').post(resetPassword).get(checkrefreshPassword);

router.route('/me/update').put(isAuthenticated,
    fileUpload({ createParentPath: true }),
    fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp']),
    fileSizeLimiter,
    updateProfile)

router.route('/users').get(isAuthenticated,
    authorizeRoles('admin'),
    getUsers);

router.route('/users/:id').get(isAuthenticated, authorizeRoles('admin'), getUserDetails).put(isAuthenticated, authorizeRoles('admin'), updateUserRole).delete(isAuthenticated, authorizeRoles('admin'), deleteUser)

router.route('/auth/googleLogin').post(AuthGoogle);

router.route('/auth/google').get(passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.route('/auth/google/callback').get(passport.authenticate("google", {
    successRedirect: `${CLIENT_URL}/google`,
    failureRedirect: `${CLIENT_URL}/auth`,
}));

router.route('/auth/facebook').get(passport.authenticate('facebook', { session: false, scope: ['email'] }));
router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
    successRedirect: `${CLIENT_URL}/google`,
    failureRedirect: `${CLIENT_URL}/auth`,
}))

router.get("/auth/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            cookies: req.cookies
        });
    }
});


module.exports = router;