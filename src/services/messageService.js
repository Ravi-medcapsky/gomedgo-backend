
import { messageModel } from '../models/message.model.js';

export const messageSend = async (data) =>{
try{
      const {message,message_sender_id,role} = data;
      
     console.log(' service message',message)
     
     console.log(' service message sender_id',message_sender_id)

      console.log('role',role)    
      
           
      const createMessage =  await messageModel.create(message,message_sender_id,role);
      return createMessage ;
     
 
   }catch (error) {
    console.error('Error fetch  provider Id:', error);
    throw error;
   }

};