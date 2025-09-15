import { providerModel } from '../models/provider.model.js';


export const fetchServiceProviderId = async (data) => {
  try {

    const { mobile_no } = data;

    if (!mobile_no) {
      throw new Error(' mobile no is required');
    }

    const record = await providerModel.providerId(mobile_no);
    return record || false;
  } catch (error) {
    console.error('Error fetching id:', error.message);
    return false;
  }
};

export const fetchStatus = async (data) => {
  try {

    const { service_provider_id } = data;
console.log('fe',service_provider_id)
    if (!service_provider_id) {
      throw new Error('service_provider_id is required');
    }

    const record = await providerModel.checkStatus({service_provider_id});
    return record || false;
  } catch (error) {
    console.error('Error fetching status:', error.message);
    return false;
  }
};