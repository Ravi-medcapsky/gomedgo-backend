
import * as appoitnmentService from "../services/appointmentService.js";
import * as userbookingService from "../services/userBookingSevice.js";
import { creditMoneyService } from "../services/wallet.service.js";
import { get,minus }  from "../services/wallet.service.js"




export const fetchAppoitnment = async (req, res) => {
    try {
         
        const service_provider_id = req.session.service_provider_id

        const appointmentData = await appoitnmentService.getAppointment(service_provider_id);
         console.log('appointmentData.booking_id',appointmentData.booking_id)
         req.session.booking_id = appointmentData.booking_id
        res.status(200).json({ status:200 ,data:appointmentData });
    } catch (error) {
        res.status(400).json({ message: error.message, status:400 });
    }
};

export const confirmed = async (req, res) => {
    try {
         
        const service_provider_id = req.session.service_provider_id
        const booking_id = req.session.booking_id
        const appointmentconfirmed = await appoitnmentService.confirmedAppointment(service_provider_id,booking_id);
        if(appointmentconfirmed){
          res.status(200).json({ status:200 ,message:"You have confirmed appointment please reached patient home on shelude time",data:appointmentconfirmed });

        const appointmentWaiting = await appoitnmentService.waitingAppointment(service_provider_id,booking_id);
         console.log('appointmentWaiting', appointmentWaiting)
        }
    } catch (error) {
        res.status(400).json({ message: error.message, status:400 });
    }
};

export const done = async (req, res) => {
  try {
    const service_provider_id = req.session.service_provider_id;
    const booking_id = req.session.booking_id;
    const appointment_id = req.session.appointment_id;

 

    const appointmentDone = await appoitnmentService.doneAppointment(
      service_provider_id,
      booking_id
    );

    if (!appointmentDone) {
      return res.status(404).json({ status: 404, message: "Appointment not found" });
    }

    // ✅ Assume payment mode check (replace with actual logic if needed)
    let payment_mode = "prepaid";

    if (payment_mode === "online") {

           const bookingData = await userbookingService.getbooking(booking_id)
        console.log('bookingData', bookingData)
        console.log('bookingData.total cost', bookingData.data.total_cost)
     
      const medcapsky_cost = (bookingData.data.total_cost * 30) / 100; // 30% payout for medcapsky 
      console.log('medcapsky_cost',medcapsky_cost)// adding API to pay medcapsky
      console.log("Completing service for appointment:", appointment_id);

      const serviceCompleted = await userbookingService.servicecomplete(appointment_id);
      console.log("Service Completed:", serviceCompleted);

      if (
        serviceCompleted &&
        serviceCompleted.data &&
        serviceCompleted.data.status === "done"
      ) {
        const providerId = serviceCompleted.data.service_provider_id;
        const balance = serviceCompleted.data.total_cost;

        console.log("Crediting money to provider:", providerId, "amount:", balance);

        const result = await creditMoneyService(providerId, balance);
        console.log("Money credited successfully:", result);
      }

      const appointmentWaitingDelete =
        await appoitnmentService.waitingAppointmentDelete(service_provider_id, booking_id);

      console.log("appointmentWaitingDelete:", appointmentWaitingDelete);

      // ✅ Send response after everything is complete
      return res.status(200).json({
        status: 200,
        message: "Service completed and payment process handled.",
        data: appointmentDone,
      });
    }
    else if(payment_mode == 'offline'){

        // if pay offline add 2% more 
        const bookingData = await userbookingService.getbooking(booking_id)
        console.log('bookingData', bookingData)
        console.log('bookingData.data.total cost data', bookingData.data.total_cost)
        const extra_cost_COD = (bookingData.data.total_cost * 2) / 100;
         console.log('extra_cost_COD', extra_cost_COD)
        const final_COD_cost = bookingData.data.total_cost +  extra_cost_COD;
        console.log('final_COD_cost',final_COD_cost)
        const medcapsky_cost = (final_COD_cost * 30) / 100;
        console.log('medcapsky_cost',medcapsky_cost)
        const provider_cost = (final_COD_cost * 70) / 100;
        console.log('provider_cost',provider_cost)

        const wallet = await get(service_provider_id)
        console.log('wallet',wallet)
        // checking if blance avaible in provider wallet then minus(-) medcapsky_cost from wallet
        if(wallet.balance >=medcapsky_cost){
          const minusfromwallet = await minus(service_provider_id,medcapsky_cost)
           console.log('minuesfromwallet',minusfromwallet)// Add minus to medcapsky
        }else if(payToMedCapSky) {
           // call API to make payment medcapky medcapsky_cost from provider
        }
          const appointmentWaitingDelete =
        await appoitnmentService.waitingAppointmentDelete(service_provider_id, booking_id);

      console.log("appointmentWaitingDelete:", appointmentWaitingDelete);
        

    // ✅ Fallback if payment mode is not online
    return res.status(200).json({
      status: 200,
      message: "Service completed with offline payment .",
      data: appointmentDone,
    });
   }else if (payment_mode == 'prepaid'){
    
            // if pay offline add 2% less 
        const bookingData = await userbookingService.getbooking(booking_id)
        console.log('bookingData', bookingData)
        console.log('bookingData.data.total cost data', bookingData.data.total_cost)

        const less_prepaid_cost = (bookingData.data.total_cost * 2) / 100;
         console.log('less_prepaid_cost', less_prepaid_cost)
        const final_prepaid_cost = bookingData.data.total_cost - less_prepaid_cost;
        console.log('final_prepaid_cost',final_prepaid_cost)
        const medcapsky_cost = (final_prepaid_cost* 30) / 100;
        console.log('medcapsky_cost',medcapsky_cost)
        const provider_cost = (final_prepaid_cost * 70) / 100;
        console.log('provider_cost',provider_cost)
     
      console.log("Completing service for appointment:", appointment_id);

      const serviceCompleted = await userbookingService.servicecomplete(appointment_id);
      console.log("Service Completed:", serviceCompleted);

      if (
        serviceCompleted &&
        serviceCompleted.data &&
        serviceCompleted.data.status === "done"
      ) {
        const providerId = serviceCompleted.data.service_provider_id;
        const balance = serviceCompleted.data.total_cost;

        console.log("Crediting money to provider:", providerId, "amount:", balance);

        const result = await creditMoneyService(providerId,provider_cost);
        console.log("Money credited successfully:", result);
      }

      const appointmentWaitingDelete =
        await appoitnmentService.waitingAppointmentDelete(service_provider_id, booking_id);

      console.log("appointmentWaitingDelete:", appointmentWaitingDelete);

      // ✅ Send response after everything is complete
      return res.status(200).json({
        status: 200,
        message: "Service completed and payment credited.",
        data: appointmentDone,
      });
    }

   

  } catch (error) {
    console.error("Error in done controller:", error.message);
    return res.status(400).json({ message: error.message, status: 400 });
  }
};
