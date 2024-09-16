const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { getAccessToken, getRefreshToken } = require('../utils/getTokens');
const { sendUser } = require('../utils/sendUser');
const jwt = require('jsonwebtoken');
const { saveImages, removeFiles } = require('../utils/processImages');
const { sendVerificationEmail, generateVerificationCode } = require('../utils/emailUtils');
const secretKey = 'hbs3550'
/* const cookieOption={httpOnly:true,secure:true,sameSite:'None',maxAge:24*60*60*1000}; */
const cookieOption = { httpOnly: true };
const crypto = require('crypto')
const { logAction } = require('../utils/log')

const ApiFeatures = require('../utils/apiFeatures');

exports.AuthGoogle = asyncHandler(async (req, res, next) => {
    const { email, name } = req.body;
    const cookies = req.cookies;
    let user = await User.findOne({ email: email });

    if (user) {
        let newRefreshTokenArray = user.refreshToken ? user.refreshToken : [];
        const accessToken = getAccessToken(user);
        const newRefreshToken = getRefreshToken(user);
        if (cookies?.jwt) {
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();
            if (!foundToken) {
                console.log('attempted refresh token reuse at login');
                newRefreshTokenArray = [];
            }
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }
        await logAction(
            'Login User',
            'LOGIN',
            'User',
            user._id,
            user._id,
            {
                name: user.name,
                email: user.email,
            },
            null
        );
        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await user.save();
        res.cookie('jwt', newRefreshToken, cookieOption);
        res.status(200).json({ success: true, accessToken, user: sendUser(user) });
    }else{
        return next(new ErrorHandler('error'))
    }
});


exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const { email } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) return next(new ErrorHandler('email không tồn tại'));

    const refreshPassword = crypto.randomBytes(10).toString('hex');

    user.refreshPassword = refreshPassword;
    user.resetPasswordExpire = Date.now() + 600000;

    await user.save();

    const resetLink = `http:/localhost:3000/reset-password/${refreshPassword}`;
    const text = `<h1>reset password link: <a href='${resetLink}'>Reset Password</h1>`;

    sendVerificationEmail(user, text);

    res.status(200).json({ success: true });


})
exports.checkrefreshPassword = asyncHandler(async (req, res, next) => {
    const { refreshPassword } = req.query;
    let user = await User.findOne({ refreshPassword: refreshPassword });
    if (!user) {
        return res.status(200).json({ success: false });
    }
    res.status(200).json({ success: true });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { password, refreshPassword } = req.body;
    let user = await User.findOne({ refreshPassword: refreshPassword });

    if (!user) return next(new ErrorHandler('Mã refreshPassword không hợp lệ hoặc đã hết hạn'));

    if (user.resetPasswordExpire < Date.now()) return next(new ErrorHandler('Mã refreshPassword đã hết hạn'));

    user.password = password;
    user.refreshPassword = undefined;

    await user.save();
    res.status(200).json({ success: true, message: 'Mật khẩu đã được cập nhật thành công' });


})
exports.registerUser = asyncHandler(async (req, res, next) => {

    const { email, name, password } = req.body;
    let user = await User.findOne({ email }).exec();
    if (user) return next(new ErrorHandler('Email này đã được sử dụng. Bạn có thể đăng nhập hoặc sử dụng email khác để đăng ký.', 409));
    // const emailVerificationCode = generateVerificationCode();
    user = await User.create({ email, name, password });
    // if (user) {
    //     const path = `avatar/${user._id}`;
    //     const userAvatar = await saveImages(req.files, path);
    //     user.avatar = { url: userAvatar[0] };
    //     // sendVerificationEmail(user,emailVerificationCode);
    //     await user.save();
    //     res.status(201).json({ success: true, user });

    // }
    await logAction(
        'Create User',
        'Create',
        'User',
        user._id,
        user._id,
        {
            name: user.name,
            email: user.email,
        },
        null
    );
    await user.save();
    res.status(201).json({ success: true, user });

})


exports.loginUser = asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandler('Vui lòng nhập email và mật khẩu', 400));
    let user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorHandler('Email hoặc mật khẩu không hợp lệ', 404));
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Email hoặc mật khẩu không hợp lệ', 404));
    } else {
        const accessToken = getAccessToken(user);
        const newRefreshToken = getRefreshToken(user);
        let newRefreshTokenArray = !cookies?.jwt ? user.refreshToken : user.refreshToken.filter(rt => rt !== cookies.jwt);
        if (cookies?.jwt) {
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            if (!foundToken) {
                console.log('attempted refresh token reuse at login');
                newRefreshTokenArray = [];
            }
            await logAction(
                'Login User',
                'LOGIN',
                'User',
                user._id,
                user._id,
                {
                    name: user.name,
                    email: user.email,
                },
                null
            );

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }
        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await user.save();
        res.cookie('jwt', newRefreshToken, cookieOption);
        res.status(200).json({ success: true, accessToken, user: sendUser(user) });
    }
})

exports.logout = asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(200).json({ success: true, message: 'Đã Đăng Xuất' });
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
        
        res.clearCookie('jwt', { httpOnly: true });
        req.session.destroy(); // Xóa hết các thông tin session
        return res.status(200).json({ success: true, message: 'Đã Đăng Xuất' });
    }
    user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
    await user.save();
    await logAction(
        'Logout User',
        'LOGOUT',
        'User',
        user._id,
        user._id,
        {
            name: user.name,
            email: user.email,
        },
        null
    );
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    req.session.destroy(); // Xóa hết các thông tin session
    res.status(200).json({ success: true, message: 'Đã Đăng Xuất' });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return next(new ErrorHandler('Vui lòng nhập mật khẩu cũ và mới', 400));

    const user = await User.findById(req.userInfo.userId).select('+password');
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) return next(new ErrorHandler('Mật khẩu cũ không đúng', 400));
    await logAction(
        'Update User Password',
        'UPDATE',
        'User',
        user._id,
        req.userInfo.userId,
        {
            name: user.name,
            email: user.email,
        },
        {
            name: user.name,
            email: user.email,
        }
    );
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true });
})

exports.updateProfile = asyncHandler(async (req, res, next) => {
    const newUserData = { name: req.body.name }

    let user = await User.findById(req.userInfo.userId);
    const oldValue = user;
    if (!user) return next(new ErrorHandler('User not found.', 404));
    user = await User.findByIdAndUpdate(req.userInfo.userId, newUserData, {
        new: true,
        runValidators: true,
        useFindAndMdify: false
    })
    if (user) {
        await logAction(
            'Update User Profile',
            'UPDATE',
            'User',
            user._id,
            req.userInfo.userId,
            oldValue,
            req.body
        );
        if (req.files) {
            const path = `avatar/${user._id}`
            const remove = removeFiles(path);
            if (remove) {
                const userImage = await saveImages(req.files, path);
                user.avatar = { url: userImage[0] }
                await user.save();
            } else {
                return next(new ErrorHandler('Not procceded.Try again later.', 500));
            }
        }
    }
    res.status(200).json({ success: true, user: sendUser(user) });
})

exports.getUsers = asyncHandler(async (req, res, next) => {
    const userId = req.userInfo.userId; // Giả sử bạn có user ID từ request (ví dụ: thông qua xác thực)

    let resultPerPage = req.query.limit ? parseInt(req.query.limit) : 8;

    let sortBy;
    if (req.query.sort_by_oldest) {
        if (req.query.sort_by_oldest === 'true') {
            sortBy = { createdAt: +1 };
        } else {
            sortBy = { createdAt: -1 };
        }
    } else {
        sortBy = { createdAt: -1 };
    }
    const userCount = await User.countDocuments({ _id: { $ne: userId } });

    const apiFeature = new ApiFeatures(User.find({ _id: { $ne: userId } }).sort(sortBy), req.query)
        .search()
        .filter();

    const filteredApiFeature = new ApiFeatures(User.find({ _id: { $ne: userId } }).sort(sortBy), req.query)
        .search()
        .filter();

    let filteredUsers = await filteredApiFeature.query;
    let filteredUsersCount = filteredUsers.length;

    apiFeature.pagination(resultPerPage);
    const users = await apiFeature.query.select('-refreshToken');

    res.status(200).json({
        success: true,
        users,
        userCount,
        resultPerPage,
        filteredUsersCount,
    });
});

exports.getUserDetails = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-refreshToken');
    if (!user) return next(new ErrorHandler('User does not exists.', 404))
    res.status(200).json({ success: true, user });
})

exports.updateUserRole = asyncHandler(async (req, res, next) => {
    const { roles, store, blocked } = req.body;
    const { userId } = req.userInfo;
    let user = await User.findById(req.params.id);
    const oldValue = user; 

    user = await User.findByIdAndUpdate(req.params.id, {
        roles,
        updatedBy: userId,
        blocked,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (user) {
        await logAction(
            'Update User Role',
            'UPDATE',
            'User',
            user._id,
            req.userInfo.userId,
            oldValue,
            user
        );
    }

    res.status(200).json({ success: true });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler('Không tìm thấy người dùng', 404));

    const activeOrder = await Order.findOne({ user: id });
    if (activeOrder) return next(new ErrorHandler('User not deleted', 400));

    const activeProduct = await Product.findOne({ $or: [{ addedBy: id }, { updatedBy: id }] });
    if (activeProduct) return next(new ErrorHandler('User not deleted', 400));
    await logAction(
        'Delete User',
        'DELETE',
        'User',
        user._id,
        req.userInfo.userId,
        user,
        null
    );
    const path = `avatar/${user._id}`;
    removeFiles(path);
    await user.remove();
    res.status(200).json({ success: true, message: 'User deleted.' });

})

exports.refreshToken = asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return next(new ErrorHandler('Unauthorised', 401));

    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const user = await User.findOne({ refreshToken });

    if (!user) {
        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return next(new ErrorHandler('Forbidden', 403));
                const hackedUser = await User.findOne({ _id: decoded.userId }).exec();
                hackedUser.refreshToken = [];
                await hackedUser.save();
            })
        return next(new ErrorHandler('Forbidden', 403));
    }
    const newRefreshTokenArray = user.refreshToken.filter(rt => rt !== refreshToken);

    jwt.verify(refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                user.refreshToken = [...newRefreshTokenArray];
                await user.save();
                return next(new ErrorHandler('Unauthorised', 401));
            }
            if (err || user._id.toString() !== decoded.userId) return next(new ErrorHandler('Forbidden', 403));

            const accessToken = getAccessToken(user);
            const newRefreshToken = getRefreshToken(user);
            user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await user.save();

            res.cookie('jwt', newRefreshToken, cookieOption);
            res.status(200).json({ success: true, accessToken, user: sendUser(user) });

        })
})