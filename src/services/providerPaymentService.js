import * as  providerPaymentAssetsModel  from '../models/providerPaymentAssets.model.js';


export const fetchProviderPaymentAssets = async (service_provider_id) =>{
try{
    
    
      const fetchProvider =  await providerPaymentAssetsModel.getProviderPaymentAssets(service_provider_id);
     console.log('fetched Provider Payment Assets exist',fetchProvider)
     return fetchProvider;
 
   }catch (error) {
    console.error('Error fetch  Payment Assets data:', error);
    throw error;
   }

};
//create Account details
export const  providerPaymentAssets = async (data) => {
  try {
    console.log("inside",data)
    const { service_provider_id,bank_holder_name,account_number ,bank_name, ifsc_code } = data;

    const newProviderPayment = await providerPaymentAssetsModel.create({service_provider_id,bank_holder_name,account_number,bank_name,ifsc_code});
    return newProviderPayment;
  } catch (error) { 
    console.error('Error creating service provider payment:', error);
    throw error;
  }
};
//create UPI details
export const  providerPaymentUpiAssets = async (data) => {
  try {
    console.log("inside",data)
    const { service_provider_id,upi_id } = data;

    const newProviderPaymentUPI = await providerPaymentAssetsModel.createUPI({service_provider_id,upi_id});
    return newProviderPaymentUPI;
  } catch (error) { 
    console.error('Error creating service provider payment:', error);
    throw error;
  }
};


//update Account
export const  updateproviderPaymentAssets = async (data) => {
  try {
    console.log("inside",data)
    const { upi_id } = data;
    const updateProviderPayment = await providerPaymentAssetsModel.updatePayment({upi_id});
    return updateProviderPayment
  } catch (error) { 
    console.error('Error creating service provider payment:', error);
    throw error;
  }
};
//update UPI
export const  updateproviderPaymentUpiAssets = async (data) => {
  try {
    const { service_provider_id,upi_id } = data;
    const newProviderPayment = await providerPaymentAssetsModel.updatePayment({service_provider_id,upi_id,});
    return { success: true, data: newProviderPayment };
  } catch (error) { 
    console.error('Error creating service provider payment:', error);
    throw error;
  }
};