const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    // parent_category: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "category",
    //     default: "65680c1293b89e3dcbf1e29d"
    // },

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
    discontinued: { Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model("Category", categorySchema);