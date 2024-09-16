const Banner = require('../models/bannerModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const { saveImages, removeFiles } = require('../utils/processImages');
const ApiFeatures = require('../utils/apiFeatures');
const { logAction } = require('../utils/log')

exports.addBanner = asyncHandler(async (req, res, next) => {
    req.body.addedBy = req.userInfo.userId;
    if (req.body.Status == "bottom" || req.body.Status == "right") {
        const bannersUsingBottom = await Banner.find({
            _id: { $ne: req.params.id },
            Status: 'bottom',
        });
        const bannersUsingRight = await Banner.find({
            _id: { $ne: req.params.id },
            Status: 'right',
        });


        if (req.body.Status == "bottom") {
            if (bannersUsingBottom.length > 1) {
                return next(new ErrorHandler('Các biểu ngữ khác đang sử dụng trạng thái "dưới".', 400));
            }
        }

        if (req.body.Status == "right") {
            if (bannersUsingRight.length > 2) {
                return next(new ErrorHandler('Các biểu ngữ khác đang sử dụng trạng thái "Trái".', 400));
            }
        }
        const banner = await Banner.create(req.body);
        if (banner) {
            await logAction(
                'Create Banner',
                'CREATE',
                'Blog',
                banner._id,
                req.userInfo.userId,
                null,
                req.body
            );

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
            await logAction(
                'Create Banner',
                'CREATE',
                'Blog',
                banner._id,
                req.userInfo.userId,
                null,
                req.body
            );

            await banner.save();

            res.status(201).json({ success: true, banner });
        }
    }

})

exports.getBanners = asyncHandler(async (req, res, next) => {
    const banners = await Banner.find({ Status: { $ne: 'pause' } });
    res.status(200).json({ success: true, banners });
})
exports.getBannersAuthorizeRole = asyncHandler(async (req, res, next) => {
    let resultPerPage;
    if (req.query.limit) {
        resultPerPage = parseInt(req.query.limit);
    } else {
        resultPerPage = 8;
    }

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

    const bannerCount = await Banner.countDocuments();

    const apiFeature = new ApiFeatures(Banner.find().sort(sortBy), req.query)
        .search()
        .filter();

    const filteredApiFeature = new ApiFeatures(Banner.find().sort(sortBy), req.query)
        .search()
        .filter();

    let filteredBanners = await filteredApiFeature.query;
    let filteredBannersCount = filteredBanners.length;

    apiFeature.pagination(resultPerPage);
    const banners = await apiFeature.query;

    res.status(200).json({
        success: true,
        banners,
        bannerCount,
        resultPerPage,
        filteredBannersCount,
    });
})


exports.getBannerDetails = asyncHandler(async (req, res, next) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return next(new ErrorHandler('Không Tìm Thấy Biểu Ngữ.', 404))
    res.status(200).json({ success: true, banner });
})

exports.updateBanner = asyncHandler(async (req, res, next) => {

    req.body.updatedBy = req.userInfo.userId;


    let banner = await Banner.findById(req.params.id);

    if (!banner) return next(new ErrorHandler('Không Tìm Thấy Biểu Ngữ.', 404))
        const oldValue = banner;

    if (req.body.Status == "bottom" || req.body.Status == "right") {
        const bannersUsingBottom = await Banner.find({
            _id: { $ne: req.params.id },
            Status: 'bottom',
        });
        const bannersUsingRight = await Banner.find({
            _id: { $ne: req.params.id },
            Status: 'right',
        });


        if (req.body.Status == "bottom") {
            if (bannersUsingBottom.length > 1) {
                return next(new ErrorHandler('Các biểu ngữ khác đang sử dụng trạng thái "dưới".', 400));
            }
        }

        if (req.body.Status == "right") {
            if (bannersUsingRight.length > 2) {
                return next(new ErrorHandler('Các biểu ngữ khác đang sử dụng trạng thái "trái".', 400));
            }
        }

        banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
        await logAction(
            'Update Banner',
            'UPDATE',
            'Banner',
            banner._id,
            req.userInfo.userId,
            oldValue,
            req.body
        );
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
            await logAction(
                'Update Banner',
                'UPDATE',
                'Banner',
                banner._id,
                req.userInfo.userId,
                oldValue,
                req.body
            );
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


exports.deleteBanner = asyncHandler(async (req, res, next) => {
    let banner = await Banner.findById(req.params.id);
    req.body.updatedBy = req.userInfo.userId;

    if (!banner) return next(new ErrorHandler('Không Tìm Thấy Biểu Ngữ.', 404))
    if (banner.Status != "pause") return next(new ErrorHandler('Biểu ngữ không có trạng thái "tạm dừng". Không thể xóa'))
    const path = `BannerImg/${banner._id}`;
    removeFiles(path);
    const oldValue = banner;

    await logAction(
        'Delete Banner',
        'DELETE',
        'Banner',
        banner._id,
        req.userInfo.userId,
        oldValue,
        null
    );


    await banner.remove();
    res.status(200).json({ success: true, messge: 'biểu ngữ đã xóa' });
});