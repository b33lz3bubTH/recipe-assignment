import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Request } from 'express';
import fs from 'fs';

const allowedMimeTypes = [
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/gif', 
  'image/webp'
];

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    try {
      const uploadsDir = ensureUploadsDir();
      cb(null, uploadsDir);
    } catch (error) {
      cb(new Error('Failed to create uploads directory'), '');
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    try {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return cb(new Error('Invalid file extension'), '');
      }

      const uniqueName = uuidv4();
      const filename = `${uniqueName}${fileExtension}`;
      cb(null, filename);
    } catch (error) {
      cb(new Error('Failed to generate filename'), '');
    }
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return cb(new Error(`Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`));
    }

    if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
      return cb(new Error('Invalid filename contains path traversal characters'));
    }

    cb(null, true);
  } catch (error) {
    cb(new Error('File validation failed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only allow 1 file
  }
});

export const uploadImageMiddleware = upload.single('file');

export const handleMulterErrors = (err: any, req: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
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

export const uploadImage = (req: Request, res: any, next: any) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      // Handle specific multer errors
      if (err instanceof multer.MulterError) {
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

export interface UploadedFileInfo {
  filename: string;
  mimetype: string;
  originalName: string;
}

export const getFileInfo = (file: Express.Multer.File): UploadedFileInfo => {
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
  } catch (error) {
    throw new Error('Failed to get file information');
  }
};

export const validateFileExists = (filename: string): boolean => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, filename);
    
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}; 