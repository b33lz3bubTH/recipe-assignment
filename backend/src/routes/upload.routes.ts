import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';

const router = Router();

/**
 * @route   POST /api/upload/image
 * @desc    Upload an image file (JPEG, JPG, PNG)
 * @access  Public
 */
router.post('/image', uploadController.uploadImage);

/**
 * @route   GET /api/upload/file
 * @desc    Serve uploaded file by filename
 * @access  Public
 */
router.get('/file', uploadController.serveFile);

/**
 * @route   GET /api/upload/files
 * @desc    Get list of uploaded files (for debugging)
 * @access  Public
 */
router.get('/files', uploadController.getUploadedFiles);

export default router; 