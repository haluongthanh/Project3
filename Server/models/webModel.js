const mongoose = require('mongoose')

const website = new mongoose.Schema({
    logo: {
        url: { type: String, default: "/images/logo/default/defaultlogo.png" }
    },
    hotline: {
        type: Number,
        require: true,
        default: "0123456789"
    },
    email: {
        type: String,
        require: true,
        default: "base@gmail.com"
    },
    address: {
        type: String,
        require: true,
        default: "ha noi viet nam"
    },
    addedBy: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    },
    updatedBy: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    },
}, { timestamps: true })

module.exports = mongoose.model("website", website);