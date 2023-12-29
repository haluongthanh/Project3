const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter banner name.'],
        trim: true,
        unique: [true, 'This banner is exists.']
    },
    ImageURL: {
        url: { type: String }
    },
    LinkURL: {
        type: String
    },
    bannerStatus: {
        type: String,
        required: true,
        enum: ['slide', 'pause', 'bottom', 'right'],
        default: 'pause'
    },
    addedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    discontinued: { Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model("Banner", bannerSchema);