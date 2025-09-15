
import { providerModel } from '../models/provider.model.js';

export const providerId = async (data) =>{
try{
      const {identifier,type} =data;
     console.log('identifier',identifier)
     console.log('type',type)
     if(type ==='mobile'){
      const fetchId =  await providerModel.fetchServiceProviderIdByMobile(identifier);
      return fetchId.id ;
     }else if( type === 'email'){
      const fetchId =  await providerModel.fetchServiceProviderIdByEmail(identifier);
      return fetchId.id ;
     }
    
 
   }catch (error) {
    console.error('Error fetch  provider Id:', error);
    throw error;
   }

};

export const fetchProviderConfirmed = async (service_provider_id) => {
  try {
    console.log('provider ID:', service_provider_id);

    const fetchProviderConfirmed = await providerModel.getByProviderIdConfirmed(service_provider_id);  // ✅ wrap in object
    return fetchProviderConfirmed;
  } catch (error) {
    console.error('Error fetching provider data:', error);
    throw error;
  }
};



export const fetchProvider = async (service_provider_id) => {
  try {
    console.log('provider ID:', service_provider_id);

    const fetchProvider = await providerModel.getByProviderId(service_provider_id);  // ✅ wrap in object

    console.log('Fetched Provider Data:');
    fetchProvider.forEach((provider, index) => {
      console.log(`[${index}]`, provider); 
    });

    return fetchProvider;
  } catch (error) {
    console.error('Error fetching provider data:', error);
    throw error;
  }
};



export const providerCreate = async (data) => {
  try {
    
    const { service_provider_id,first_name, last_name, email, age, gender, first_language, second_language } = data;

    // Create a new service provider in the database
    const newServiceProvider = await providerModel.create({
      service_provider_id,
      first_name,
      last_name,
      email,
      age,
      gender,
      first_language,
      second_language
    });

    const subject = `Welcome to Our App!`;
    const htmlContent = `<h1>Hello ${first_name} </h1><p>Thanks for joining us!`;
    const params = { first_name, last_name, email, age, gender, first_language, second_language };



    return  newServiceProvider ;
  } catch (error) {
    console.error('Error creating service provider:', error);
    throw error;
  }
};

export const updateProvider = async (data) => {
  try {
    
    const { service_provider_id,first_name, last_name, email, age, gender, first_language, second_language } = data;

    // Create a new service provider in the database
    const updateServiceProvider = await providerModel.update({
      service_provider_id,
      first_name,
      last_name,
      email,
      age,
      gender,
      first_language,
      second_language
    });


  



    return  updateServiceProvider ;
  } catch (error) {
    console.error('Error creating service provider:', error);
    throw error;
  }
};


export const updateVerifiedProvider = async (data) => {
  try {
    
    const { service_provider_id,first_name, last_name, email, mobile_no } = data;

    // Create a new service provider in the database
    const updateServiceProvider = await providerModel.updateVeryfied({
      service_provider_id,
      first_name,
      last_name,
      email,
      mobile_no
    });


  



    return  updateServiceProvider ;
  } catch (error) {
    console.error('Error creating service provider:', error);
    throw error;
  }
};