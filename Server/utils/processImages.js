const path = require("path");
const fs = require("fs");

const saveImages = async(files, getPath) => {
    let returnPath = [];

    const fileSavePromises = Object.keys(files).map(key => {
        return new Promise((resolve, reject) => {
            let fileConvertedName = Date.now().toString();
            let extensionName = path.extname(files[key].name);
            let fileName = fileConvertedName + extensionName;
            const filePath = path.join(__dirname, '..', `/public/images/${getPath}/`, fileName);

            returnPath.push(`/images/${getPath}/` + fileName);

            files[key].mv(filePath, (err) => {
                if (err) {
                    console.error(`Error moving file ${fileName}:`, err);
                    return reject(err);
                }
                resolve();
            });
        });
    });

    try {
        await Promise.all(fileSavePromises);
    } catch (err) {
        console.error('Error saving images:', err);
        throw err;
    }

    return returnPath;
};

const removeFiles = (getPath) => {
    const filePath = path.join(__dirname, '..', `/public/images/${getPath}/`);
    let removed = true;

    if (fs.existsSync(filePath)) {
        try {
            fs.rmdirSync(filePath, { recursive: true });
        } catch (err) {
            console.error('Error removing files:', err);
            removed = false;
        }
    }
    return removed;
};

const removeFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error removing file:', err);
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

module.exports = { saveImages, removeFiles, removeFile };