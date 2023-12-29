const Banner = require('../models/bannerModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const { saveImages, removeFiles } = require('../utils/processImages');

exports.addBanner = asyncHandler(async(req, res, next) => {
    req.body.addedBy = req.userInfo.userId;
    if (req.body.bannerStatus == "bottom" || req.body.bannerStatus == "right") {
        const bannersUsingBottom = await Banner.find({
            _id: { $ne: req.params.id },
            bannerStatus: 'bottom',
        });
        const bannersUsingRight = await Banner.find({
            _id: { $ne: req.params.id },
            bannerStatus: 'right',
        });


        if (req.body.bannerStatus == "bottom") {
            if (bannersUsingBottom.length > 1) {
                // Có banner khác đang sử dụng "pause" status
                return next(new ErrorHandler('Other banners are using "bottom" status.', 400));
            }
        }

        if (req.body.bannerStatus == "right") {
            if (bannersUsingRight.length > 2) {
                // Có banner khác đang sử dụng "pause" status
                return next(new ErrorHandler('Other banners are using "right" status.', 400));
            }
        }
        const banner = await Banner.create(req.body);
        if (Banner) {
            const path = `BannerImg/${banner._id}`
            const BannerImg = await saveImages(req.files, path);
            banner.ImageURL = { url: BannerImg[0] }
            await banner.save();
            res.status(201).json({ success: true, banner });
        }
    } else {
        const banner = await Banner.create(req.body);
        if (Banner) {
            const path = `BannerImg/${banner._id}`
            const BannerImg = await saveImages(req.files, path);
            banner.ImageURL = { url: BannerImg[0] }
            await banner.save();
            res.status(201).json({ success: true, banner });
        }
    }

})

exports.getBanners = asyncHandler(async(req, res, next) => {
    const banners = await Banner.find();
    res.status(200).json({ success: true, banners });
})

exports.getBannerDetails = asyncHandler(async(req, res, next) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return next(new ErrorHandler('banner not found.', 404))
    res.status(200).json({ success: true, banner });
})

exports.updateBanner = asyncHandler(async(req, res, next) => {

    req.body.updatedBy = req.userInfo.userId;


    let banner = await Banner.findById(req.params.id);

    if (!banner) return next(new ErrorHandler('banner not found.', 404))

    if (req.body.bannerStatus == "bottom" || req.body.bannerStatus == "right") {
        const bannersUsingBottom = await Banner.find({
            _id: { $ne: req.params.id },
            bannerStatus: 'bottom',
        });
        const bannersUsingRight = await Banner.find({
            _id: { $ne: req.params.id },
            bannerStatus: 'right',
        });


        if (req.body.bannerStatus == "bottom") {
            if (bannersUsingBottom.length > 1) {
                // Có banner khác đang sử dụng "pause" status
                return next(new ErrorHandler('Other banners are using "bottom" status.', 400));
            }
        }

        if (req.body.bannerStatus == "right") {
            if (bannersUsingRight.length > 2) {
                // Có banner khác đang sử dụng "pause" status
                return next(new ErrorHandler('Other banners are using "right" status.', 400));
            }
        }

        // Nếu không có banner nào sử dụng "pause", tiếp tục cập nhật
        banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });

        if (banner) {
            if (req.files) {
                const path = `BannerImg/${banner._id}`;
                const remove = removeFiles(path);

                if (remove) {
                    const BannerImg = await saveImages(req.files, path);
                    banner.ImageURL = { url: BannerImg[0] };
                    await banner.save();
                } else {
                    return next(new ErrorHandler('Not proceeded.', 500));
                }
            }
        }

        res.status(201).json({ success: true, banner });

    } else {

        banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });


        if (banner) {
            if (req.files) {
                const path = `BannerImg/${banner._id}`;
                const remove = removeFiles(path);
                if (remove) {
                    const BannerImg = await saveImages(req.files, path);
                    banner.ImageURL = { url: BannerImg[0] };
                    await banner.save();
                } else {
                    return next(new ErrorHandler('Not procceded.', 500))
                }
            }
        }
        res.status(201).json({ success: true, banner });
    }
});


exports.deleteBanner = asyncHandler(async(req, res, next) => {
    let banner = await Banner.findById(req.params.id);
    if (!banner) return next(new ErrorHandler('banner not found.', 404))
    if (banner.bannerStatus != "pause") return next(new ErrorHandler('banner no status pause'))
    const path = `BannerImg/${banner._id}`;
    removeFiles(path);

    await banner.remove();
    res.status(200).json({ success: true, messge: 'banner deleted' });
});