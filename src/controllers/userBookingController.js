import session from "express-session";
import * as userService from "../services/userService.js";
import * as userBookingService from "../services/userBookingSevice.js";
import { creditMoneyService } from "../services/wallet.service.js";
import  * as provider from "../services/providerService.js"


export const raiseBooking = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const user = await userService.getUserById(user_id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const {
      service_id,
      start_date,
      end_date,
      time,
      gender,
      first_language,
      second_language,
      address,
      patient_name,
      patient_phone,
      patient_age,
      total_cost,
      latitude,
      longitude
    } = req.body;

    const status = "pending";

    const booking = await userBookingService.bookingCreate({
      user_id,
      service_id,
      start_date,
      end_date,
      time,
      gender,
      first_language,
      second_language,
      address,
      patient_name,
      patient_phone,
      patient_age,
      total_cost,
      status,
      latitude,
      longitude
    });

    if (!booking || !booking.data) {
      return res.status(400).json({ status: 400, message: "Booking not created" });
    }

    // Store important values in session
    req.session.booking_id = booking.data.id;
    req.session.user_id = booking.data.user_id;
    req.session.service_category_id = booking.data.service_id;
    req.session.total_cost = booking.data.total_cost;
    // creating all availble provider in appointment
      const createAppointmentdata = await userBookingService.createAvaibleProvidersAppointment(
      booking.data.id,
      booking.data.service_id,
      booking.data.total_cost
    );
    console.log('createAppointmentdata',createAppointmentdata)
   
    // Respond immediately
    res.status(201).json({
      success: true,
      message: "Your booking has been raised successfully. Waiting for provider assignment.",
      status: 201,
      data: {
        booking: booking.data,
        },
    });

  } catch (error) {
    console.error("Raise Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500
    });
  }
};

// if user click ok button then provider Assign


export const ok = async (req, res) => {
try{

   const booking_id =  req.session.booking_id
   const service_category_id =req.session.service_category_id 
  
 // Fetch available providers
    const mappingProviders = await userBookingService.fetchAvaibleProviders(
      booking_id,
      service_category_id
      
    );
    console.log('mappingProviders',mappingProviders)

    req.session.appointment_id = mappingProviders.confirmedAppointments.id
   console.log(' req.session.appointment_id', req.session.appointment_id)
    
   const confirmed_service_provider_id = mappingProviders.confirmedAppointments.service_provider_id
    console.log('confirmed_service_provider_id',confirmed_service_provider_id)

    const your_provider = await provider.fetchProviderConfirmed(confirmed_service_provider_id)
if (fetch) {
  return res.status(200).json({
    status: true,
    status: 200,
    message: "Your provider",
    data: your_provider
  });
}

}catch (error) {
    console.error("fetch your provider  Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

};




export const fetchBooking = async (req, res) => {
try{
  const booking_id = req.session.booking_id;
  const user_id = req.session.user_id;
  const fetch = await userBookingService.fetch({booking_id,user_id})
if (fetch) {
  return res.status(200).json({
    status: true,
    status: 200,
    message: "Your previous Booking",
    data:fetch
  });
}

}catch (error) {
    console.error("fetch Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

};


export const cancleBooking = async (req, res) => {
try{
  const booking_id = req.session.booking_id;
  const user_id = req.session.user_id;
  const {cancle_reason} = req.body;
  
  

  const cancle = await userBookingService.cancle({booking_id,user_id,cancle_reason})
if (cancle) {
  return res.status(200).json({
    status: true,
    status: 200,
    message: "Your booking has been cancelled"
  });
}

}catch (error) {
    console.error("cancle Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

};