// src/routes/upload.ts

import express from 'express';
import cloudinary from '../config/cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma  = new PrismaClient();


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    //@ts-ignore
    folder: 'uploads',
    allowed_formats: ['png', 'pdf'],
    resource_type: 'auto',
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
});

router.post('/upload', upload.single('file'), async (req, res) => {
    const userId  = req.headers.authorization
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log(req.file)
    const { originalname, mimetype, size } = req.file;
    const { public_id, secure_url } = req.file as any;
    console.log(public_id)
    console.log(secure_url)

    const file = await prisma.file.create({
        //@ts-ignore
        data: {
        name: originalname,
        url: secure_url,
        publicId: public_id,
        size: size,
        mimeType: mimetype,
        userId:userId
      },
    });

    res.status(200).json({ message: 'File uploaded successfully', file });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as fileUploader};