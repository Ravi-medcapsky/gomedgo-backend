import { providerPhotoModel } from '../models/providerPhoto.model.js';
import  {providerModel} from '../models/provider.model.js'


export const fetchProviderPhoto = async (servivce_provider_id) =>{
try{
     
     
      const fetchPhoto =  await  providerPhotoModel.getPhotoByProviderId(servivce_provider_id);
      
     return fetchPhoto;
 
   }catch (error) {
    console.error('Error Fetch  Provider Photo:', error);
    throw error;
   }


};

export const updateProviderPhoto = async (data) =>{
try{
     const {service_provider_id, fileBuffer} =data;
      const updatePhoto =  await  providerPhotoModel.upadatePhoto({service_provider_id, fileBuffer});
      console.log('Update Photo',updatePhoto )
    
    return updatePhoto;
   }catch (error) {
    console.error('Error Update  Provider Photo:', error);
    throw error;
   }

};

export const createProviderPhoto = async (data) =>{
try{
     const {service_provider_id, fileBuffer} =data;
      const createPhoto =  await  providerPhotoModel.createPhoto({service_provider_id, fileBuffer});
      console.log('insert Photo',createPhoto )
       return createPhoto;
 
   }catch (error) {
    console.error('Error Insert  Provider Photo:', error);
    throw error;
   }
};
   export const deleteProviderPhoto = async (data) =>{
try{
     const {service_provider_id} =data;
      const createPhoto =  await  providerPhotoModel.deletePhoto({service_provider_id});
      console.log('Delete Photo',createPhoto )
    
 
   }catch (error) {
    console.error('Error Delete  Provider Photo:', error);
    throw error;
   }

};