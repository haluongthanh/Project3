const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter category name.'],
        trim: true,
        unique: [true, 'This category is exists.']
    },
    description: {
        type: String,
        reuired: [true, 'Plaese enter category description.']
    },
    CategoryImg: {
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

module.exports = mongoose.model("Category", categorySchema);