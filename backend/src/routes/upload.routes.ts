import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { uploadImageMiddleware, handleMulterErrors } from '../plugins/upload.plugin';

const router = Router();


router.post('/image', uploadImageMiddleware, handleMulterErrors, uploadController.uploadImage);

router.get('/file', uploadController.serveFile);

router.get('/files', uploadController.getUploadedFiles);

export default router; 