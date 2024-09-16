const mongoose = require('mongoose')

const blogCatgorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter blog category name.'],
        trim: true,
        unique: [true, 'This blog category is exists.']
    },
    description: {
        type: String,
        required: [true, 'Plaese enter blog category description.']
    },

    blogCategoryImg: {
        url: { type: String }
    },
    addedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    Status: {
        type: String,
        enum: ['active', 'pause'],
        default: 'pause'
    }
}, { timestamps: true })

module.exports = mongoose.model("blogCategory", blogCatgorySchema);