import * as ProfileDocModel from '../models/providerDocument.model.js';
import * as providerService from './providerService.js'
import session from 'express-session';
 
// create/save
export const saveProviderDocument = async (req, res) => {
  try {
    const service_provider_id = req.session.service_provider_id;
    console.log("service_provider_id", service_provider_id);

    if (!service_provider_id) {
      return res.status(400).json({ message: "Service provider not logged in" });
    }

    console.log("body ", req.body);
    console.log("files", req.files);

    // Step 1: Check if document exists
    const documents = await ProfileDocModel.fetchProviderDocumentsByServiceProviderId(service_provider_id);
    console.log("documents", documents);

    if (!documents) {
      // Step 2: If not exists → insert new
      await ProfileDocModel.insertProviderDocument(service_provider_id, req.body, req.files);
      return res.status(201).json({staus:201, message: "New provider document inserted successfully" });
    } else {
      // Step 3: If exists → update
      await ProfileDocModel.updateProviderDocumentById(service_provider_id, req.body, req.files);
      return res.status(200).json({staus:200, message: "Document updated successfully" });
    }
  } catch (err) {
    console.error("Error saving provider document:", err);
    res.status(500).json({ staus:500,message: "Error saving provider document", error: err.message });
  }
};

 
// fetch
export const getMyProviderDocuments = async (req, res) => {
  try {
     const service_provider_id = req.session.service_provider_id
    const documents = await ProfileDocModel.fetchProviderDocumentsByServiceProviderId(service_provider_id );
    res.status(200).json({ staus:200,documents });
  } catch (err) {
    console.error(' Fetch Error:', err);
    res.status(500).json({staus:500, error: err.message });
  }
};
 
// update
export const updateProviderDocument = async (req, res) => {
  try {
         const service_provider_id = req.session.service_provider_id
      consle.log('service_provider_id',service_provider_id)
    await ProfileDocModel.updateProviderDocumentById(service_provider_id ,req.body);
    res.status(200).json({staus:200, message: ' Document updated successfully' });
  } catch (err) {
    console.error(' Update Error:', err);
    res.status(500).json({staus:500, error: err.message });
  }
};
 
// delete
export const deleteProviderDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await ProfileDocModel.deleteProviderDocumentById(id);
    res.status(200).json({staus:200, message: ' Document deleted successfully' });
  } catch (err) {
    console.error(' Delete Error:', err);
    res.status(500).json({staus:500, error: err.message });
  }
};