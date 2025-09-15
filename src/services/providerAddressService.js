import * as providerAddressModel from '../models/providerAddress.model.js';



export const fetchProviderAddress = async (service_provider_id) =>{
try{
    
     console.log('provider',service_provider_id)
      const fetchProviderAddress =  await providerAddressModel.getProviderAddress(service_provider_id);
     console.log('fetched Provider Address exist',fetchProviderAddress)
     return fetchProviderAddress;
 
   }catch (error) {
    console.error('Error fetch  provider data:', error);
    throw error;
   }

};


export const createProviderAddressService = async (providerAddress) => {
  const result = await providerAddressModel.insertProviderAddress(providerAddress);
  return result;
};


export const updateProviderAddressService = async (providerAddress) => {

 const result = await providerAddressModel.updateProviderAddress(providerAddress);
  return result;
};


export const deleteProviderAddress = async (providerAddress) => {

 const result = await providerAddressModel.deleteProviderAddress(providerAddress);
  return result;
};





