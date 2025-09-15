import session from 'express-session';
import * as providerService from '../services/ProviderService.js'
import * as providerPhotoServices from '../services/providerPhotoServices.js';


export const uploadPhoto = async (req, res) => {
  try {
      
        console.log("console request",req.file)
        const identifier = req.session.identifier_session; 

        if (!identifier) {
          return res.status(400).json({ error: 'identifier not found in session',status:400 });
        }

       const service_provider_id = req.session.service_provider_id;
        
        const fileBuffer = req.file.buffer;

        const existdata = await providerPhotoServices.fetchProviderPhoto(service_provider_id);
        console.log('exist data in ProviderPhoto',existdata)
        
        if(existdata){
          console.log("exist data");
          await providerPhotoServices.updateProviderPhoto({service_provider_id, fileBuffer});
           res.status(200).json({status:200, message: 'Photo updated successfully' });
         }else {
           await providerPhotoServices.createProviderPhoto({service_provider_id, fileBuffer});
           res.status(201).json({ status:201,message: 'New Photo uploaded successfully' });

         }

   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPhotos = async (req, res) => {
  try {
    const  service_provider_id  = req.session.service_provider_id;
    const photos = await providerPhotoServices.fetchProviderPhoto(service_provider_id);

    if (!photos || photos.length === 0) {
      return res.status(404).json({ 
        status: 404,
        success: false,
        message: "No photos found for this provider" 
      });
    }

    return res.status(200).json({ 
      status: 200,
      success: true,
      data: photos 
    });
  } catch (error) {
    console.error("Error fetching provider photos:", error);
    return res.status(500).json({ 
      status: 500,
      success: false,
      message: "Error fetching provider photos", 
      error: error.message 
    });
  }
};


export const updatePhoto = async (req, res) => {
  try {
       const service_provider_id = req.session.service_provider_id;

    const fileBuffer = req.file.buffer;

    const updated = await providerPhotoServices.updateProviderPhoto({ service_provider_id, fileBuffer });
    res.status(200).json({ status:200,message: 'Photo updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
      const service_provider_id = req.session.service_provider_id;

    await providerPhotoServices.deleteProviderPhoto({ service_provider_id });
    res.status(200).json({status:200,message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({status:500, error: error.message });
  }
};