const Log = require('../models/LogModel');

async function logAction(title, action, entityType, entityId, userId=null, oldValue = null, newValue = null) {
    const logData  = new Log({
        title: title.toString(),
        action: action.toString(),
        entityType: entityType.toString(),
        entityId,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null
    });
    if (userId) {
        logData.user = userId;
    }

    const log = new Log(logData);

    try {
        await log.save();
    } catch (error) {
        console.error('Error saving log:', error);
    }
}

module.exports = { logAction };