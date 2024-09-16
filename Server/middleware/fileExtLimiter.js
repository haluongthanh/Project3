const path = require("path");

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        if (req.files) {
            const files = req.files;

            let fileExtensions = [];
            Object.keys(files).forEach(key => {
                fileExtensions.push(path.extname(files[key].name));
            });

            const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext));

            if (!allowed) {
                const message = `Upload failed. Only - ${allowedExtArray.join(', ')} files are allowed.`;
                return res.status(422).json({ status: "error", message });
            }
        }
        next();
    };
};

module.exports = fileExtLimiter;