import * as providerAddressService from '../services/providerAddressService.js';
import * as providerService from '../services/providerService.js';


export const createProviderAddress = async (req, res, next) => {
  try {
    const {
      
      street,
      city,
      state,
      postal_code,
      country,
      latitude,
      longitude,
    } = req.body;


    const service_provider_id =  req.session.service_provider_id
    console.log('service_provider_id',service_provider_id);

    // TO Check : All fields are required
    if (
       !street || !city || !state ||
      !postal_code || !country || latitude === undefined || longitude === undefined
    ) {
      return res.status(400).json({status:400, message: "All fields are required",status:400 });

    }

        // checking alredy filled or not Address Data
         const existProviderAddress = await providerAddressService.fetchProviderAddress(service_provider_id);

        console.log(' data in Provider Address',existProviderAddress)
                
                if(existProviderAddress){
                  console.log("exist Provider Address");
                const providerAddressupdate =   await providerAddressService.updateProviderAddressService({
                      service_provider_id,
                      street,
                      city,
                      state,
                      postal_code,
                      country,
                      latitude,
                      longitude
                    });
                    return res.status(200).json({ 
                      status: 200,
                      success: true,
                      message: 'Address updated successfully',
                      data: providerAddressupdate
                    });                 }else {
                   const providerAddress =  await providerAddressService.createProviderAddressService({
                      service_provider_id,
                      street,
                      city,
                      state,
                      postal_code,
                      country,
                      latitude,
                      longitude
                    });
                   return res.status(201).json({ 
                      status: 201,
                      success: true,
                      message: 'Address insrted successfully',
                      data: providerAddress
                    });
        
                 }

     

  } catch (error) {
    next(error);
  }
};

export const getProviderAddress = async (req, res) => {
  try {
    const service_provider_id = req.session.service_provider_id;
    const address = await providerAddressService.fetchProviderAddress(service_provider_id);
    return res.status(200).json({ 
      status: 200,
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({status:500, error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    
    const service_provider_id = req.session.service_provider_id;

    

    const updated = await providerAddressService.updateProviderAddressService({  service_provider_id,
                      street,
                      city,
                      state,
                      postal_code,
                      country,
                      latitude,
                      longitude});
    res.status(200).json({status:200, message: 'Address updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({status:500, error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
        const service_provider_id = req.session.service_provider_id;


    await providerAddressService.deleteProviderAddress({ service_provider_id });
    res.status(200).json({ status:200,message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
