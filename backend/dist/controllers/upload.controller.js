"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = void 0;
const upload_plugin_1 = require("../plugins/upload.plugin");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class UploadController {
    constructor() {
        this.uploadImage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            try {
                if (!req.file) {
                    throw new ApiError_1.ApiError(400, 'No file uploaded');
                }
                if (!req.file.filename || !req.file.mimetype || !req.file.originalname) {
                    throw new ApiError_1.ApiError(400, 'Invalid file information received');
                }
                // Validate file exists on disk
                const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
                const filePath = path_1.default.join(uploadsDir, req.file.filename);
                if (!fs_1.default.existsSync(filePath)) {
                    throw new ApiError_1.ApiError(500, 'File was not saved properly');
                }
                const fileInfo = (0, upload_plugin_1.getFileInfo)(req.file);
                res.status(200).json(new ApiResponse_1.ApiResponse(200, fileInfo, 'File uploaded successfully'));
            }
            catch (error) {
                // Clean up any partially uploaded file
                if (req.file && req.file.filename) {
                    try {
                        const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
                        const filePath = path_1.default.join(uploadsDir, req.file.filename);
                        if (fs_1.default.existsSync(filePath)) {
                            fs_1.default.unlinkSync(filePath);
                        }
                    }
                    catch (cleanupError) {
                        console.error('Failed to cleanup uploaded file:', cleanupError);
                    }
                }
                throw error;
            }
        });
        this.serveFile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { file } = req.query;
            if (!file || typeof file !== 'string') {
                throw new ApiError_1.ApiError(400, 'File parameter is required');
            }
            if (file.includes('..') || file.includes('/') || file.includes('\\')) {
                throw new ApiError_1.ApiError(400, 'Invalid filename');
            }
            if (!(0, upload_plugin_1.validateFileExists)(file)) {
                throw new ApiError_1.ApiError(404, 'File not found');
            }
            const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
            const filePath = path_1.default.join(uploadsDir, file);
            try {
                const stats = fs_1.default.statSync(filePath);
                const fileSize = stats.size;
                if (fileSize > 10 * 1024 * 1024) { // 10MB limit for serving
                    throw new ApiError_1.ApiError(400, 'File too large to serve');
                }
                const ext = path_1.default.extname(file).toLowerCase();
                let mimeType = 'application/octet-stream';
                switch (ext) {
                    case '.jpg':
                    case '.jpeg':
                        mimeType = 'image/jpeg';
                        break;
                    case '.png':
                        mimeType = 'image/png';
                        break;
                    case '.gif':
                        mimeType = 'image/gif';
                        break;
                    case '.webp':
                        mimeType = 'image/webp';
                        break;
                    default:
                        mimeType = 'application/octet-stream';
                }
                res.setHeader('Content-Length', fileSize);
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Content-Disposition', `inline; filename="${file}"`);
                res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
                const fileStream = fs_1.default.createReadStream(filePath);
                fileStream.on('error', (error) => {
                    console.error('Error streaming file:', error);
                    if (!res.headersSent) {
                        res.status(500).json(new ApiResponse_1.ApiResponse(500, null, 'Error serving file'));
                    }
                });
                fileStream.pipe(res);
            }
            catch (error) {
                if (error instanceof ApiError_1.ApiError) {
                    throw error;
                }
                throw new ApiError_1.ApiError(500, 'Error serving file');
            }
        });
        this.getUploadedFiles = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
            try {
                if (!fs_1.default.existsSync(uploadsDir)) {
                    return res.status(200).json(new ApiResponse_1.ApiResponse(200, { files: [] }, 'No files uploaded yet'));
                }
                const files = fs_1.default.readdirSync(uploadsDir);
                const fileList = files
                    .filter(filename => {
                    const ext = path_1.default.extname(filename).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
                })
                    .map(filename => ({
                    filename,
                    path: `/api/upload/file?file=${encodeURIComponent(filename)}`
                }));
                res.status(200).json(new ApiResponse_1.ApiResponse(200, { files: fileList }, 'Files retrieved successfully'));
            }
            catch (error) {
                throw new ApiError_1.ApiError(500, 'Error retrieving files');
            }
        });
    }
}
exports.uploadController = new UploadController();
