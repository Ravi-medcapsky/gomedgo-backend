import * as providerStatusTrackingService from '../services/providerStatusTrackingService.js';
import * as providerPhoto from '../models/providerPhoto.model.js';

export const statusTracking = async (req , res) =>{
    try{
         const {mobile_no} = req.body;
         console.log(mobile_no);
         if(!mobile_no){
            res.status(400).json({message: 'mobile number Required'});
        }
        // fetching service provider id and current status
          const provider_data =  await providerStatusTrackingService.fetchServiceProviderId({mobile_no});
             console.log('provider_data',provider_data )
           const current_status = provider_data.current_status;
           console.log(current_status)
      

        
        if(current_status ==0)
        {
            const htmlContent = `<h1>Hello User </h1><p>Thanks for joining us!<br>Your Mobile is verified Go to Profile and give your Information </p>`;
            // redirect to Account or Profile page

            

        }
        else if(current_status == 1){
            const htmlContent = `<h1>Hello User </h1><p>Your Profile Picture Uploaded Sucessfully!<br>Go to Profile and give your Personal Data </p>`;

            // redirect to Provider Personal information page
           const Photo = await  providerPhoto.getPhotosById({service_provider_id })
            res.status(200).json({file: Photo});
            
        }
        else if(current_status == 2){
      htmlContent = `<h1>Hello User </h1><p>Your Personal information  Sucessfully !<br>Go to Profile and give your Address </p>`;

        }else if(current_status == 3){
             htmlContent = `<h1>Hello User </h1><p>Your Address added  Sucessfully!<br>Go to Profile and give your Documents </p>`;

        }else if(current_status ==4){
        htmlContent = `<h1>Hello User </h1><p>Your Documents uploaded  Sucessfully!<br>Go to Profile and give your Account Details  </p>`;

        }else if(current_status ==5){
          htmlContent = `<h1>Hello User </h1><p>Your Account is created  Sucessfully!<br>Please Wait for Approvment  </p>`;
        }else if(current_status == 6)
        {
           htmlContent = `<h1>Welcome to your Profile </h1> `;
        }else if(current_status == 7){
            htmlContent = `<h1>Your ID is Blocked </h1> `;
        }
    }catch(error){
        console.error('Status Tracking ERROR',error);
        res.status(500).json({message: 'Internal Server ERROR'})
    }
    

};