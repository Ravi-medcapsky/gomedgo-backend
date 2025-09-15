import * as messageService from '../services/messageService.js'

export const messageToAdmin = async (req, res) => {
  try {
    console.log('req body',req.body)
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        status: false,
        message: "Message cannot be empty",
      });
    }

    const role = req.session.role_session;
   console.log('Role:', role);
    if(role=== 'user'){
        const message_sender_id = req.session.user_id
        console.log('user_id_controller',message_sender_id)
        const userMessageToAdmin = await messageService.messageSend({message,message_sender_id,role});
    
    if (userMessageToAdmin) {
      return res.status(200).json({
        status: true,
        message: "Your message was successfully sent to MedCapSky",
        data: userMessageToAdmin,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to send the message. Please try again.",
      });
    }

    }else  if(role=== 'provider'){
        const message_sender_id = req.session.service_provider_id
        console.log('service_provider_id controller',message_sender_id)
        const userMessageToAdmin = await messageService.messageSend({message,message_sender_id,role});
    
    if (userMessageToAdmin) {
      return res.status(200).json({
        status: true,
        message: "Your message was successfully sent to MedCapSky",
        data: userMessageToAdmin,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to send the message. Please try again.",
      });
    }

    }

   


  } catch (error) {
    console.error("Message to Admin Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


