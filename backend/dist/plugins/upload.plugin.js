"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileExists = exports.getFileInfo = exports.uploadImage = exports.handleMulterErrors = exports.uploadImageMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const ensureUploadsDir = () => {
    const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
    return uploadsDir;
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        try {
            const uploadsDir = ensureUploadsDir();
            cb(null, uploadsDir);
        }
        catch (error) {
            cb(new Error('Failed to create uploads directory'), '');
        }
    },
    filename: (req, file, cb) => {
        try {
            const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                return cb(new Error('Invalid file extension'), '');
            }
            const uniqueName = (0, uuid_1.v4)();
            const filename = `${uniqueName}${fileExtension}`;
            cb(null, filename);
        }
        catch (error) {
            cb(new Error('Failed to generate filename'), '');
        }
    }
});
const fileFilter = (req, file, cb) => {
    try {
        if (!file) {
            return cb(new Error('No file provided'));
        }
        if (!file.mimetype || !allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
        }
        if (!file.originalname || file.originalname.trim() === '') {
            return cb(new Error('Invalid filename'));
        }
        const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return cb(new Error(`Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`));
        }
        if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
            return cb(new Error('Invalid filename contains path traversal characters'));
        }
        cb(null, true);
    }
    catch (error) {
        cb(new Error('File validation failed'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1, // Only allow 1 file
    }
});
exports.uploadImageMiddleware = upload.single('file');
const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    statusCode: 400,
                    message: 'File size too large. Maximum size is 5MB',
                    success: false
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Too many files. Only one file allowed',
                    success: false
                });
            default:
                return res.status(400).json({
                    statusCode: 400,
                    message: `Upload error: ${err.message}`,
                    success: false
                });
        }
    }
    if (err) {
        return res.status(400).json({
            statusCode: 400,
            message: err.message || 'Upload failed',
            success: false
        });
    }
    next();
};
exports.handleMulterErrors = handleMulterErrors;
const uploadImage = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            // Handle specific multer errors
            if (err instanceof multer_1.default.MulterError) {
                switch (err.code) {
                    case 'LIMIT_FILE_SIZE':
                        return next(new Error('File size too large. Maximum size is 5MB'));
                    case 'LIMIT_FILE_COUNT':
                        return next(new Error('Too many files. Only one file allowed'));
                    default:
                        return next(new Error(`Upload error: ${err.message}`));
                }
            }
            return next(err);
        }
        next();
    });
};
exports.uploadImage = uploadImage;
const getFileInfo = (file) => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }
        if (!file.filename || !file.mimetype || !file.originalname) {
            throw new Error('Invalid file information');
        }
        return {
            filename: file.filename,
            mimetype: file.mimetype,
            originalName: file.originalname
        };
    }
    catch (error) {
        throw new Error('Failed to get file information');
    }
};
exports.getFileInfo = getFileInfo;
const validateFileExists = (filename) => {
    try {
        const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
        const filePath = path_1.default.join(uploadsDir, filename);
        return fs_1.default.existsSync(filePath) && fs_1.default.statSync(filePath).isFile();
    }
    catch (error) {
        return false;
    }
};
exports.validateFileExists = validateFileExists;
