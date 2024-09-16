const Website = require('../models/webModel');
const Log = require('../models/LogModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const { saveImages, removeFiles } = require('../utils/processImages');
const ApiFeatures = require('../utils/apiFeatures');
const { logAction } = require('../utils/log')


exports.getwebsite = asyncHandler(async(req, res, next) => {
    const website = await Website.find()
    res.status(200).json({ success: true, website });
})
exports.getWebsiteDetails = asyncHandler(async(req, res, next) => {
    const website = await Website.findById(req.params.id);
    if (!website) return next(new ErrorHandler('website not found.', 404))
    res.status(200).json({ success: true, website });
})

exports.getCheckLog = asyncHandler(async (req, res, next) => {
    const { action, entityType, startDate, endDate, search } = req.query;
    let resultPerPage = parseInt(req.query.limit) || 8;
    let sortBy = { createdAt: -1 }; 

    const query = {};
  

    const apiFeature = new ApiFeatures(Log.find(query).sort(sortBy), req.query)
        .search()
        .filter();

    const filteredLogsCount = await apiFeature.query.clone().countDocuments();

    apiFeature.pagination(resultPerPage);
    const logs = await apiFeature.query;
    res.status(200).json({
        success: true,
        logs,
        logCount: await Log.countDocuments(query),
        resultPerPage,
        filteredLogsCount,
    });
});


exports.getLogDetails = asyncHandler(async(req, res, next) => {
    const log = await Log.findById(req.params.id).populate('user', 'name');
    if (!log) return next(new ErrorHandler('log not found.', 404))
    res.status(200).json({ success: true, log });
})


exports.updateWebsite = asyncHandler(async(req, res, next) => {

    req.body.updatedBy = req.userInfo.userId;

    let website = await Website.findById(req.params.id);

    if (!website) return next(new ErrorHandler('website not found.', 404))

    website = await Website.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });


    if (website) {
        if (req.files) {
            const path = `BlogImg/${website._id}`;
            const remove = removeFiles(path);
            if (remove) {
                const imgBlog = await saveImages(req.files, path);
                website.logo = { url: imgBlog[0] };
                await website.save();
            } else {
                return next(new ErrorHandler('Not procceded.', 500))
            }
        }
    }
    res.status(201).json({ success: true, website });
});