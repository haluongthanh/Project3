const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Please enter blog name.'],
        trim: true,
        unique: [true, 'This blog is exists.']
    },
    description: {
        type: String,
        required: [true, 'Plaese enter blog description.']
    },
    ImageURL: {
        url: { type: String }
    },
    blogCategory: {
        type: mongoose.Schema.ObjectId,
        ref: "blogCategory",
        required: [true, 'Please select a blog.']
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true 
});
module.exports = mongoose.model('Blog', blogSchema)