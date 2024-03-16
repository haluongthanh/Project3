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
        reuired: [true, 'Plaese enter blog description.']
    },
    ImageURL: {
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
    blogStatus: {
        type: String,
        enum: ['active', 'pause'],
        default: 'pause'
    }
})
module.exports = mongoose.model('Blog', blogSchema)