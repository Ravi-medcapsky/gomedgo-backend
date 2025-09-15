import express from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import { getMyProviderDocuments , saveProviderDocument,updateProviderDocument, deleteProviderDocument } from '../services/providerDocumentService.js';
import { authenticate } from '../middlewares/upload.middleware.js';
 
 
const router = express.Router();
 
router.post(
  '/upload',
  upload.fields([
    { name: 'aadhar_card', maxCount: 1 },
    { name: 'nurse_registration_card', maxCount: 1 },
    { name: 'employee_id_card', maxCount: 1 }
  ]),
  saveProviderDocument
);
 
router.get(
  '/my-documents',
  authenticate, // 🔐 Protect this route
  getMyProviderDocuments
);
 
// Update a document (by ID)
router.put(
  '/update',
  authenticate,
  updateProviderDocument
);
 
// Delete a document (by ID in URL)
router.delete(
  '/delete/:id',
  authenticate,
  deleteProviderDocument
);
 
export default router;
 
 
