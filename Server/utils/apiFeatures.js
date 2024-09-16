const mongoose = require('mongoose');

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        let keyword = {};

        if (this.queryStr.keyword) {
            const keywordStr = this.queryStr.keyword.toString();
            const keywordNum = Number(this.queryStr.keyword);

            if (mongoose.Types.ObjectId.isValid(keywordStr)) {
                keyword = {
                    _id: mongoose.Types.ObjectId(keywordStr)
                };
            } else if (isNaN(keywordNum)) {
                keyword = {
                    $or: [
                        { title: { $regex: keywordStr, $options: 'i' } },
                        { name: { $regex: keywordStr, $options: 'i' } },
                        { email: { $regex: keywordStr, $options: 'i' } },
                        { entityType: { $regex: keywordStr, $options: 'i' } },
                        { 'shippingInfo.name': { $regex: keywordStr, $options: 'i' } },
                        { orderCode: { $regex: keywordStr, $options: 'i' } }

                    ]
                };
            } else {
                keyword = {
                    $or: [
                        { title: { $regex: keywordStr, $options: 'i' } },
                        { name: { $regex: keywordStr, $options: 'i' } },
                        { email: { $regex: keywordStr, $options: 'i' } },
                        { entityType: { $regex: keywordStr, $options: 'i' } },
                        { 'shippingInfo.name': { $regex: keywordStr, $options: 'i' } },
                        { 'shippingInfo.phone': keywordNum },
                        { orderCode: { $regex: keywordStr, $options: 'i' } }
                    ]
                };
            }
        }

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        const removeFields = ["keyword", "page", "limit", "sort_by_ratings", "sort_by_oldest"];
        removeFields.forEach(key => delete queryCopy[key]);

        if (queryCopy.status) {
            this.query = this.query.find({
                $or: [
                    { Status: queryCopy.status },
                    { orderStatus: queryCopy.status }
                ]
            });
            delete queryCopy.status;
        }

        if (queryCopy.category) {
            const categories = queryCopy.category.split(',').map(cat => mongoose.Types.ObjectId(cat.trim()));
            this.query = this.query.find({
                category: { $in: categories }
            });
            delete queryCopy.category;
        }
        if (queryCopy.brand) {
            const brands = queryCopy.brand.split(',').map(cat => mongoose.Types.ObjectId(cat.trim()));
            this.query = this.query.find({
                brand: { $in: brands }
            });
            delete queryCopy.category;
        }
        if (queryCopy.action) {
            this.query = this.query.find({
                $or: [{ action: queryCopy.action }]
            });
            delete queryCopy.action;
        }


        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;
