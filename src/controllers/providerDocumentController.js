import session from 'express-session';

import { 
  saveProviderDocument,
  getMyProviderDocuments,
  updateProviderDocument,
  deleteProviderDocument } from '../services/providerDocumentService.js';

export const ProviderDocument = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);

 

    const result = await saveProviderDocument(req.body, req.files);
    res.status(201).json({staus:2001, message: 'Documents uploaded successfully',  result });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({staus:500, error: err.message });
  }
};

export const GetMyProviderDocuments = async (req, res) => {
  try {
    await getMyProviderDocuments(req, res);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ staus:500,error: err.message });
  }
};

export const UpdateProviderDocument = async (req, res) => {
  try {
    await updateProviderDocument(req, res);
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const DeleteProviderDocument = async (req, res) => {
  try {
    await deleteProviderDocument(req, res);
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: err.message });
  }
};