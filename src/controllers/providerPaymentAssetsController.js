import * as providerPaymentService from '../services/providerPaymentService.js';
import * as providerService from '../services/providerService.js';


export const providerPayment = async (req, res) => {
  try {
       
    const { upi_id, bank_holder_name, account_number, bank_name, ifsc_code } = req.body;

    
    const service_provider_id = req.session.service_provider_id
     console.log('service_provider_id',service_provider_id);
        
    
  // checking alredy filled or not payment  Data
    const existProviderpaymentAssets = await providerPaymentService .fetchProviderPaymentAssets(service_provider_id);
    console.log(' data in Provider PaymentAssets',existProviderpaymentAssets)
                    
    if(!existProviderpaymentAssets){
      if (upi_id) {
      const providerUpiPayment = await providerPaymentService.providerPaymentUpiAssets({ service_provider_id, upi_id });
      res.status(201).json({staus:201, message: 'Service Provider  Payment information save Successfully by UPI', providerUpiPayment});
    } else if (account_number) {
      const providePayment = await providerPaymentService.providerPaymentAssets({ service_provider_id, bank_holder_name, account_number, bank_name, ifsc_code });
      res.status(201).json({staus:201, message: 'Service Provider  Payment information save Successfully By Account', providePayment});

    }
    }else if(existProviderpaymentAssets){

       if (upi_id) {
      const providerUpiPaymentUpdate = await providerPaymentService.updateproviderPaymentUpiAssets({ service_provider_id, upi_id });
      res.status(200).json({staus:200, message: ' Payment information Upadted Successfully by UPI', providerUpiPaymentUpdate });
    } else if (account_number) {
      const providePaymentUpdate = await providerPaymentService.updateproviderPaymentAssets({ service_provider_id, bank_holder_name, account_number, bank_name, ifsc_code });
      res.status(200).json({ staus:200,message: 'Payment information Updated Successfully By Account', providePaymentUpdate });

    }

    }
   

    

  } catch (error) {
    console.error('Request  Error:', error);
    res.status(500).json({staus:500, message: 'Internal server error' });
  }
};

export const getProviderPaymentAssets = async (req, res) => {
  try {
    const service_provider_id = req.session.service_provider_id;
    const ProviderPaymentAssets = await providerPaymentService.fetchProviderPaymentAssets(service_provider_id);
    return res.status(200).json({ 
      status: 200,
      success: true,
      data: ProviderPaymentAssets
    });
  } catch (error) {
    res.status(500).json({status:500, error: error.message });
  }
};

export const updateProviderPaymentAssets = async (req, res) => {
  try {
      const { upi_id, bank_holder_name, account_number, bank_name, ifsc_code } = req.body;

    const service_provider_id = req.session.service_provider_id;

    // checking alredy filled or not payment  Data
    const existProviderpaymentAssets = await providerPaymentService .fetchProviderPaymentAssets(service_provider_id);
    console.log(' data in Provider PaymentAssets',existProviderpaymentAssets)

    if(existProviderpaymentAssets){

       if (upi_id) {
      const providerUpiPaymentUpdate = await providerPaymentService.updateproviderPaymentUpiAssets({ service_provider_id, upi_id });
      res.status(200).json({staus:200, message: ' Payment information Upadted Successfully by UPI', providerUpiPaymentUpdate });
    } else if (account_number) {
      const providePaymentUpdate = await providerPaymentService.updateproviderPaymentAssets({ service_provider_id, bank_holder_name, account_number, bank_name, ifsc_code });
      res.status(200).json({ staus:200,message: 'Payment information Updated Successfully By Account', providePaymentUpdate });

    }
    }else{
       res.status(404).json({ staus:404,message: 'Payment information not found'});

    }
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


