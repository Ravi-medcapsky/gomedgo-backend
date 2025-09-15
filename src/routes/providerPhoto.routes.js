import express from 'express';
import multer from 'multer';
import { uploadPhoto, getPhotos, updatePhoto, deletePhoto } from '../controllers/providerPhotoController.js';

const router = express.Router();
const upload = multer();

router.post('/upload-photo', upload.single('file'), uploadPhoto);
router.get('/fetch-photos', getPhotos);
router.put('/update-photo', upload.single('file'), updatePhoto);
router.delete('/delete-photo', deletePhoto);

export default router;
