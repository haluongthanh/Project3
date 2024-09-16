const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    title: {
        type: String, 
    },
    action: {
        type: String,
        required: true, 
    },
    entityType: {
        type: String,
        required: true, 
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    ipAddress: {
        type: String, 
    },
    oldValue: {
        type: mongoose.Schema.Types.Mixed,
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed, 
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    }
}, {
    timestamps: true 
});

logSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Log', logSchema);
